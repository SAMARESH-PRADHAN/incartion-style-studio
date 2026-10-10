import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or Signup — Incartion" },
      { name: "description", content: "Login or create your Incartion account to order uniforms." },
      { property: "og:title", content: "Login — Incartion" },
      { property: "og:description", content: "Access your Incartion account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-[70vh] place-items-center bg-secondary px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-md bg-background shadow-card">
        <div className="bg-brand p-6 text-primary-foreground">
          <h1 className="text-2xl font-black">Login / Signup</h1>
          <p className="text-sm opacity-90">Get exclusive bulk prices and track orders.</p>
        </div>
        <div className="p-6"><AuthForm onSuccess={() => navigate({ to: "/" })} /></div>
      </div>
    </div>
  );
}
