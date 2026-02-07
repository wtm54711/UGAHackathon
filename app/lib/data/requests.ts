import { createBrowserClient } from "@/lib/supabase/client";

export type RequestStatus = "open" | "claimed" | "completed";

export type RequestRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string | null;
  status: RequestStatus;
  created_at: string;
  location?: string | null;
};

export type RequestComment = {
  id: string;
  request_id: string;
  user_id: string;
  body: string;
  created_at: string;
};

export async function fetchRequests(params: {
  search?: string;
  category?: string;
  sort?: "newest" | "oldest";
}) {
  const supabase = createBrowserClient();
  let query = supabase
    .from("requests")
    .select("id,user_id,title,description,category,status,created_at,location")
    .order("created_at", { ascending: params.sort === "oldest" });

  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%`
    );
  }

  if (params.category && params.category !== "All") {
    query = query.eq("category", params.category);
  }

  return query;
}

export async function fetchRequestById(id: string) {
  const supabase = createBrowserClient();
  return supabase
    .from("requests")
    .select("id,user_id,title,description,category,status,created_at,location")
    .eq("id", id)
    .single();
}

export async function createRequest(payload: {
  title: string;
  description: string;
  category: string;
  location?: string | null;
  status?: RequestStatus;
  user_id: string;
  contact_preference?: string | null;
}) {
  const supabase = createBrowserClient();
  return supabase
    .from("requests")
    .insert({
      title: payload.title,
      description: payload.description,
      category: payload.category,
      location: payload.location ?? "Athens, GA",
      status: payload.status ?? "open",
      user_id: payload.user_id,
      contact_preference: payload.contact_preference ?? null,
    })
    .select("id")
    .single();
}

export async function updateRequestStatus(
  id: string,
  status: RequestStatus
) {
  const supabase = createBrowserClient();
  return supabase.from("requests").update({ status }).eq("id", id);
}

export async function deleteRequest(id: string) {
  const supabase = createBrowserClient();
  return supabase.from("requests").delete().eq("id", id);
}

export async function fetchRequestComments(requestId: string) {
  const supabase = createBrowserClient();
  return supabase
    .from("request_comments")
    .select("id,request_id,user_id,body,created_at")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });
}

export async function addRequestComment(payload: {
  request_id: string;
  user_id: string;
  body: string;
}) {
  const supabase = createBrowserClient();
  return supabase.from("request_comments").insert({
    request_id: payload.request_id,
    user_id: payload.user_id,
    body: payload.body,
  });
}

export async function updateRequest(id: string, payload: {
  title?: string;
  description?: string;
  category?: string;
  location?: string | null;
}) {
  const supabase = createBrowserClient();
  return supabase.from("requests").update(payload).eq("id", id);
}
