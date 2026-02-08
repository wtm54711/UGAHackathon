"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import {
  fetchProfileById,
  ProfileRow,
  upsertProfile,
} from "@/lib/data/profiles";

export default function ProfileEditor() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = createBrowserClient();

    async function load() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      if (error || !data.user) {
        setUserId(null);
        setEmail(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const currentUserId = data.user.id;
      setUserId(currentUserId);
      setEmail(data.user.email ?? null);

      const profileResult = await fetchProfileById(currentUserId);
      if (!active) return;
      if (profileResult.error) {
        setError(profileResult.error.message);
        setProfile(null);
      } else {
        const row = profileResult.data as ProfileRow | null;
        setProfile(row);
        setDisplayName(row?.display_name ?? "");
        setBio(row?.bio ?? "");
        setLocation(row?.location ?? "");
      }

      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setError(null);

    const result = await upsertProfile({
      id: userId,
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
      location: location.trim() || null,
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      setProfile(result.data as ProfileRow | null);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading profile...</p>;
  }

  if (!userId) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Create your profile
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Log in to add a display name and a short bio for neighbors.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Your profile
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Signed in as {email ?? "neighbor"}
            </p>
          </div>
          <Link
            href={`/profile/${userId}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
          >
            View public profile
          </Link>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSave}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Display name
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Maya S."
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Bio</label>
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Neighbor, gardener, available on weekends."
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Athens, GA"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : profile ? "Update profile" : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
