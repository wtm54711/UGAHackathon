import LandingActions from "@/components/LandingActions";

export default function LandingPage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
      <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-10 shadow-xl shadow-amber-100 backdrop-blur md:p-14">
        <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 top-0 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
              The help spellbook
            </p>
            <h1 className="mt-4 font-[var(--font-display)] text-4xl leading-tight text-slate-900 md:text-5xl">
              Cast a request. Summon a neighbor. Share the thanks.
            </h1>
            <p className="mt-4 text-base text-slate-600">
              Whos There is the Athens guild for everyday help. Write a quick
              request, match with someone nearby, and celebrate the assist.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-amber-800">
                Avg. summon 18 min
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700">
                320 helpers online
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600">
                4.9 gratitude rating
              </div>
            </div>
            <LandingActions />
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-slate-900 p-6 text-amber-50 shadow-xl shadow-slate-200">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/70">
                Active spell
              </p>
              <p className="mt-2 text-lg font-semibold">
                &ldquo;Need help changing a tire near campus&rdquo;
              </p>
              <p className="mt-2 text-sm text-amber-100/70">
                Claimed in 12 minutes - Athens, GA
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/70">
                Gratitude rune
              </p>
              <p className="mt-2 text-lg font-semibold">
                &ldquo;Shoutout to Maya for fixing our porch light&rdquo;
              </p>
              <p className="mt-2 text-sm text-amber-100/70">Posted today</p>
            </div>
            <div className="float-slow shimmer rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/70">
                New bond
              </p>
              <p className="mt-2 text-lg font-semibold">
                &ldquo;Moving a couch this afternoon&rdquo;
              </p>
              <p className="mt-2 text-sm text-amber-100/70">
                2 helpers on the way
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-amber-100">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-700">
            Step 1
          </p>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            Scribe a quick request.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Describe what you need and when. Keep it short, clear, and kind.
          </p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-emerald-100">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">
            Step 2
          </p>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            Match with the guild.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            See who is nearby and ready to help. Coordinate in minutes.
          </p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-700">
            Step 3
          </p>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            Share gratitude.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Leave a thank you note to recognize the people who showed up.
          </p>
        </div>
      </div>
    </section>
  );
}
