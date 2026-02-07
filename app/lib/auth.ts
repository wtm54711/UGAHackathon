"use client";

import { createBrowserClient } from "@/lib/supabase/client";

export async function getUser() {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return { user: null, error: error.message };
  }
  return { user: data.user, error: null };
}
