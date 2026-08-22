import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/get-profile';
import { getSettings } from '@/lib/get-settings';
import { updateSettings } from './actions';

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: { saved?: string; error?: string };
}) {
  const { user, role } = await getCurrentProfile();
  if (!user) redirect('/login');
  if (role !== 'admin') redirect('/dashboard');

  const settings = await getSettings();

  return (
    <main className="mx-auto max-w-2xl p-6 pb-24">
      <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-ink">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Change these anytime — updates show up on your live shop within a
        minute.
      </p>

      {searchParams.saved && (
        <div className="mt-4 rounded-md border border-cobalt/30 bg-cobalt/5 px-4 py-2 text-sm text-cobalt">
          Saved.
        </div>
      )}
      {searchParams.error && (
        <div className="mt-4 rounded-md border border-blush/40 bg-blush/10 px-4 py-2 text-sm text-blush">
          Couldn&apos;t save: {searchParams.error}
        </div>
      )}

      <form
        action={updateSettings}
        className="label-card mt-6 flex flex-col gap-4 rounded-lg bg-paper p-4"
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

        <div>
          <label className="text-xs text-muted-foreground">
            About your shop (shown in the About section on your catalog page)
          </label>
          <textarea
            name="about_text"
            defaultValue={settings.about_text}
            rows={4}
            className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">
            Announcement bar (optional — shown as a dismissible strip at the
            very top of your shop, e.g. a promo or delivery note)
          </label>
          <input
            name="announcement_text"
            defaultValue={settings.announcement_text ?? ''}
            placeholder="e.g. Free delivery on orders over ₦20,000"
            className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">
            Hero headline (the large text on your homepage)
          </label>
          <input
            name="hero_headline"
            defaultValue={settings.hero_headline}
            className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Trust badges (the 4 small badges under Reviews) — only claim
            things that are actually true for your business
          </p>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              name="trust_badge_1"
              defaultValue={settings.trust_badge_1}
              className="rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
            <input
              name="trust_badge_2"
              defaultValue={settings.trust_badge_2}
              className="rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
            <input
              name="trust_badge_3"
              defaultValue={settings.trust_badge_3}
              className="rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
            <input
              name="trust_badge_4"
              defaultValue={settings.trust_badge_4}
              className="rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Social links (optional — leave blank to hide that icon in the
            footer)
          </p>
          <div className="mt-1 flex flex-col gap-2">
            <input
              name="instagram_url"
              defaultValue={settings.instagram_url ?? ''}
              placeholder="https://instagram.com/yourshop"
              className="rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
            <input
              name="tiktok_url"
              defaultValue={settings.tiktok_url ?? ''}
              placeholder="https://tiktok.com/@yourshop"
              className="rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
            <input
              name="pinterest_url"
              defaultValue={settings.pinterest_url ?? ''}
              placeholder="https://pinterest.com/yourshop"
              className="rounded-md border border-ink/15 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Testimonials (the 3 review cards on your homepage) — real
            customer words work best; leave blank to hide a slot
          </p>
          <div className="mt-1 flex flex-col gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col gap-1.5 rounded-md border border-ink/10 p-2">
                <textarea
                  name={`testimonial_${n}_quote`}
                  defaultValue={settings[`testimonial_${n}_quote` as keyof typeof settings] as string}
                  placeholder={`Quote ${n}`}
                  rows={2}
                  className="rounded-md border border-ink/15 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <input
                    name={`testimonial_${n}_name`}
                    defaultValue={settings[`testimonial_${n}_name` as keyof typeof settings] as string}
                    placeholder="Customer name"
                    className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
                  />
                  <select
                    name={`testimonial_${n}_rating`}
                    defaultValue={String(settings[`testimonial_${n}_rating` as keyof typeof settings])}
                    className="rounded-md border border-ink/15 px-2 py-2 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} star{r > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">
            Press mentions (optional — comma-separated, e.g. &quot;Vogue,
            Elle&quot;. Leave blank to hide the &quot;As seen in&quot;
            section entirely — only add real press coverage)
          </label>
          <input
            name="press_mentions"
            defaultValue={settings.press_mentions ?? ''}
            placeholder="Leave blank unless you have real press coverage"
            className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Star Ingredients (the 4 cards explaining key ingredients)
          </p>
          <div className="mt-1 flex flex-col gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex gap-2 rounded-md border border-ink/10 p-2">
                <input
                  name={`ingredient_${n}_icon`}
                  defaultValue={settings[`ingredient_${n}_icon` as keyof typeof settings] as string}
                  placeholder="✦"
                  className="w-12 rounded-md border border-ink/15 px-2 py-2 text-center text-sm"
                />
                <input
                  name={`ingredient_${n}_title`}
                  defaultValue={settings[`ingredient_${n}_title` as keyof typeof settings] as string}
                  placeholder={`Ingredient ${n} name`}
                  className="w-32 rounded-md border border-ink/15 px-3 py-2 text-sm"
                />
                <input
                  name={`ingredient_${n}_desc`}
                  defaultValue={settings[`ingredient_${n}_desc` as keyof typeof settings] as string}
                  placeholder="Description"
                  className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Daily Ritual (the 3-step routine section) — reference your real
            products by name if you want customers to find them under Shop
          </p>
          <div className="mt-1 flex flex-col gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-2 rounded-md border border-ink/10 p-2">
                <input
                  name={`ritual_${n}_title`}
                  defaultValue={settings[`ritual_${n}_title` as keyof typeof settings] as string}
                  placeholder={`Step ${n} title`}
                  className="w-32 rounded-md border border-ink/15 px-3 py-2 text-sm"
                />
                <input
                  name={`ritual_${n}_desc`}
                  defaultValue={settings[`ritual_${n}_desc` as keyof typeof settings] as string}
                  placeholder="Description"
                  className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="self-start rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper"
        >
          Save
        </button>
      </form>

      <div className="label-card mt-6 rounded-lg bg-paper p-4">
        <p className="text-sm font-medium text-ink">Payments (Paystack)</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Paystack keys are set as environment variables in Vercel, not
          here, since they're sensitive. See the README for setup steps.
        </p>
      </div>
    </main>
  );
}
