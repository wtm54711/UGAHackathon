import Link from "next/link";
import { ThanksPost } from "@/lib/data/thanks";

export default function ThanksCard({ post }: { post: ThanksPost }) {
  return (
    <Link
      href={`/thanks/${post.id}`}
      className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
    >
      <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{post.body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
        {post.related_request_id && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">
            Related request
          </span>
        )}
      </div>
    </Link>
  );
}
