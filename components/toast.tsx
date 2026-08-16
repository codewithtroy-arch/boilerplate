'use client';

import { useCart } from '@/lib/cart-context';

export function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="toast-enter fixed bottom-8 left-1/2 z-[500] -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-marble shadow-xl dark:bg-pink-dark dark:text-[#1a1510]">
      {toastMessage}
    </div>
  );
}
