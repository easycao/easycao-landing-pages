"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import EditPriceModal from "./EditPriceModal";
import EnrollmentModal from "./EnrollmentModal";

interface StageData {
  engagement: string | null;
  sentAt: string | null;
  template: string | null;
  progress: number | null;
}

interface EnrollmentData {
  id: string;
  enrolledAt: string;
  status: string;
  pricePaid: number;
  realPricePaid: number | null;
  needsManualPrice: boolean;
  paymentType: string;
  installments: number;
  source: string;
  extensionDays: number;
  stages: Record<string, StageData | null>;
  notes: string | null;
  transaction: string;
  offerCode: string;
}

interface StudentDetail {
  student: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    document: string;
    city: string;
    state: string;
    totalEnrollments: number;
    currentEnrollmentId: string;
    hotmartStatus: string | null;
    courseProgress: number | null;
    tags: string[];
    approved: boolean;
    approvedAt: string | null;
    csEnabled: boolean;
  };
  enrollments: EnrollmentData[];
  ltv: number;
  currentStage: string;
  currentDaysRemaining: number;
}

const STAGE_LABELS: Record<string, string> = {
  dia_0: "Dia 0", dia_10: "Dia 10", mes_2: "Mês 2", mes_3: "Mês 3",
  mes_4: "Mês 4", mes_5: "Mês 5", mes_6: "Mês 6", mes_7: "Mês 7",
  mes_8: "Mês 8", mes_9: "Mês 9", mes_10: "Mês 10", mes_11: "Mês 11",
  mes_12: "Mês 12", antigo_aluno: "Antigo Aluno",
};

const ENGAGEMENT_COLORS: Record<string, string> = {
  NONE: "bg-gray-100 text-gray-600",
  LOW: "bg-red-100 text-red-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-emerald-100 text-emerald-700",
  VERY_HIGH: "bg-violet-100 text-violet-700",
};

const ENGAGEMENT_DOT_COLORS: Record<string, string> = {
  NONE: "bg-gray-400", LOW: "bg-red-500", MEDIUM: "bg-amber-500",
  HIGH: "bg-emerald-500", VERY_HIGH: "bg-violet-500",
};

const ENGAGEMENT_LABELS: Record<string, string> = {
  NONE: "Nenhum", LOW: "Baixo", MEDIUM: "Médio",
  HIGH: "Alto", VERY_HIGH: "Muito Alto",
};

const MESSAGE_STAGE_ORDER = ["dia_10", "mes_2", "mes_4", "mes_7", "mes_10"];

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 13 && digits.startsWith("55")) {
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  if (digits.length === 12 && digits.startsWith("55")) {
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 8)}-${digits.slice(8)}`;
  }
  return phone;
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [enrollmentAction, setEnrollmentAction] = useState<"renew" | "re-enroll" | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [togglingApproved, setTogglingApproved] = useState(false);
  const [showApprovalDatePicker, setShowApprovalDatePicker] = useState(false);
  const [approvalDateInput, setApprovalDateInput] = useState(new Date().toISOString().slice(0, 10));
  const [togglingCs, setTogglingCs] = useState(false);
  const [showExtensionInput, setShowExtensionInput] = useState(false);
  const [extensionDaysInput, setExtensionDaysInput] = useState("");
  const [savingExtension, setSavingExtension] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "", phone: "", document: "", city: "", state: "", enrolledAt: "", approvedAt: "",
  });

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/admin/students/${id}`);
    if (!res.ok) return;
    setData(await res.json());
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!data) return <p className="text-center text-black/40 mt-16">Aluno não encontrado</p>;

  const { student, enrollments, ltv, currentStage, currentDaysRemaining } = data;
  const currentEnrollment = enrollments.find((e) => e.id === student.currentEnrollmentId);

  const latestEngagement = (() => {
    if (!currentEnrollment?.stages) return null;
    for (const s of ["mes_10", "mes_7", "mes_4", "mes_2", "dia_10"]) {
      const eng = currentEnrollment.stages[s]?.engagement;
      if (eng && eng !== "NONE") return eng;
    }
    return null;
  })();

  async function toggleHotmartStatus() {
    setTogglingStatus(true);
    try {
      const newStatus = student.hotmartStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotmartStatus: newStatus }),
      });
      if (res.ok) fetchData();
    } finally {
      setTogglingStatus(false);
    }
  }

  async function toggleApproved(approvedAtDate?: string) {
    setTogglingApproved(true);
    try {
      const newApproved = !student.approved;
      const body: Record<string, unknown> = { approved: newApproved };
      if (newApproved && approvedAtDate) {
        body.approvedAt = new Date(approvedAtDate + "T12:00:00Z").toISOString();
      }
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) fetchData();
    } finally {
      setTogglingApproved(false);
    }
  }

  async function toggleCsEnabled() {
    setTogglingCs(true);
    try {
      const csEnabled = student.csEnabled !== false; // default true
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csEnabled: !csEnabled }),
      });
      if (res.ok) fetchData();
    } finally {
      setTogglingCs(false);
    }
  }

  async function saveExtension() {
    if (!currentEnrollment) return;
    const days = parseInt(extensionDaysInput);
    if (isNaN(days) || days <= 0) return;
    setSavingExtension(true);
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId: currentEnrollment.id, extensionDays: days }),
      });
      if (res.ok) {
        setShowExtensionInput(false);
        setExtensionDaysInput("");
        fetchData();
      }
    } finally {
      setSavingExtension(false);
    }
  }

  async function removeExtension() {
    if (!currentEnrollment) return;
    setSavingExtension(true);
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId: currentEnrollment.id, extensionDays: 0 }),
      });
      if (res.ok) fetchData();
    } finally {
      setSavingExtension(false);
    }
  }

  function startEditing() {
    setEditForm({
      name: student.name,
      phone: student.phone,
      document: student.document,
      city: student.city,
      state: student.state,
      enrolledAt: currentEnrollment?.enrolledAt
        ? new Date(currentEnrollment.enrolledAt).toISOString().slice(0, 10)
        : "",
      approvedAt: student.approvedAt
        ? new Date(student.approvedAt).toISOString().slice(0, 10)
        : "",
    });
    setEditing(true);
  }

  async function saveEdits() {
    setSaving(true);
    try {
      const body: Record<string, string> = {};
      if (editForm.name !== student.name) body.name = editForm.name;
      if (editForm.phone !== student.phone) body.phone = editForm.phone;
      if (editForm.document !== student.document) body.document = editForm.document;
      if (editForm.city !== student.city) body.city = editForm.city;
      if (editForm.state !== student.state) body.state = editForm.state;

      if (
        currentEnrollment &&
        editForm.enrolledAt &&
        editForm.enrolledAt !== new Date(currentEnrollment.enrolledAt).toISOString().slice(0, 10)
      ) {
        body.enrolledAt = new Date(editForm.enrolledAt + "T12:00:00Z").toISOString();
        body.enrollmentId = currentEnrollment.id;
      }

      // Update approval date if changed
      const currentApprovedAt = student.approvedAt
        ? new Date(student.approvedAt).toISOString().slice(0, 10)
        : "";
      if (editForm.approvedAt !== currentApprovedAt) {
        if (editForm.approvedAt) {
          body.approvedAt = new Date(editForm.approvedAt + "T12:00:00Z").toISOString();
        }
      }

      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setEditing(false);
        fetchData();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => router.push("/admin/crm")}
        className="text-sm text-primary hover:text-primary-dark transition-colors mb-6 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Voltar ao dashboard
      </button>

      {/* Header */}
      <div className="rounded-2xl p-6 lg:p-8 mb-6 bg-gray-light border border-gray-border">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black">{student.name}</h1>
            <p className="text-black/50 mt-1">{student.email}</p>
            {student.phone && (
              <p className="text-black/50 mt-0.5">{formatPhone(student.phone)}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {/* Row 1: Status + Stage */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={toggleHotmartStatus}
                disabled={togglingStatus}
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                  student.hotmartStatus === "ACTIVE"
                    ? "text-emerald-700 bg-emerald-100 border border-emerald-200"
                    : "text-red-700 bg-red-100 border border-red-200"
                }`}
                title="Clique para alterar o status"
              >
                {student.hotmartStatus === "ACTIVE" ? "Ativo" : "Bloqueado"}
              </button>
              {currentStage && (
                <span className="text-sm font-medium text-primary px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  {STAGE_LABELS[currentStage] || currentStage}
                </span>
              )}
              {student.tags?.length > 0 && student.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-amber-700 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* Row 2: LTV + Days remaining */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <span className="text-sm font-bold text-primary px-3 py-1.5 rounded-full bg-primary/10">
                LTV: R$ {ltv.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              {currentDaysRemaining > 0 && (
                <span className="text-sm text-black/50">{currentDaysRemaining} dias restantes</span>
              )}
            </div>
            {/* Row 3: Engagement + Progress */}
            {(latestEngagement || student.courseProgress != null) && (
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {latestEngagement && (
                  <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${ENGAGEMENT_COLORS[latestEngagement] || "bg-gray-100 text-gray-600"}`}>
                    {ENGAGEMENT_LABELS[latestEngagement] || latestEngagement}
                  </span>
                )}
                {student.courseProgress != null && (
                  <span className="text-sm text-black/50">Progresso: {student.courseProgress}%</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal data */}
        <div className="rounded-2xl p-6 bg-gray-light border border-gray-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-black">Dados Pessoais</h2>
            {!editing ? (
              <button
                onClick={startEditing}
                className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="text-xs font-medium text-black/50 hover:text-black transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEdits}
                  disabled={saving}
                  className="text-xs font-medium text-white bg-primary hover:bg-primary-dark px-3 py-1 rounded-full transition-colors disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <dl className="space-y-3 text-sm">
              {([
                ["Nome", student.name],
                ["Telefone", student.phone],
                ["CPF", student.document],
                ["Cidade", student.city],
                ["Estado", student.state],
              ] as const).map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-black/50">{label}</dt>
                  <dd className="text-black font-medium">{value || "—"}</dd>
                </div>
              ))}
              {/* Approved switch */}
              <div className="flex justify-between items-center">
                <dt className="text-black/50">Aprovado</dt>
                <dd>
                  <button
                    onClick={() => {
                      if (student.approved) {
                        toggleApproved();
                      } else {
                        setApprovalDateInput(new Date().toISOString().slice(0, 10));
                        setShowApprovalDatePicker(true);
                      }
                    }}
                    disabled={togglingApproved}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 disabled:opacity-50 cursor-pointer ${
                      student.approved ? "bg-emerald-500" : "bg-black/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        student.approved ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </dd>
              </div>
              {/* Approval date picker (when toggling on) */}
              {showApprovalDatePicker && !student.approved && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <label className="text-xs text-black/50 flex-shrink-0">Data de aprovação</label>
                  <input
                    type="date"
                    value={approvalDateInput}
                    onChange={(e) => setApprovalDateInput(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-gray-border bg-white text-sm text-black focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
                  />
                  <button
                    onClick={() => {
                      toggleApproved(approvalDateInput);
                      setShowApprovalDatePicker(false);
                    }}
                    disabled={togglingApproved}
                    className="text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setShowApprovalDatePicker(false)}
                    className="text-xs text-black/50 hover:text-black transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
              {/* Approval date display */}
              {student.approved && student.approvedAt && (
                <div className="flex justify-between">
                  <dt className="text-black/50">Data de aprovação</dt>
                  <dd className="text-black font-medium">
                    {new Date(student.approvedAt).toLocaleDateString("pt-BR")}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <div className="space-y-3">
              {([
                ["Nome", "name"],
                ["Telefone", "phone"],
                ["CPF", "document"],
                ["Cidade", "city"],
                ["Estado", "state"],
              ] as [string, keyof typeof editForm][]).map(([label, field]) => (
                <div key={field}>
                  <label className="text-xs text-black/50 mb-1 block">{label}</label>
                  <input
                    type="text"
                    value={editForm[field]}
                    onChange={(e) => setEditForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-border bg-white text-sm text-black placeholder:text-black/30 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
                  />
                </div>
              ))}
              {/* Approval date edit */}
              {student.approved && (
                <div>
                  <label className="text-xs text-black/50 mb-1 block">Data de aprovação</label>
                  <input
                    type="date"
                    value={editForm.approvedAt}
                    onChange={(e) => setEditForm((f) => ({ ...f, approvedAt: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-border bg-white text-sm text-black focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current enrollment */}
        {currentEnrollment && (
          <div className="rounded-2xl p-6 bg-gray-light border border-gray-border">
            <h2 className="font-bold text-black mb-4">Matrícula Atual</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <dt className="text-black/50">Data</dt>
                {editing ? (
                  <input
                    type="date"
                    value={editForm.enrolledAt}
                    onChange={(e) => setEditForm((f) => ({ ...f, enrolledAt: e.target.value }))}
                    className="px-2 py-1 rounded-lg border border-gray-border bg-white text-sm text-black focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
                  />
                ) : (
                  <dd className="text-black font-medium">
                    {currentEnrollment.enrolledAt ? new Date(currentEnrollment.enrolledAt).toLocaleDateString("pt-BR") : "—"}
                  </dd>
                )}
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-black/50">Valor</dt>
                <dd className="flex items-center gap-2">
                  <span className="text-black font-medium">
                    R$ {(currentEnrollment.realPricePaid ?? currentEnrollment.pricePaid).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  {currentEnrollment.needsManualPrice && (
                    <button
                      onClick={() => setShowPriceModal(true)}
                      className="text-xs font-medium text-amber-700 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 hover:bg-amber-50 transition-colors"
                    >
                      Editar valor
                    </button>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-black/50">Pagamento</dt>
                <dd className="text-black font-medium">{currentEnrollment.paymentType} ({currentEnrollment.installments}x)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-black/50">Fonte</dt>
                <dd className="text-black font-medium capitalize">{currentEnrollment.source}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-black/50">Pagamento</dt>
                <dd>
                  {currentEnrollment.status === "refunded" ? (
                    <span className="text-xs font-medium text-red-700 px-2.5 py-0.5 rounded-full bg-red-100">
                      Reembolsado
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-100">
                      Processado
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            {/* Extension */}
            <div className="mt-4 pt-4 border-t border-gray-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-black/50">Extensão</span>
                {currentEnrollment.extensionDays > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">
                      +{currentEnrollment.extensionDays} dias
                    </span>
                    <button
                      onClick={removeExtension}
                      disabled={savingExtension}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setExtensionDaysInput("");
                      setShowExtensionInput(!showExtensionInput);
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                      showExtensionInput ? "bg-primary" : "bg-black/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        showExtensionInput ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                )}
              </div>

              {showExtensionInput && !currentEnrollment.extensionDays && (
                <div className="flex items-center gap-2 mt-3 bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <label className="text-xs text-black/50 flex-shrink-0">Quantos dias?</label>
                  <input
                    type="number"
                    min="1"
                    value={extensionDaysInput}
                    onChange={(e) => setExtensionDaysInput(e.target.value)}
                    placeholder="60"
                    className="w-20 px-2 py-1 rounded-lg border border-gray-border bg-white text-sm text-black text-center focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
                  />
                  <button
                    onClick={saveExtension}
                    disabled={savingExtension || !extensionDaysInput}
                    className="text-xs font-medium text-white bg-primary hover:bg-primary-dark px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setShowExtensionInput(false)}
                    className="text-xs text-black/50 hover:text-black transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {currentEnrollment.extensionDays > 0 && currentEnrollment.enrolledAt && (
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-black/50">Data de extensão</span>
                  <span className="text-black font-medium">
                    {(() => {
                      const d = new Date(currentEnrollment.enrolledAt);
                      d.setDate(d.getDate() + currentEnrollment.extensionDays);
                      return d.toLocaleDateString("pt-BR");
                    })()}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {currentStage === "mes_12" && (
                <button
                  onClick={() => setEnrollmentAction("renew")}
                  className="flex-1 py-2.5 text-white font-bold text-sm rounded-xl transition-all duration-300 bg-primary hover:bg-primary-dark"
                >
                  Renovar
                </button>
              )}
              {currentStage === "antigo_aluno" && (
                <button
                  onClick={() => setEnrollmentAction("re-enroll")}
                  className="flex-1 py-2.5 text-white font-bold text-sm rounded-xl transition-all duration-300 bg-primary hover:bg-primary-dark"
                >
                  Rematricular
                </button>
              )}
            </div>
          </div>
        )}

        {/* CS Timeline */}
        {currentEnrollment && (
          <div className="rounded-2xl p-6 lg:col-span-2 bg-gray-light border border-gray-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-black">Timeline de CS</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-black/50">CS ativo</span>
                <button
                  onClick={toggleCsEnabled}
                  disabled={togglingCs}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 disabled:opacity-50 cursor-pointer ${
                    student.csEnabled !== false ? "bg-primary" : "bg-black/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      student.csEnabled !== false ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {MESSAGE_STAGE_ORDER.map((stageName) => {
                const stage = currentEnrollment.stages?.[stageName];
                const isCsDisabled = stage?.sentAt === "cs_disabled";
                const isSent = stage?.sentAt && stage.sentAt !== "migrated" && stage.sentAt !== "cs_disabled";
                const isMigrated = stage?.sentAt === "migrated";
                const isPending = !stage?.sentAt;

                return (
                  <div
                    key={stageName}
                    className={`flex items-start gap-4 p-3 rounded-xl border ${
                      isSent
                        ? "bg-emerald-50 border-emerald-200"
                        : isCsDisabled
                        ? "bg-amber-50 border-amber-200"
                        : isMigrated
                        ? "bg-white border-gray-border"
                        : "bg-white border-gray-border opacity-60"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${isSent ? "bg-emerald-500" : isCsDisabled ? "bg-amber-400" : isMigrated ? "bg-black/20" : "bg-black/10"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-black">
                          {STAGE_LABELS[stageName] || stageName}
                        </span>
                        {isCsDisabled && (
                          <span className="text-xs text-amber-600 font-medium">CS desativado — mensagem não enviada</span>
                        )}
                        {isMigrated && (
                          <span className="text-xs text-black/40">Migrado</span>
                        )}
                        {isSent && stage?.sentAt && (
                          <span className="text-xs text-black/60">
                            Enviado em {new Date(stage.sentAt).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                        {isPending && (
                          <span className="text-xs text-black/30">Pendente</span>
                        )}
                      </div>
                      {stage?.template && (
                        <span className="text-xs text-black font-mono truncate max-w-[280px] block mt-1">
                          {stage.template}
                        </span>
                      )}
                    </div>
                    {stage && (stage.engagement || stage.progress != null) && (
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        {stage.engagement && (
                          <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${ENGAGEMENT_COLORS[stage.engagement] || "bg-gray-100 text-gray-600"}`}>
                            {ENGAGEMENT_LABELS[stage.engagement] || stage.engagement}
                          </span>
                        )}
                        {stage.progress != null && (
                          <span className="text-xs text-black">
                            {stage.progress}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enrollment History */}
        {enrollments.length >= 1 && (
          <div className="rounded-2xl p-6 lg:col-span-2 bg-gray-light border border-gray-border">
            <h2 className="font-bold text-black mb-4">Histórico de Matrículas</h2>
            <div className="space-y-3">
              {enrollments.map((e) => (
                <div
                  key={e.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    e.id === student.currentEnrollmentId
                      ? "bg-primary/5 border-primary/20"
                      : "bg-white border-gray-border"
                  }`}
                >
                  <div>
                    <span className="text-sm font-medium text-black">
                      {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString("pt-BR") : "—"}
                    </span>
                    <span className="text-xs text-black/40 ml-2 capitalize">{e.source}</span>
                    {e.id === student.currentEnrollmentId && (
                      <span className="text-xs text-primary ml-2 font-medium">Atual</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-black">
                      R$ {(e.realPricePaid ?? e.pricePaid).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    {e.status === "refunded" ? (
                      <span className="text-xs text-red-700 px-2 py-0.5 rounded-full bg-red-100">
                        Reembolsado
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-100">
                        Processado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showPriceModal && currentEnrollment && (
        <EditPriceModal
          studentId={student.id}
          enrollmentId={currentEnrollment.id}
          onClose={() => setShowPriceModal(false)}
          onSuccess={fetchData}
        />
      )}

      {enrollmentAction && (
        <EnrollmentModal
          studentId={student.id}
          action={enrollmentAction}
          onClose={() => setEnrollmentAction(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
