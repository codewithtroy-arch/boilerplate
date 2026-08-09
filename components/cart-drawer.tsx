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
        className="fixed bottom-4 right-4 rounded-full bg-primary px-4 py-3 text-sm text-primary-foreground shadow-lg"
      >
        Cart ({count})
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="flex h-full w-full max-w-sm flex-col gap-4 bg-background p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your order</h2>
              <button onClick={() => setOpen(false)} className="text-sm">
                Close
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Cart is empty.</p>
            ) : (
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ₦{item.price.toLocaleString()} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 rounded border border-border text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 rounded border border-border text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="space-y-2 border-t border-border pt-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-md bg-green-600 px-3 py-2 text-sm text-white"
                >
                  Checkout via WhatsApp
                </button>
                <button
                  onClick={clear}
                  className="w-full text-center text-xs text-muted-foreground"
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
