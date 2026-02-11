"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { apiFetch } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    setLoading(true);
    setAuthError(null);

    try {
      const result = await apiFetch<{ access_token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (result.access_token) {
        localStorage.setItem("liquidi_token", result.access_token);
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div>
        <header>
          <h1>Liquidi</h1>
          <p>
            A Liquidi é uma plataforma de CFO as a Service automatizada para
            PMEs.
          </p>
        </header>

        {authError && <div>{authError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>E-mail</label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="exemplo@exemplo.com.br"
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div>
            <div>
              <label>Senha</label>
              <Link href="/auth/forgot">Esqueceu?</Link>
            </div>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Autenticando..." : "Entrar"}
          </button>
        </form>

        <footer>
          <p>
            Ainda não tem uma conta?{" "}
            <Link href="/auth/register">Cadastre-se</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
