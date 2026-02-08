import { createBrowserClient } from "@/lib/supabase/client";

export type ProfileRow = {
  id: string;
  display_name: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string | null;
};

export async function fetchProfileById(id: string) {
  const supabase = createBrowserClient();
  return supabase.from("profiles").select("*").eq("id", id).maybeSingle();
}

export async function fetchProfilesByIds(ids: string[]) {
  const supabase = createBrowserClient();
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (uniqueIds.length === 0) {
    return { data: [], error: null } as const;
  }
  return supabase
    .from("profiles")
    .select("id,display_name,avatar_url,location,created_at")
    .in("id", uniqueIds);
}

export async function upsertProfile(payload: {
  id: string;
  display_name?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar_url?: string | null;
}) {
  const supabase = createBrowserClient();
  return supabase
    .from("profiles")
    .upsert(
      {
        id: payload.id,
        display_name: payload.display_name ?? null,
        bio: payload.bio ?? null,
        location: payload.location ?? null,
        avatar_url: payload.avatar_url ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select("*")
    .maybeSingle();
}
