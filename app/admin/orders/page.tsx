import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/get-profile';

type Order = {
  id: string;
  email: string;
  total: number;
  reference: string;
  items: { name: string; quantity: number }[];
  created_at: string;
};

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function isSameWeek(date: Date, now: Date) {
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays < 7;
}

export default async function AdminOrdersPage() {
  const { user, role } = await getCurrentProfile();

  if (!user) redirect('/login');
  if (role !== 'admin') redirect('/dashboard');

  const supabase = createClient();

  const { data } = await supabase
    .from('orders')
    .select('id, email, total, reference, items, created_at')
    .order('created_at', { ascending: false });

  const orders = (data ?? []) as Order[];
  const now = new Date();

  const todayTotal = orders
    .filter((o) => isSameDay(new Date(o.created_at), now))
    .reduce((sum, o) => sum + o.total, 0);

  const weekTotal = orders
    .filter((o) => isSameWeek(new Date(o.created_at), now))
    .reduce((sum, o) => sum + o.total, 0);

  const allTimeTotal = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <main className="mx-auto max-w-2xl p-6 pb-24">
      <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-ink">Orders</h1>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Today', value: todayTotal },
          { label: 'This week', value: weekTotal },
          { label: 'All time', value: allTimeTotal },
        ].map((stat) => (
          <div key={stat.label} className="label-card rounded-lg bg-paper p-3 text-center">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-ink">
              ₦{stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {orders.map((order) => (
          <div key={order.id} className="label-card rounded-lg bg-paper p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">{order.email}</p>
              <p className="text-sm font-medium text-ink">
                ₦{order.total.toLocaleString()}
              </p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              {new Date(order.created_at).toLocaleString()} · Ref: {order.reference}
            </p>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </main>
  );
}
