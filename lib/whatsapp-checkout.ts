import type { CartItem } from './cart-context';

/**
 * Builds a wa.me link pre-filled with a clean, structured order summary.
 * Opening it hands the merchant a ready-to-confirm message instead of a
 * back-and-forth chat.
 */
export function buildWhatsAppOrderLink(items: CartItem[], total: number) {
  const merchantNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!merchantNumber) {
    throw new Error(
      'NEXT_PUBLIC_WHATSAPP_NUMBER is not set. Add it in your environment variables.'
    );
  }

  const lines = [
    'New order:',
    '',
    ...items.map(
      (item) =>
        `• ${item.name} x${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}`
    ),
    '',
    `Total: ₦${total.toLocaleString()}`,
  ];

  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${merchantNumber}?text=${message}`;
}
