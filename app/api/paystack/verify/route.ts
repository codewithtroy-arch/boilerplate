import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

type OrderItem = { id: string; name: string; price: number; quantity: number };

/**
 * Verifies a Paystack transaction reference server-side, then records the
 * order and decrements stock. The secret key lives only here — never send
 * it to the browser. Always verify before treating an order as paid; the
 * client-side popup callback alone can be tampered with.
 */
export async function POST(request: Request) {
  const { reference, email, items } = (await request.json()) as {
    reference?: string;
    email?: string;
    items?: OrderItem[];
  };

  if (!reference) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: 'PAYSTACK_SECRET_KEY is not set on the server' },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey}` } }
  );
  const data = await res.json();

  if (!res.ok || data?.data?.status !== 'success') {
    return NextResponse.json(
      { verified: false, message: data?.message ?? 'Verification failed' },
      { status: 200 }
    );
  }

  const verifiedAmount = data.data.amount / 100; // kobo -> naira

  // Record the order and decrement stock. Best-effort: if this fails, the
  // payment itself already succeeded, so we still return verified: true —
  // losing a stock count shouldn't make a paying customer think they
  // weren't charged. Logged for you to reconcile manually if it happens.
  try {
    const supabase = createServiceClient();

    await supabase.from('orders').insert({
      email: email ?? 'unknown',
      total: verifiedAmount,
      reference: data.data.reference,
      items: items ?? [],
    });

    if (items && items.length > 0) {
      for (const item of items) {
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.id)
          .single();

        if (product) {
          const newQuantity = Math.max(0, product.stock_quantity - item.quantity);
          await supabase
            .from('products')
            .update({ stock_quantity: newQuantity })
            .eq('id', item.id);
        }
      }
    }
  } catch (err) {
    console.error('Order recording failed (payment still valid):', err);
  }

  return NextResponse.json({
    verified: true,
    amount: verifiedAmount,
    reference: data.data.reference,
  });
}
