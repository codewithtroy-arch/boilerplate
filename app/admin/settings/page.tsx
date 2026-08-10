import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/get-profile';
import { getSettings } from '@/lib/get-settings';
import { updateSettings } from './actions';

export default async function AdminSettingsPage() {
  const { user, role } = await getCurrentProfile();
  if (!user) redirect('/login');
  if (role !== 'admin') redirect('/dashboard');

  const settings = await getSettings();

  return (
    <main className="mx-auto max-w-2xl p-6 pb-24">
      <h1 className="font-display text-3xl italic text-ink">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Change these anytime — updates show up on your live shop within a
        minute.
      </p>

      <form
        action={updateSettings}
        className="refined-card mt-6 flex flex-col gap-4 rounded-lg bg-paper p-4"
      >
        <div>
          <label className="text-xs text-muted-foreground">Business name</label>
          <input
            name="business_name"
            defaultValue={settings.business_name}
            required
            className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Tagline</label>
          <input
            name="tagline"
            defaultValue={settings.tagline}
            className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">
            WhatsApp number (international format, no + or spaces — e.g.
            2348031234567)
          </label>
          <input
            name="whatsapp_number"
            defaultValue={settings.whatsapp_number ?? ''}
            placeholder="2348031234567"
            className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
          {!settings.whatsapp_number && (
            <p className="mt-1 text-xs text-blush">
              Not set yet — checkout won&apos;t work until you add this.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="self-start rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper"
        >
          Save
        </button>
      </form>

      <div className="refined-card mt-6 rounded-lg bg-paper p-4">
        <p className="text-sm font-medium text-ink">Payments (Paystack)</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Paystack keys are set as environment variables in Vercel, not
          here, since they're sensitive. See the README for setup steps.
        </p>
      </div>
    </main>
  );
}
