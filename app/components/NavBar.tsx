"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { getUser } from "@/lib/auth";

export default function NavBar() {
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const result = await getUser();
      if (mounted) setEmail(result.user?.email ?? null);
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

  async function handleLogout() {
    await supabase.auth.signOut();
    setEmail(null);
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-amber-200 shadow-sm shadow-amber-200">
            *
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
              Whos There
            </span>
            <span className="text-xs text-slate-500">The neighbor guild</span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 text-sm text-slate-600 md:flex">
          <Link
            href="/requests"
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-md"
          >
            Requests
          </Link>
          <Link
            href="/thanks"
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-md"
          >
            Thanks
          </Link>
          <Link
            href="/schedule"
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-md"
          >
            Schedule
          </Link>
          {email && (
            <Link
              href="/profile"
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-md"
            >
              Profile
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {email ? (
            <>
              <span className="hidden text-slate-600 lg:block">{email}</span>
              <Link
                href="/profile"
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md md:hidden"
              >
                Profile
              </Link>
              <button
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-slate-900 px-4 py-1.5 text-amber-200 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
