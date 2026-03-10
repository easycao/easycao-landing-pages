"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth, getFirebaseErrorMessage } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Informe seu email.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      setError(getFirebaseErrorMessage(code));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-black mb-2">Email enviado!</h1>
        <p className="text-sm text-black/50 mb-6">
          Verifique sua caixa de entrada e siga as instruções para redefinir sua
          senha.
        </p>
        <Link
          href="/login"
          className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
        >
          Voltar para login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-bold text-black text-center mb-1">
        Recuperar Senha
      </h1>
      <p className="text-sm text-black/50 text-center mb-6">
        Informe seu email e enviaremos um link para redefinir sua senha
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
          {submitting ? "Enviando..." : "Enviar link de recuperação"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-black/40">
        Lembrou a senha?{" "}
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
