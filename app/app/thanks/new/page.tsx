"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import { createBrowserClient } from "@/lib/supabase/client";
import { getUser } from "@/lib/auth";
import { createThanksPost } from "@/lib/data/thanks";
import type { RequestRow } from "@/lib/data/requests";

export default function NewThanksPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [relatedRequestId, setRelatedRequestId] = useState("");
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const supabase = createBrowserClient();

    async function loadUser() {
      const { user } = await getUser();
      if (!active) return;
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      const { data: completedRequests } = await supabase
        .from("requests")
        .select("id,title,description,category,status,created_at,user_id,location")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (!active) return;
      setRequests((completedRequests as RequestRow[]) || []);
    }

    loadUser();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setError(null);
    setLoading(true);

    const { data, error } = await createThanksPost({
      user_id: userId,
      title,
      body,
      related_request_id: relatedRequestId || null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const newId = (data as { id: string })?.id;
    if (newId) {
      router.push(`/thanks/${newId}`);
    } else {
      router.push("/thanks");
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-[var(--font-display)] text-3xl text-slate-900">
        Create a Thanks Post
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Share results or say thank you to helpers.
      </p>

      <form
        className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <FormField label="Title">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Body">
          <textarea
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </FormField>
        <FormField
          label="Related request (optional)"
          helper="Choose a completed request or paste an ID"
        >
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            list="completed-requests"
            value={relatedRequestId}
            onChange={(e) => setRelatedRequestId(e.target.value)}
            placeholder="Request ID"
          />
          <datalist id="completed-requests">
            {requests.map((req) => (
              <option key={req.id} value={req.id}>
                {req.title}
              </option>
            ))}
          </datalist>
        </FormField>

        {error && (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Publish thanks"}
        </button>
      </form>
    </section>
  );
}
