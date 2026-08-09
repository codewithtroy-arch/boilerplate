import type { CartItem } from './cart-context';
import { siteConfig } from './site-config';

/**
 * Builds a wa.me link pre-filled with a clean, structured order summary.
 * Opening it hands the merchant a ready-to-confirm message instead of a
 * back-and-forth chat. Pass paymentReference once Paystack has confirmed
 * payment, so the merchant knows it's already paid for.
 */
export function buildWhatsAppOrderLink(
  items: CartItem[],
  total: number,
  paymentReference?: string
) {
  const merchantNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!merchantNumber) {
    throw new Error(
      'NEXT_PUBLIC_WHATSAPP_NUMBER is not set. Add it in your environment variables.'
    );
  }

  const lines = [
    `New order — ${siteConfig.businessName}:`,
    '',
    ...items.map(
      (item) =>
        `• ${item.name} x${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}`
    ),
    '',
    `Total: ₦${total.toLocaleString()}`,
    ...(paymentReference
      ? ['', `✅ Paid via Paystack — Ref: ${paymentReference}`]
      : []),
  ];

  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${merchantNumber}?text=${message}`;
}
