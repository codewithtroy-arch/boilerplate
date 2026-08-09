'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { buildWhatsAppOrderLink } from '@/lib/whatsapp-checkout';

export function CartDrawer() {
  const { items, updateQuantity, removeItem, total, clear } = useCart();
  const [open, setOpen] = useState(false);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  function handleCheckout() {
    const link = buildWhatsAppOrderLink(items, total);
    window.open(link, '_blank');
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="signboard-border fixed bottom-5 right-5 z-40 rounded-full bg-chili px-5 py-3 font-display text-sm text-paper transition-transform active:scale-95"
      >
        Cart {count > 0 && `(${count})`}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40">
          <div className="flex h-full w-full max-w-sm flex-col gap-4 border-l-[3px] border-ink bg-paper p-4">
            <div className="flex items-center justify-between border-b-2 border-dashed border-ink/30 pb-3">
              <h2 className="font-display text-lg text-ink">Your order</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border-2 border-ink px-2 py-1 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Cart&apos;s empty — go add something tasty.
              </p>
            ) : (
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 border-b border-dashed border-ink/20 pb-2 font-tag text-xs"
                  >
                    <div className="flex-1 font-body">
                      <p className="text-sm font-semibold text-ink">{item.name}</p>
                      <p className="text-muted-foreground">
                        ₦{item.price.toLocaleString()} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 rounded border-2 border-ink font-bold"
                      >
                        -
                      </button>
                      <span className="w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 rounded border-2 border-ink font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="font-body text-chili"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="space-y-2 border-t-2 border-dashed border-ink/30 pt-3">
                <div className="flex justify-between font-tag text-base font-bold text-ink">
                  <span>TOTAL</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="signboard-border w-full rounded-md bg-leaf px-3 py-2.5 text-sm font-semibold text-paper transition-transform active:scale-95"
                >
                  Checkout via WhatsApp
                </button>
                <button
                  onClick={clear}
                  className="w-full text-center text-xs text-muted-foreground underline"
                >
                  Clear cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
