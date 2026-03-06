"use client";

import { useState, type FormEvent } from "react";

interface Props {
  studentId: string;
  enrollmentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPriceModal({ studentId, enrollmentId, onClose, onSuccess }: Props) {
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = parseFloat(price.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      setError("Digite um valor válido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/students/${studentId}/update-price`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId, realPricePaid: value }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao atualizar");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-lg font-bold text-black mb-6">Editar Valor Real</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-black/60 mb-1 block">Valor pago (R$)</label>
            <input
              type="text"
              placeholder="0,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-border bg-gray-light text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              autoFocus
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-border rounded-xl text-black/60 font-medium hover:bg-gray-light transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
