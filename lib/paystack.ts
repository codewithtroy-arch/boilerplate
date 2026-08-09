// Paystack's inline.js script attaches PaystackPop to window. We load that
// script via next/script on the catalog page, then call this.
declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number; // in kobo
        currency?: string;
        ref: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export function payWithPaystack({
  email,
  amountNaira,
  onSuccess,
  onClose,
}: {
  email: string;
  amountNaira: number;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error(
      'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not set. Add it in your environment variables.'
    );
  }

  if (!window.PaystackPop) {
    throw new Error(
      'Paystack script not loaded yet — try again in a moment.'
    );
  }

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email,
    amount: Math.round(amountNaira * 100), // Paystack expects kobo
    currency: 'NGN',
    ref: `order_${Date.now()}`,
    callback: (response) => onSuccess(response.reference),
    onClose,
  });

  handler.openIframe();
}
