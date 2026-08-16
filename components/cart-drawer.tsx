'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { buildWhatsAppOrderLink } from '@/lib/whatsapp-checkout';
import { payWithPaystack } from '@/lib/paystack';

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
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 border-[1.5px] border-ink bg-cobalt px-6 py-3 text-sm font-medium uppercase tracking-wide text-paper"
      >
        Bag {count > 0 && `[${count}]`}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40">
          <div className="flex h-full w-full max-w-sm flex-col gap-5 border-l-[1.5px] border-ink bg-paper p-6">
            <div className="flex items-center justify-between border-b-[1.5px] border-ink pb-4">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
                Your bag
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-xs uppercase text-ink/60 underline"
              >
                Close
              </button>
            </div>

            {status === 'success' ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <p className="font-display text-xl font-bold uppercase text-ink">
                  Payment confirmed
                </p>
                <p className="text-sm text-ink/60">
                  Tap below to send your order to the shop on WhatsApp.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border-[1.5px] border-ink bg-ink px-3 py-3 text-center text-sm font-medium uppercase tracking-wide text-paper transition-colors hover:bg-cobalt hover:border-cobalt"
                >
                  Continue to WhatsApp
                </a>
                <button onClick={handleReset} className="text-xs text-ink/50 underline">
                  Done
                </button>
              </div>
            ) : (
              <>
                {items.length === 0 ? (
                  <p className="text-sm text-ink/60">Your bag is empty.</p>
                ) : (
                  <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 border-b border-ink/10 pb-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ink">{item.name}</p>
                          <p className="ref-tag text-xs text-ink/50">
                            ₦{item.price.toLocaleString()} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 border border-ink/30 text-xs"
                          >
                            −
                          </button>
                          <span className="ref-tag w-4 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 border border-ink/30 text-xs"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs uppercase text-blush underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {items.length > 0 && (
                  <div className="space-y-3 border-t-[1.5px] border-ink pt-4">
                    <div className="flex justify-between text-sm font-medium text-ink">
                      <span className="uppercase">Total</span>
                      <span className="ref-tag">₦{total.toLocaleString()}</span>
                    </div>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-ink/30 px-3 py-2 text-sm"
                    />

                    <button
                      onClick={handlePayAndCheckout}
                      disabled={status === 'paying' || status === 'verifying'}
                      className="w-full border-[1.5px] border-ink bg-ink px-3 py-3 text-sm font-medium uppercase tracking-wide text-paper transition-colors hover:bg-cobalt hover:border-cobalt disabled:opacity-50"
                    >
                      {status === 'paying' && 'Waiting for payment...'}
                      {status === 'verifying' && 'Confirming payment...'}
                      {(status === 'idle' || status === 'error') &&
                        `Pay ₦${total.toLocaleString()} & checkout`}
                    </button>

                    {errorMsg && <p className="text-xs text-blush">{errorMsg}</p>}

                    <button
                      onClick={clear}
                      className="w-full text-center text-xs uppercase text-ink/50 underline"
                    >
                      Clear bag
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
