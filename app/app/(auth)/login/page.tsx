import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="font-[var(--font-display)] text-3xl text-slate-900">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Log in or create an account to post requests and thanks.
        </p>
      </div>
      <AuthForm />
    </section>
  );
}
