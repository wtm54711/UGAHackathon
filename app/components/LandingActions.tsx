"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

export default function LandingActions() {
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (mounted) setEmail(data.user?.email ?? null);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setEmail(session?.user?.email ?? null);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href="/requests"
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-amber-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
      >
        Browse Requests
      </Link>
      <Link
        href="/thanks"
        className="rounded-full border border-amber-200 bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-900 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
      >
        Browse Thanks
      </Link>
      {email && (
        <>
          <Link
            href="/requests/new"
            className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md"
          >
            Create a Request
          </Link>
          <Link
            href="/thanks/new"
            className="rounded-full bg-slate-800 px-5 py-2 text-sm font-semibold text-amber-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-md"
          >
            Create a Thanks Post
          </Link>
        </>
      )}
    </div>
  );
}
