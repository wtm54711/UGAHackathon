import LandingActions from "@/components/LandingActions";

export default function LandingPage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16">
      <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Whos there?
          </p>
          <h1 className="mt-4 font-[var(--font-display)] text-4xl leading-tight text-slate-900 md:text-5xl">
            Help your neighbors in Athens
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Post quick requests for physical help, find nearby neighbors ready
            to lend a hand, and share thanks when the job is done.
          </p>
          <LandingActions />
        </div>
        <div className="flex flex-col gap-4 rounded-2xl bg-slate-900 p-6 text-white">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              Live now
            </p>
            <p className="mt-2 text-lg font-semibold">
              &ldquo;Need help changing a tire near campus&rdquo;
            </p>
            <p className="mt-2 text-sm text-white/70">
              Claimed in 12 minutes · Athens, GA
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              Thank you note
            </p>
            <p className="mt-2 text-lg font-semibold">
              &ldquo;Shoutout to Maya for fixing our porch light&rdquo;
            </p>
            <p className="mt-2 text-sm text-white/70">
              Posted today
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
