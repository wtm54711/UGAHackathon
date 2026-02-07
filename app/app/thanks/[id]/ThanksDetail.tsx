"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ThanksPost, fetchThanksById } from "@/lib/data/thanks";
import EmptyState from "@/components/EmptyState";

export default function ThanksDetail({ id }: { id?: string }) {
  const params = useParams();
  const resolvedId = id ?? (params?.id as string | undefined);
  const [post, setPost] = useState<ThanksPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!resolvedId) {
        setError("Missing thanks post id.");
        setPost(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await fetchThanksById(resolvedId);
      if (!active) return;
      if (error) {
        setError(error.message);
        setPost(null);
      } else {
        setPost(data as ThanksPost);
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [resolvedId]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading post...</p>;
  }

  if (!post) {
    return (
      <EmptyState
        title="Post not found"
        description={`This thanks post may have been removed. Post id: ${resolvedId ?? "missing"}`}
        action={
          <Link
            href="/thanks"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to thanks
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-slate-600">{post.body}</p>
        <p className="mt-4 text-xs text-slate-500">
          Posted {new Date(post.created_at).toLocaleDateString()}
        </p>

        {post.related_request_id && (
          <Link
            href={`/requests/${post.related_request_id}`}
            className="mt-4 inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700"
          >
            Related request
          </Link>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p>{error}</p>
          <p className="mt-1 text-xs text-rose-600">
            Post id: {resolvedId ?? "missing"}
          </p>
        </div>
      )}
    </div>
  );
}
