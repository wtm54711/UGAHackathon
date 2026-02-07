"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ThanksCard from "@/components/ThanksCard";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { fetchThanksPosts, ThanksPost } from "@/lib/data/thanks";

export default function ThanksFeed() {
  const [posts, setPosts] = useState<ThanksPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const { data, error } = await fetchThanksPosts();
      if (!active) return;
      if (error) {
        setError(error.message);
        setPosts([]);
      } else {
        setPosts((data as ThanksPost[]) || []);
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Thank-you posts
          </h2>
          <p className="text-sm text-slate-600">
            Celebrate neighbors who stepped up.
          </p>
        </div>
        <Link
          href="/thanks/new"
          className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Create Thanks Post
        </Link>
      </div>

      {loading && <LoadingSkeleton />}
      {error && (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {!loading && !error && posts.length === 0 && (
        <EmptyState
          title="No thanks yet"
          description="Share the first story of help in Athens."
          action={
            <Link
              href="/thanks/new"
              className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Create a thanks post
            </Link>
          }
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <ThanksCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
