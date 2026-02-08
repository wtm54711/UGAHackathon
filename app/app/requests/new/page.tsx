"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import { getUser } from "@/lib/auth";
import { createRequest } from "@/lib/data/requests";

const categories = ["Home", "Car", "Yard", "Tech", "Other"];
const contactOptions = ["in-app chat", "email", "phone"];

export default function NewRequestPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Home");
  const [location, setLocation] = useState("Athens, GA");
  const [deadline, setDeadline] = useState("");
  const [contactPreference, setContactPreference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const { user } = await getUser();
      if (!active) return;
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
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

    const deadlineAt = deadline ? new Date(deadline).toISOString() : null;
    const { data, error } = await createRequest({
      title,
      description,
      category,
      location,
      user_id: userId,
      contact_preference: contactPreference || null,
      deadline_at: deadlineAt,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const newId = (data as { id: string })?.id;
    if (newId) {
      router.push(`/requests/${newId}`);
    } else {
      router.push("/requests");
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-[var(--font-display)] text-3xl text-slate-900">
        Create a Request
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Tell neighbors what you need help with.
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
        <FormField label="Description">
          <textarea
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Category">
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Location">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormField>
        <FormField label="Deadline" helper="Optional">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </FormField>
        <FormField label="Contact preference" helper="Optional">
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={contactPreference}
            onChange={(e) => setContactPreference(e.target.value)}
          >
            <option value="">No preference</option>
            {contactOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
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
          {loading ? "Saving..." : "Post request"}
        </button>
      </form>
    </section>
  );
}
