"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, getFirebaseErrorMessage } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  if (!loading && user) {
    router.replace("/dashboard");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
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
        Entrar na Plataforma
      </h1>
      <p className="text-sm text-black/50 text-center mb-6">
        Acesse suas aulas e acompanhe seu progresso
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            autoComplete="current-password"
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
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-5 text-center space-y-2">
        <Link
          href="/forgot-password"
          className="text-xs text-primary hover:text-primary-dark transition-colors"
        >
          Esqueceu sua senha?
        </Link>
        <p className="text-xs text-black/40">
          Não tem conta?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:text-primary-dark transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </>
  );
}
