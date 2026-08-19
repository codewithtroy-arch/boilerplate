'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

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
      {/* Floating bag button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 items-center gap-2.5 rounded-full bg-pink px-5 text-sm font-medium text-white shadow-[0_8px_28px_rgba(232,154,170,0.45)] transition-all hover:scale-105 hover:bg-pink-dark"
        aria-label="Open bag"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <span className="hidden sm:inline">Bag</span>
        {count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/90 px-1.5 text-[11px] font-semibold text-ink">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          <div className="relative flex h-full w-full max-w-[420px] flex-col bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.15)] dark:bg-[#1c1b1a]">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 dark:border-white/5">
              <h3 className="font-display text-2xl font-medium text-ink dark:text-[#f2f0ed]">
                Your Bag
              </h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-black/5 dark:text-[#a8a49e] dark:hover:bg-white/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {status === 'success' ? (
                <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/30 text-2xl">
                    ✓
                  </div>
                  <p className="font-display text-2xl text-ink dark:text-[#f2f0ed]">
                    Payment confirmed
                  </p>
                  <p className="max-w-xs text-sm text-text-light dark:text-[#a8a49e]">
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
                    className="w-full rounded-full bg-sage px-3 py-3.5 text-center text-sm font-medium text-ink shadow-lg transition-transform hover:scale-[1.02]"
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
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="text-base font-medium text-ink dark:text-[#f2f0ed]">
                    Your bag is empty
                  </p>
                  <p className="text-xs text-text-light dark:text-[#a8a49e]">
                    Discover products you&apos;ll love
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-4 rounded-full bg-pink px-7 py-3 text-sm font-medium text-white transition-all hover:bg-pink-dark"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 border-b border-black/5 pb-5 dark:border-white/5"
                    >
                      <div className="flex-1">
                        <p className="text-[15px] font-medium text-ink dark:text-[#f2f0ed]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-text-light dark:text-[#a8a49e]">
                          ₦{item.price.toLocaleString()} each
                        </p>
                        <div className="mt-3 flex items-center gap-2.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-sm transition-colors hover:bg-pink-soft dark:border-white/10 dark:hover:bg-white/10"
                          >
                            −
                          </button>
                          <span className="min-w-[1.25rem] text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-sm transition-colors hover:bg-pink-soft dark:border-white/10 dark:hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-ink dark:text-[#f2f0ed]">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-2 text-xs text-blush underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && status !== 'success' && (
              <div className="space-y-3 border-t border-black/5 px-6 py-5 dark:border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-text-light dark:text-[#a8a49e]">Subtotal</span>
                  <strong className="text-base text-ink dark:text-[#f2f0ed]">
                    ₦{total.toLocaleString()}
                  </strong>
                </div>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-black/10 bg-marble/50 px-4 py-3 text-sm outline-none transition-colors focus:border-pink dark:border-white/10 dark:bg-transparent dark:text-[#f2f0ed]"
                />

                <button
                  onClick={handlePayAndCheckout}
                  disabled={status === 'paying' || status === 'verifying'}
                  className="w-full rounded-full bg-pink px-3 py-3.5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(232,154,170,0.35)] transition-all hover:bg-pink-dark disabled:opacity-50 dark:bg-pink-dark dark:text-[#1a1510]"
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
