"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { upsertProfile } from "@/lib/data/profiles";

type Mode = "login" | "signup";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const userId = result.data.user?.id;
      if (userId) {
        await upsertProfile({
          id: userId,
          display_name: null,
          bio: null,
          location: null,
        });
      }
    }

    setLoading(false);
    router.push(mode === "signup" ? "/profile" : "/requests");
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex gap-2 rounded-full bg-slate-100 p-1 text-sm">
        <button
          type="button"
          className={`flex-1 rounded-full px-3 py-2 font-medium ${
            mode === "login"
              ? "bg-white text-slate-900 shadow"
              : "text-slate-500"
          }`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full px-3 py-2 font-medium ${
            mode === "signup"
              ? "bg-white text-slate-900 shadow"
              : "text-slate-500"
          }`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@uga.edu"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
          />
        </div>
        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? "Working..."
            : mode === "signup"
              ? "Create account"
              : "Login"}
        </button>
      </form>
    </div>
  );
}
