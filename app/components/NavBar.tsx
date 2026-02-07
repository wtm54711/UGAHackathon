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
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Athens Helper
        </Link>
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <Link href="/requests" className="hover:text-slate-900">
            Requests
          </Link>
          <Link href="/thanks" className="hover:text-slate-900">
            Thanks
          </Link>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {email ? (
            <>
              <span className="hidden text-slate-600 sm:block">{email}</span>
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 hover:border-slate-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-slate-900 px-3 py-1 text-white"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
