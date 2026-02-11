"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { apiFetch } from "@/lib/api";

const registerSchema = z.object({
  name: z.string().min(2, "Diga-nos seu nome completo"),
  email: z.string().email("E-mail corporativo inválido"),
  companyName: z.string().min(2, "O nome da empresa é obrigatório"),
  cnpj: z
    .string()
    .length(14, "O CNPJ deve ter exatamente 14 números (sem pontos ou traços)"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      cnpj: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setLoading(true);
    setError(null);
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Falha ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div>
        <header>
          <h1>Liquidi</h1>
          <p>Cadastre-se agora mesmo!</p>
        </header>

        {error && <div>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <label>Nome</label>
              <input {...register("name")} placeholder="Ex: João Silva" />
              {errors.name && <p>{errors.name.message}</p>}
            </div>

            <div>
              <label>E-mail</label>
              <input
                {...register("email")}
                type="email"
                placeholder="joao.silva@empresa.com"
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <div>
              <label>Nome da Empresa</label>
              <input {...register("companyName")} placeholder="Empresa LTDA" />
              {errors.companyName && <p>{errors.companyName.message}</p>}
            </div>

            <div className="space-y-1">
              <label>CNPJ</label>
              <input
                {...register("cnpj")}
                maxLength={14}
                placeholder="Apenas números"
              />
              {errors.cnpj && <p>{errors.cnpj.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label>Senha</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Processando..." : "Finalizar Cadastro"}
          </button>
        </form>

        <footer>
          <p>
            Já possui uma conta? <Link href="/auth/login">Login</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
