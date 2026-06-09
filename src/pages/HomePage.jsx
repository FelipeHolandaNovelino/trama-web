import { useMemo } from "react"

import { getPatientsTimelineSummaries } from "../utils/patientTimelineSummary"

function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function CalendarIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  )
}

function UserIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function ConnectionIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19.07" />
    </svg>
  )
}

function StatusBadge({ status }) {
  const statusClassName = {
    "Em acompanhamento": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Triagem inicial": "bg-violet-50 text-violet-700 border-violet-100",
    Encerrado: "bg-slate-100 text-slate-600 border-slate-200",
  }

  return (
    <span
      className={`max-w-full truncate rounded-full border px-3 py-1 text-xs font-semibold ${
        statusClassName[status] ||
        "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {status || "Sem status"}
    </span>
  )
}

function StatItem({ label, value }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <strong className="mt-1 block text-base font-black text-slate-950">
        {value}
      </strong>
    </article>
  )
}

function SectionHeader({ title, description }) {
  return (
    <div className="min-w-0">
      <h2 className="text-base font-black text-slate-950 sm:text-lg">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      )}
    </div>
  )
}

function PatientPreviewCard({ patient, summary, onOpenPatient }) {
  return (
    <button
      type="button"
      onClick={() => onOpenPatient(patient)}
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/30 hover:shadow-sm"
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="truncate text-sm font-black text-slate-950">
            {patient.name}
          </p>

          <StatusBadge status={patient.status} />
        </div>

        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
          {patient.mainComplaint || patient.description || "Sem resumo clínico."}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-400">
          <span>{summary?.sessionsCount || 0} sessões</span>
          <span className="text-slate-300">·</span>
          <span>{summary?.blocksCount || 0} blocos</span>
          <span className="text-slate-300">·</span>
          <span>{summary?.connectionsCount || 0} conexões</span>
        </div>
      </div>

      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition group-hover:bg-violet-100 group-hover:text-violet-800">
        <ArrowRightIcon />
      </span>
    </button>
  )
}

function AppointmentCard({ patient, onOpenPatient }) {
  return (
    <button
      type="button"
      onClick={() => onOpenPatient(patient)}
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/30 hover:shadow-sm"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-950">
          {patient.name}
        </p>

        <p className="mt-1 inline-flex max-w-full items-center gap-1.5 text-xs font-semibold text-slate-500">
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {patient.nextSession || "Próxima sessão não informada"}
          </span>
        </p>
      </div>

      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-800 group-hover:text-white">
        <ArrowRightIcon />
      </span>
    </button>
  )
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center">
      <p className="text-sm font-semibold text-slate-700">{title}</p>

      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  )
}

function FollowUpItem({ label, value, description, tone = "violet" }) {
  const toneClassName = {
    violet:
      "border-violet-200 bg-violet-50/80 text-violet-900 [&_.follow-value]:text-violet-800 [&_.follow-dot]:bg-violet-500",
    indigo:
      "border-indigo-200 bg-indigo-50/80 text-indigo-900 [&_.follow-value]:text-indigo-800 [&_.follow-dot]:bg-indigo-500",
    sky: "border-sky-200 bg-sky-50/80 text-sky-900 [&_.follow-value]:text-sky-800 [&_.follow-dot]:bg-sky-500",
  }

  return (
    <article
      className={`rounded-2xl border px-4 py-3 ${
        toneClassName[tone] || toneClassName.violet
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="follow-dot h-2 w-2 shrink-0 rounded-full" />

          <span className="truncate text-sm font-bold">{label}</span>
        </div>

        <strong className="follow-value text-lg font-black">{value}</strong>
      </div>

      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </article>
  )
}

function ClinicalAttentionCard({ patientsWithoutNextSession, patientsWithoutTimeline }) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <SectionHeader
        title="Atenção clínica"
        description="Pontos discretos para revisar antes de começar os atendimentos."
      />

      <div className="mt-4 grid gap-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-800">
              <CalendarIcon className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                Retornos sem data
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {patientsWithoutNextSession.length} paciente
                {patientsWithoutNextSession.length !== 1 ? "s" : ""} sem próxima
                sessão informada.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800">
              <ConnectionIcon className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                Timeline ainda vazia
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {patientsWithoutTimeline.length} prontuário
                {patientsWithoutTimeline.length !== 1 ? "s" : ""} ainda sem
                sessões registradas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Tela inicial do profissional.
 *
 * A Home mostra apenas informações úteis para começar o trabalho:
 * visão geral discreta, pontos para acompanhar, próximas sessões e pacientes recentes.
 */
export function HomePage({
  patients = [],
  patientStats,
  onGoToPatients,
  onOpenPatient,
}) {
  const stats = patientStats || {
    total: patients.length,
    active: 0,
    screening: 0,
  }

  /**
   * Usa o mesmo resumo de timeline exibido nos cards de pacientes.
   * Assim a Home identifica prontuários que ainda não começaram sua linha clínica.
   */
  const timelineSummariesByPatientId = useMemo(() => {
    return getPatientsTimelineSummaries(patients)
  }, [patients])

  const recentPatients = patients.slice(0, 5)

  const upcomingPatients = patients
    .filter((patient) => patient.nextSession)
    .slice(0, 5)

  const patientsWithoutNextSession = patients.filter(
    (patient) => !patient.nextSession
  )

  const patientsWithoutTimeline = patients.filter((patient) => {
    const summary = timelineSummariesByPatientId[patient.id]

    return !summary?.hasTimeline
  })

  const screeningPatients = patients.filter(
    (patient) => patient.status === "Triagem inicial"
  )

  return (
    <main className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
              Home
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Visão geral
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
              Acompanhe seus pacientes e acesse rapidamente os prontuários.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToPatients}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900 sm:w-auto"
          >
            Ver pacientes
            <ArrowRightIcon />
          </button>
        </div>

        <section className="mt-4 grid gap-2 sm:grid-cols-3">
          <StatItem label="Pacientes" value={stats.total} />
          <StatItem label="Em acompanhamento" value={stats.active} />
          <StatItem label="Triagem inicial" value={stats.screening} />
        </section>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[2rem] border border-violet-100 bg-white p-4 shadow-sm sm:p-5">
          <SectionHeader
            title="Para acompanhar"
            description="Pontos simples para organizar a continuidade do cuidado."
          />

          <div className="mt-4 grid gap-3">
            <FollowUpItem
              label="Retornos a definir"
              value={patientsWithoutNextSession.length}
              description="Pacientes sem próxima sessão informada."
              tone="violet"
            />

            <FollowUpItem
              label="Primeira sessão pendente"
              value={patientsWithoutTimeline.length}
              description="Prontuários ainda sem sessões registradas."
              tone="indigo"
            />

            <FollowUpItem
              label="Triagens em andamento"
              value={screeningPatients.length}
              description="Pacientes ainda em fase inicial de acompanhamento."
              tone="sky"
            />
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionHeader
            title="Próximas sessões"
            description="Atendimentos registrados com data futura."
          />

          <div className="mt-4 grid gap-3">
            {upcomingPatients.length > 0 ? (
              upcomingPatients.map((patient) => (
                <AppointmentCard
                  key={patient.id}
                  patient={patient}
                  onOpenPatient={onOpenPatient}
                />
              ))
            ) : (
              <EmptyState
                title="Nenhuma próxima sessão"
                description="As próximas sessões aparecerão aqui quando forem cadastradas."
              />
            )}
          </div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <ClinicalAttentionCard
          patientsWithoutNextSession={patientsWithoutNextSession}
          patientsWithoutTimeline={patientsWithoutTimeline}
        />

        <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              title="Pacientes recentes"
              description="Acesso rápido aos prontuários cadastrados."
            />

            <button
              type="button"
              onClick={onGoToPatients}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              Ver todos
            </button>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient) => (
                <PatientPreviewCard
                  key={patient.id}
                  patient={patient}
                  summary={timelineSummariesByPatientId[patient.id]}
                  onOpenPatient={onOpenPatient}
                />
              ))
            ) : (
              <EmptyState
                title="Nenhum paciente cadastrado"
                description="Use a página de pacientes para criar o primeiro cadastro."
              />
            )}
          </div>
        </article>
      </section>
    </main>
  )
}