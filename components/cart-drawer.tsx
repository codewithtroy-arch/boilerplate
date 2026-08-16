'use client';

import { useState } from 'react';
import { useCart, type CartItem } from '@/lib/cart-context';
import { buildWhatsAppOrderLink } from '@/lib/whatsapp-checkout';
import { payWithPaystack } from '@/lib/paystack';
import { ReviewPrompt } from './review-prompt';

type CheckoutStatus = 'idle' | 'paying' | 'verifying' | 'success' | 'error';

export function CartDrawer({
  businessName,
  whatsappNumber,
}: {
  businessName: string;
  whatsappNumber: string | null;
}) {
  const { items, updateQuantity, removeItem, total, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  async function handlePayAndCheckout() {
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Enter a valid email to pay.');
      return;
    }

    setStatus('paying');

    try {
      payWithPaystack({
        email,
        amountNaira: total,
        onClose: () => setStatus('idle'),
        onSuccess: async (reference) => {
          setStatus('verifying');
          try {
            const res = await fetch('/api/paystack/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reference, email, items }),
            });
            const data = await res.json();

            if (!data.verified) {
              setStatus('error');
              setErrorMsg(
                'Payment could not be verified. If you were charged, contact the shop directly.'
              );
              return;
            }

            setWhatsappLink(
              buildWhatsAppOrderLink(items, total, businessName, whatsappNumber, reference)
            );
            setPurchasedItems(items);
            clear();
            setStatus('success');
          } catch {
            setStatus('error');
            setErrorMsg('Could not verify payment — check your connection and try again.');
          }
        },
      });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not start payment.');
    }
  }

  function handleReset() {
    setStatus('idle');
    setWhatsappLink('');
    setPurchasedItems([]);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-pink px-6 py-3.5 text-sm font-medium text-ink shadow-xl transition-transform hover:scale-105"
      >
        Bag {count > 0 && <span className="rounded-full bg-white/60 px-2 py-0.5">{count}</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="flex h-full w-full max-w-sm flex-col bg-white dark:bg-[#1c1b1a]">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 dark:border-white/5">
              <h3 className="font-display text-2xl text-ink dark:text-[#f2f0ed]">Your Bag</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="text-xl text-ink/60 dark:text-[#a8a49e]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {status === 'success' ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="font-display text-2xl text-ink dark:text-[#f2f0ed]">
                    Payment confirmed 🎉
                  </p>
                  <p className="text-sm text-text-light dark:text-[#a8a49e]">
                    Tap below to send your order to the shop on WhatsApp.
                  </p>

                  {purchasedItems.length > 0 && (
                    <div className="flex w-full flex-col gap-2">
                      {purchasedItems.map((item) => (
                        <ReviewPrompt
                          key={item.id}
                          productId={item.id}
                          productName={item.name}
                        />
                      ))}
                    </div>
                  )}

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-full bg-sage px-3 py-3.5 text-center text-sm font-medium text-ink shadow-lg"
                  >
                    Continue to WhatsApp
                  </a>
                  <button
                    onClick={handleReset}
                    className="text-xs text-text-light underline dark:text-[#a8a49e]"
                  >
                    Done
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <p className="text-base font-medium text-ink dark:text-[#f2f0ed]">
                    Your bag is empty
                  </p>
                  <p className="text-xs text-text-light dark:text-[#a8a49e]">
                    Discover products you&apos;ll love
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-4 rounded-full bg-pink px-6 py-3 text-sm font-medium text-ink"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 border-b border-black/5 pb-4 dark:border-white/5"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink dark:text-[#f2f0ed]">
                          {item.name}
                        </p>
                        <p className="text-xs text-text-light dark:text-[#a8a49e]">
                          ₦{item.price.toLocaleString()} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-soft text-sm dark:bg-white/10"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-soft text-sm dark:bg-white/10"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-blush underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && status !== 'success' && (
              <div className="space-y-3 border-t border-black/5 px-6 py-5 dark:border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-text-light dark:text-[#a8a49e]">Subtotal</span>
                  <strong className="text-ink dark:text-[#f2f0ed]">
                    ₦{total.toLocaleString()}
                  </strong>
                </div>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-black/10 px-4 py-2.5 text-sm dark:border-white/10 dark:bg-transparent dark:text-[#f2f0ed]"
                />

                <button
                  onClick={handlePayAndCheckout}
                  disabled={status === 'paying' || status === 'verifying'}
                  className="w-full rounded-full bg-ink px-3 py-3.5 text-sm font-medium text-marble shadow-lg disabled:opacity-50 dark:bg-pink-dark dark:text-[#1a1510]"
                >
                  {status === 'paying' && 'Waiting for payment...'}
                  {status === 'verifying' && 'Confirming payment...'}
                  {(status === 'idle' || status === 'error') &&
                    `Pay ₦${total.toLocaleString()} & checkout`}
                </button>

                {errorMsg && <p className="text-xs text-blush">{errorMsg}</p>}

                <button
                  onClick={clear}
                  className="w-full text-center text-xs text-text-light underline dark:text-[#a8a49e]"
                >
                  Clear bag
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
