"use client";

import { useState, type FormEvent } from "react";

interface Props {
  studentId: string;
  action: "renew" | "re-enroll";
  onClose: () => void;
  onSuccess: () => void;
}

export default function EnrollmentModal({ studentId, action, onClose, onSuccess }: Props) {
  const [price, setPrice] = useState("");
  const [paymentType, setPaymentType] = useState("pix");
  const [installments, setInstallments] = useState("1");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRenew = action === "renew";
  const title = isRenew ? "Renovar Matrícula" : "Rematricular Aluno";
  const endpoint = isRenew ? "renew" : "re-enroll";

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
      const res = await fetch(`/api/admin/students/${studentId}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pricePaid: value,
          paymentType,
          installments: parseInt(installments, 10) || 1,
          notes: notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao processar");
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

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-border bg-gray-light text-black placeholder:text-black/30 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative rounded-2xl shadow-xl p-8 w-full max-w-md bg-white border border-gray-border">
        <h2 className="text-lg font-bold text-black mb-6">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-black/50 mb-1 block">Valor (R$)</label>
            <input
              type="text"
              placeholder="0,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClasses}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-black/50 mb-1 block">Pagamento</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className={inputClasses}
              >
                <option value="pix">PIX</option>
                <option value="credit_card">Cartão</option>
                <option value="boleto">Boleto</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-black/50 mb-1 block">Parcelas</label>
              <input
                type="number"
                min="1"
                max="12"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-black/50 mb-1 block">Observações (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={`${inputClasses} resize-none`}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

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
              className="flex-1 py-3 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 bg-primary hover:bg-primary-dark"
            >
              {loading ? "Salvando..." : isRenew ? "Renovar" : "Rematricular"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
