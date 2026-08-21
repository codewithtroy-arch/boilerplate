import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/get-profile';
import { addPost, deletePost } from './actions';

export default async function AdminJournalPage() {
  const { user, role } = await getCurrentProfile();
  if (!user) redirect('/login');
  if (role !== 'admin') redirect('/dashboard');

  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select('id, tag, title, excerpt, created_at')
    .order('created_at', { ascending: false });

  const posts = data ?? [];

  return (
    <main className="mx-auto max-w-2xl p-6 pb-24">
      <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-ink">
        Journal posts
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The &quot;From the Journal&quot; section only shows on your catalog
        once you have at least one real post here — it&apos;s hidden
        entirely until then.
      </p>

      <form
        action={addPost}
        className="label-card mt-6 flex flex-col gap-3 rounded-lg bg-paper p-4"
      >
        <p className="text-sm font-medium text-ink">Add a post</p>
        <input
          name="title"
          placeholder="Post title"
          required
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        <input
          name="tag"
          placeholder="Tag (optional, e.g. Science, Ritual)"
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        <textarea
          name="excerpt"
          placeholder="Short excerpt"
          rows={2}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="self-start rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper"
        >
          Add post
        </button>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        {posts.map((post) => (
          <div key={post.id} className="label-card flex items-start justify-between gap-3 bg-paper p-4">
            <div>
              {post.tag && (
                <span className="text-xs font-medium uppercase tracking-wide text-cobalt">
                  {post.tag}
                </span>
              )}
              <p className="text-sm font-semibold text-ink">{post.title}</p>
              <p className="text-xs text-muted-foreground">{post.excerpt}</p>
            </div>
            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" className="text-xs text-blush underline">
                Delete
              </button>
            </form>
          </div>
        ))}

        {posts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No posts yet — add your first one above.
          </p>
        )}
      </div>
    </main>
  );
}
