"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, getFirebaseErrorMessage } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { signUp, user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    router.replace("/dashboard");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      setError(getFirebaseErrorMessage(code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="text-xl font-bold text-black text-center mb-1">
        Criar Conta
      </h1>
      <p className="text-sm text-black/50 text-center mb-6">
        Crie sua conta para acessar a plataforma Easycao
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-black/60 block mb-1.5">
            Nome completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            className="w-full px-4 py-3 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-black/60 block mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-black/60 block mb-1.5">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-black/60 block mb-1.5">
            Confirmar senha
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-full bg-primary hover:bg-[#1888e0] text-white font-bold text-sm shadow-[0_2px_8px_rgba(31,150,247,0.3)] hover:shadow-[0_4px_16px_rgba(31,150,247,0.45)] active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? "Criando conta..." : "Criar Conta"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-black/40">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:text-primary-dark transition-colors"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}
