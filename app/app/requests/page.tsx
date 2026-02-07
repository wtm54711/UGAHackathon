import RequestsFeed from "./RequestsFeed";

export const dynamic = "force-dynamic";

export default function RequestsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="font-[var(--font-display)] text-3xl text-slate-900">
          Help Requests
        </h1>
        <p className="text-sm text-slate-600">
          Browse open requests from neighbors across Athens.
        </p>
      </div>
      <RequestsFeed />
    </section>
  );
}
