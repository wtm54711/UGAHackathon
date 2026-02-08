"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import { fetchProfileById, ProfileRow } from "@/lib/data/profiles";

export default function ProfileDetail({ id }: { id?: string }) {
  const params = useParams();
  const resolvedId = id ?? (params?.id as string | undefined);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!resolvedId) {
        setError("Missing profile id.");
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const { data, error } = await fetchProfileById(resolvedId);
      if (!active) return;
      if (error) {
        setError(error.message);
        setProfile(null);
      } else {
        setProfile(data as ProfileRow | null);
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [resolvedId]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading profile...</p>;
  }

  if (!profile) {
    return (
      <EmptyState
        title="Profile not found"
        description={`This profile may not exist. Profile id: ${
          resolvedId ?? "missing"
        }`}
        action={
          <Link
            href="/requests"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to requests
          </Link>
        }
      />
    );
  }

  const name = profile.display_name ?? "Neighbor";
  const location = profile.location ?? "Athens, GA";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{name}</h1>
            <p className="mt-1 text-sm text-slate-500">{location}</p>
          </div>
          <Link
            href="/requests"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
          >
            Browse requests
          </Link>
        </div>

        {profile.bio && (
          <p className="mt-4 text-sm text-slate-700">{profile.bio}</p>
        )}
        <p className="mt-4 text-xs text-slate-500">
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
