import { createBrowserClient } from "@/lib/supabase/client";

export type ThanksPost = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  related_request_id: string | null;
  created_at: string;
};

export async function fetchThanksPosts() {
  const supabase = createBrowserClient();
  return supabase
    .from("thanks_posts")
    .select("id,user_id,title,body,related_request_id,created_at")
    .order("created_at", { ascending: false });
}

export async function fetchThanksById(id: string) {
  const supabase = createBrowserClient();
  return supabase
    .from("thanks_posts")
    .select("id,user_id,title,body,related_request_id,created_at")
    .eq("id", id)
    .single();
}

export async function createThanksPost(payload: {
  user_id: string;
  title: string;
  body: string;
  related_request_id?: string | null;
}) {
  const supabase = createBrowserClient();
  return supabase
    .from("thanks_posts")
    .insert({
      user_id: payload.user_id,
      title: payload.title,
      body: payload.body,
      related_request_id: payload.related_request_id ?? null,
    })
    .select("id")
    .single();
}
