import RequestDetail from "./RequestDetail";

export const dynamic = "force-dynamic";

export default function RequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <RequestDetail id={params.id} />
    </section>
  );
}
