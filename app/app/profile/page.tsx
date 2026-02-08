import ProfileEditor from "./ProfileEditor";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <ProfileEditor />
    </section>
  );
}
