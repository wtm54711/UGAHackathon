import ThanksDetail from "./ThanksDetail";

export const dynamic = "force-dynamic";

export default function ThanksDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <ThanksDetail id={params.id} />
    </section>
  );
}
