"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequestCard from "@/components/RequestCard";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { fetchRequests, RequestRow } from "@/lib/data/requests";

const categories = ["All", "Home", "Car", "Yard", "Tech", "Other"];

export default function RequestsFeed() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredSearch = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      const { data, error } = await fetchRequests({
        search: filteredSearch,
        category,
        sort,
      });

      if (!active) return;

      if (error) {
        setError(error.message);
        setRequests([]);
      } else {
        setRequests((data as RequestRow[]) || []);
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [filteredSearch, category, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Search requests"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as "newest" | "oldest")
            }
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <Link
          href="/requests/new"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Create Request
        </Link>
      </div>

      {loading && <LoadingSkeleton />}
      {error && (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {!loading && !error && requests.length === 0 && (
        <EmptyState
          title="No requests yet"
          description="Be the first to ask for help in Athens."
          action={
            <Link
              href="/requests/new"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Create the first request
            </Link>
          }
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}
