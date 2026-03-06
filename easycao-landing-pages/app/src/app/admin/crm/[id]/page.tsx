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
  NONE: "bg-gray-400", LOW: "bg-yellow-500", MEDIUM: "bg-green-500",
  HIGH: "bg-blue-500", VERY_HIGH: "bg-purple-500",
};

const ENGAGEMENT_LABELS: Record<string, string> = {
  NONE: "Nenhum", LOW: "Baixo", MEDIUM: "Médio",
  HIGH: "Alto", VERY_HIGH: "Muito Alto",
};

const MESSAGE_STAGE_ORDER = ["dia_10", "mes_2", "mes_4", "mes_7", "mes_10"];

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
  const [editForm, setEditForm] = useState({
    name: "", phone: "", document: "", city: "", state: "", enrolledAt: "",
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

  // Compute latest engagement from stages
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-border p-6 lg:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black">{student.name}</h1>
            <p className="text-black/60 mt-1">{student.email}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={toggleHotmartStatus}
              disabled={togglingStatus}
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                student.hotmartStatus === "ACTIVE"
                  ? "text-green-700 bg-green-100 hover:bg-green-200"
                  : "text-red-700 bg-red-100 hover:bg-red-200"
              }`}
              title="Clique para alterar o status"
            >
              {student.hotmartStatus === "ACTIVE" ? "Ativo" : "Bloqueado"}
            </button>
            {(student.courseProgress != null || latestEngagement) && (
              <span className="text-sm text-black/50 flex items-center gap-2">
                {student.courseProgress != null && <>Progresso: {student.courseProgress}%</>}
                {latestEngagement && (
                  <span className={`text-xs text-white font-medium px-2 py-0.5 rounded-full ${ENGAGEMENT_COLORS[latestEngagement] || "bg-gray-400"}`}>
                    {ENGAGEMENT_LABELS[latestEngagement] || latestEngagement}
                  </span>
                )}
              </span>
            )}
            {student.tags?.length > 0 && student.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {currentStage && (
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                {STAGE_LABELS[currentStage] || currentStage}
              </span>
            )}
            {currentDaysRemaining > 0 && (
              <span className="text-sm text-black/50">{currentDaysRemaining} dias restantes</span>
            )}
            <span className="text-sm font-bold text-primary-dark bg-primary/5 px-3 py-1.5 rounded-full">
              LTV: R$ {ltv.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal data */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-border p-6">
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-border bg-gray-light text-sm text-black focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current enrollment */}
        {currentEnrollment && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-border p-6">
            <h2 className="font-bold text-black mb-4">Matrícula Atual</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <dt className="text-black/50">Data</dt>
                {editing ? (
                  <input
                    type="date"
                    value={editForm.enrolledAt}
                    onChange={(e) => setEditForm((f) => ({ ...f, enrolledAt: e.target.value }))}
                    className="px-2 py-1 rounded-lg border border-gray-border bg-gray-light text-sm text-black focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
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
                      className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full hover:bg-orange-200 transition-colors"
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
                    <span className="text-xs font-medium text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">Reembolsado</span>
                  ) : (
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">Processado</span>
                  )}
                </dd>
              </div>
            </dl>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {currentStage === "mes_12" && (
                <button
                  onClick={() => setEnrollmentAction("renew")}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition-all duration-300"
                >
                  Renovar
                </button>
              )}
              {currentStage === "antigo_aluno" && (
                <button
                  onClick={() => setEnrollmentAction("re-enroll")}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition-all duration-300"
                >
                  Rematricular
                </button>
              )}
            </div>
          </div>
        )}

        {/* CS Timeline */}
        {currentEnrollment && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-border p-6 lg:col-span-2">
            <h2 className="font-bold text-black mb-4">Timeline de CS</h2>
            <div className="space-y-3">
              {MESSAGE_STAGE_ORDER.map((stageName) => {
                const stage = currentEnrollment.stages?.[stageName];
                const isSent = stage?.sentAt && stage.sentAt !== "migrated";
                const isMigrated = stage?.sentAt === "migrated";
                const isPending = !stage?.sentAt;

                return (
                  <div
                    key={stageName}
                    className={`flex items-center gap-4 p-3 rounded-xl border ${
                      isSent ? "border-green-200 bg-green-50" : isMigrated ? "border-gray-200 bg-gray-50" : "border-gray-border bg-white opacity-50"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isSent ? "bg-green-500" : isMigrated ? "bg-gray-400" : "bg-gray-300"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-black">
                          {STAGE_LABELS[stageName] || stageName}
                        </span>
                        {isMigrated && (
                          <span className="text-xs text-black/40">Migrado</span>
                        )}
                        {isSent && stage?.sentAt && (
                          <span className="text-xs text-black/40">
                            Enviado em {new Date(stage.sentAt).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                        {isPending && (
                          <span className="text-xs text-black/30">Pendente</span>
                        )}
                      </div>
                      {/* Stage details */}
                      {stage && (stage.engagement || stage.template || stage.progress != null) && (
                        <div className="flex items-center gap-3 mt-1">
                          {stage.engagement && (
                            <span className="text-xs text-black/50">
                              Engajamento: <span className="font-medium text-black/70">{ENGAGEMENT_LABELS[stage.engagement] || stage.engagement}</span>
                            </span>
                          )}
                          {stage.progress != null && (
                            <span className="text-xs text-black/50">
                              Progresso: <span className="font-medium text-black/70">{stage.progress}%</span>
                            </span>
                          )}
                          {stage.template && (
                            <span className="text-xs text-black/40 font-mono truncate max-w-[200px]">
                              {stage.template}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {stage?.engagement && (
                      <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${ENGAGEMENT_COLORS[stage.engagement] || "bg-gray-400"}`} title={ENGAGEMENT_LABELS[stage.engagement] || stage.engagement} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enrollment History */}
        {enrollments.length >= 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-border p-6 lg:col-span-2">
            <h2 className="font-bold text-black mb-4">Histórico de Matrículas</h2>
            <div className="space-y-3">
              {enrollments.map((e) => (
                <div
                  key={e.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    e.id === student.currentEnrollmentId ? "border-primary/30 bg-primary/5" : "border-gray-border"
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
                      <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Reembolsado</span>
                    ) : (
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Processado</span>
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
