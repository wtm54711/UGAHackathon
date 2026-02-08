"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import CategoryBadge from "@/components/CategoryBadge";
import StatusPill from "@/components/StatusPill";
import EmptyState from "@/components/EmptyState";
import {
  addRequestComment,
  deleteRequest,
  fetchRequestById,
  fetchRequestComments,
  RequestComment,
  RequestRow,
  updateRequest,
  updateRequestStatus,
} from "@/lib/data/requests";
import { createBrowserClient } from "@/lib/supabase/client";

export default function RequestDetail({ id }: { id?: string }) {
  const params = useParams();
  const resolvedId = id ?? (params?.id as string | undefined);
  const [request, setRequest] = useState<RequestRow | null>(null);
  const [comments, setComments] = useState<RequestComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const supabase = createBrowserClient();

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (active) setUserId(data.user?.id ?? null);
    }

    async function loadRequest() {
      if (!resolvedId) {
        setError("Missing request id.");
        setRequest(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      const { data, error } = await fetchRequestById(resolvedId);
      if (!active) return;

      if (error) {
        setError(error.message);
        setRequest(null);
      } else {
        const req = data as RequestRow;
        setRequest(req);
        setEditTitle(req.title);
        setEditDescription(req.description);
        setEditCategory(req.category ?? "");
        setEditLocation(req.location ?? "");
      }

      const commentsResult = await fetchRequestComments(resolvedId);
      if (!active) return;

      if (commentsResult.error) {
        setComments([]);
      } else {
        setComments((commentsResult.data as RequestComment[]) || []);
      }

      setLoading(false);
    }

    loadUser();
    loadRequest();

    return () => {
      active = false;
    };
  }, [resolvedId]);

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !commentText.trim() || !resolvedId) return;

    const { error } = await addRequestComment({
      request_id: resolvedId,
      user_id: userId,
      body: commentText.trim(),
    });

    if (error) {
      setError(error.message);
      return;
    }

    setCommentText("");
    const refreshed = await fetchRequestComments(resolvedId);
    if (!refreshed.error) {
      setComments((refreshed.data as RequestComment[]) || []);
    }
  }

  async function handleDelete() {
    if (!request) return;
    const { error } = await deleteRequest(request.id);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/requests");
    router.refresh();
  }

  async function handleSaveEdit() {
    if (!request) return;
    const { error } = await updateRequest(request.id, {
      title: editTitle,
      description: editDescription,
      category: editCategory,
      location: editLocation || null,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setEditing(false);
    setRequest({
      ...request,
      title: editTitle,
      description: editDescription,
      category: editCategory || null,
      location: editLocation || null,
    });
  }

  async function handleMarkCompleted() {
    if (!request) return;
    const { error } = await updateRequestStatus(request.id, "completed");
    if (error) {
      setError(error.message);
      return;
    }
    setRequest({ ...request, status: "completed" });
    router.refresh();
  }

  async function handleMarkInProgress() {
    if (!request) return;
    const { error } = await updateRequestStatus(request.id, "in_progress");
    if (error) {
      setError(error.message);
      return;
    }
    setRequest({ ...request, status: "in_progress" });
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading request...</p>;
  }

  if (!request) {
    return (
      <EmptyState
        title="Request not found"
        description={`This request may have been removed or never existed. Request id: ${resolvedId ?? "missing"}`}
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

  const ownerId = request.user_id ?? null;
  const isOwner = userId !== null && userId === ownerId;
  const locationLabel = request.location ?? "Athens, GA";
  const authorLabel = ownerId ?? "unknown";

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <CategoryBadge category={request.category} />
              <StatusPill status={request.status} />
              <span>{locationLabel}</span>
              <span>{new Date(request.created_at).toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {request.title}
            </h1>
          </div>
          <div className="text-xs text-slate-500">
            Posted by {authorLabel}
          </div>
        </div>

        {editing ? (
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              rows={4}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                onClick={handleSaveEdit}
              >
                Save changes
              </button>
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">{request.description}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {!isOwner && userId && (
            <button
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => setCommentText("I can help. Let's coordinate.")}
            >
              Offer Help
            </button>
          )}
          {isOwner && (
            <>
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm"
                onClick={handleMarkInProgress}
              >
                Mark In Progress
              </button>
              <button
                className="rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-600"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                onClick={handleMarkCompleted}
              >
                Mark Completed
              </button>
            </>
          )}
        </div>

        {!userId && (
          <p className="mt-4 text-sm text-slate-500">
            <Link className="underline" href="/login">
              Login
            </Link>{" "}
            to offer help or comment.
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Comments</h2>
        {comments.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            No comments yet. Be the first to offer help.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
              >
                <p className="text-sm text-slate-700">{comment.body}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {comment.user_id} ·{" "}
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {userId && (
          <form className="mt-4 space-y-3" onSubmit={handleAddComment}>
            <textarea
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Offer help or ask a question"
            />
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Post comment
            </button>
          </form>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p>{error}</p>
          <p className="mt-1 text-xs text-rose-600">
            Request id: {resolvedId ?? "missing"}
          </p>
        </div>
      )}
    </div>
  );
}
