import LoginForm from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Inicia sesión</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ingresa tus credenciales para acceder al panel.
        </p>
        <LoginForm />
      </div>
    </section>
  );
}
