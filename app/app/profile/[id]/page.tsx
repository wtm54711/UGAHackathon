import ProfileDetail from "./ProfileDetail";

export const dynamic = "force-dynamic";

export default function ProfileDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <ProfileDetail id={params.id} />
    </section>
  );
}
