import ThanksFeed from "./ThanksFeed";

export const dynamic = "force-dynamic";

export default function ThanksPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-[var(--font-display)] text-3xl text-slate-900">
        Thanks & Results
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Stories of help completed around Athens.
      </p>
      <div className="mt-6">
        <ThanksFeed />
      </div>
    </section>
  );
}
