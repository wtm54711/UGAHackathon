"use client";

import { useMemo, useState } from "react";

const FAQS = [
  {
    question: "How do I post a request?",
    answer:
      "Go to Requests, click Create Request, add the details, and post it.",
  },
  {
    question: "How do I offer help?",
    answer:
      "Open a request and use the comment box to offer help or ask a question.",
  },
  {
    question: "How do I mark a request as completed?",
    answer:
      "Open your request and use the status controls to move it to completed.",
  },
  {
    question: "Where do I update my profile?",
    answer: "Visit Profile from the top navigation to edit your details.",
  },
  {
    question: "How do I post a thanks?",
    answer:
      "Go to Thanks and create a post to recognize someone who helped.",
  },
  {
    question: "Can I edit my request after posting?",
    answer:
      "Yes. Open your request and use the edit option to update it.",
  },
  {
    question: "What if I need to cancel a request?",
    answer:
      "Open your request and delete it if it is no longer needed.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Yes. Sign up to create requests, comment, and manage your profile.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Use the sign-in screen and choose the password reset option.",
  },
  {
    question: "Can I message someone directly?",
    answer:
      "Use the contact preference on a request to coordinate with helpers.",
  },
  {
    question: "What categories can I post under?",
    answer:
      "Pick the closest category to help neighbors find your request faster.",
  },
  {
    question: "Is my contact info public?",
    answer:
      "Only what you choose to share in a request or profile is visible.",
  },
  {
    question: "How do I edit a thanks post?",
    answer:
      "Open the thanks post and use the edit option if it is available.",
  },
  {
    question: "Why don't I see my request?",
    answer:
      "Refresh the page or check your filters and search terms.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Contact the site admin or support if you need your account removed.",
  },
];

export default function FaqSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return FAQS.filter((item) => {
      const haystack = `${item.question} ${item.answer}`.toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [query]);

  return (
    <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-xl shadow-amber-100 backdrop-blur md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            Search the FAQ
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Quick answers for first-time visitors.
          </h2>
        </div>
        <div className="w-full max-w-md">
          <label className="sr-only" htmlFor="faq-search">
            Search the FAQ
          </label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: post a request, offer help, edit profile..."
            className="w-full rounded-full border border-amber-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {results.slice(0, 6).map((item) => (
          <div
            key={item.question}
            className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-900">
              {item.question}
            </p>
            <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>

      {!query.trim() && (
        <p className="mt-6 text-sm text-slate-600">
          Start typing to see answers.
        </p>
      )}

      {query.trim() && results.length === 0 && (
        <p className="mt-6 text-sm text-slate-600">
          No matches yet. Try “request”, “profile”, or “thanks”.
        </p>
      )}
    </section>
  );
}
