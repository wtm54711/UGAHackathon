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
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Browse Requests
      </Link>
      <Link
        href="/thanks"
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
      >
        Browse Thanks
      </Link>
      {email && (
        <>
          <Link
            href="/requests/new"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Create a Request
          </Link>
          <Link
            href="/thanks/new"
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Create a Thanks Post
          </Link>
        </>
      )}
    </div>
  );
}
