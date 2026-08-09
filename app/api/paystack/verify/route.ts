import { NextResponse } from 'next/server';

/**
 * Verifies a Paystack transaction reference server-side. The secret key
 * lives only here — never send it to the browser. Always verify before
 * treating an order as paid; the client-side popup callback alone can be
 * tampered with.
 */
export async function POST(request: Request) {
  const { reference } = await request.json();

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
    {
      headers: { Authorization: `Bearer ${secretKey}` },
    }
  );

  const data = await res.json();

  if (!res.ok || data?.data?.status !== 'success') {
    return NextResponse.json(
      { verified: false, message: data?.message ?? 'Verification failed' },
      { status: 200 }
    );
  }

  return NextResponse.json({
    verified: true,
    amount: data.data.amount / 100, // Paystack amounts are in kobo
    reference: data.data.reference,
  });
}
