import type { CartItem } from './cart-context';

/**
 * Builds a wa.me link pre-filled with a clean, structured order summary.
 * Opening it hands the merchant a ready-to-confirm message instead of a
 * back-and-forth chat. businessName and whatsappNumber now come from the
 * settings table (editable in /admin/settings) instead of env vars.
 */
export function buildWhatsAppOrderLink(
  items: CartItem[],
  total: number,
  businessName: string,
  whatsappNumber: string | null,
  paymentReference?: string
) {
  if (!whatsappNumber) {
    throw new Error(
      'No WhatsApp number set yet — add one in /admin/settings.'
    );
  }

  const lines = [
    `New order — ${businessName}:`,
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
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}
