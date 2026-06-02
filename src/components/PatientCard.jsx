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

function EditIcon({ className = "h-4 w-4" }) {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function TrashIcon({ className = "h-4 w-4" }) {
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
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

function OpenIcon({ className = "h-4 w-4" }) {
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

/**
 * Gera as iniciais do paciente para o avatar textual.
 */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Formata contadores no singular ou plural.
 */
function formatCount(value, singular, plural) {
  return value === 1 ? `${value} ${singular}` : `${value} ${plural}`
}

/**
 * Define o estilo visual do status do paciente.
 */
function getStatusClassName(status) {
  if (status === "Em acompanhamento") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }

  if (status === "Triagem inicial") {
    return "border-violet-200 bg-violet-50 text-violet-700"
  }

  return "border-slate-200 bg-slate-50 text-slate-600"
}

/**
 * Retorna uma descrição curta da timeline para a listagem.
 */
function getTimelineDescription(summary) {
  if (!summary.hasTimeline) {
    return {
      title: "Nenhuma sessão",
      subtitle: "Sem blocos registrados",
    }
  }

  return {
    title: `${formatCount(
      summary.sessionsCount,
      "sessão",
      "sessões"
    )} · ${formatCount(summary.blocksCount, "bloco", "blocos")}`,
    subtitle:
      summary.connectionsCount > 0
        ? formatCount(
            summary.connectionsCount,
            "conexão clínica",
            "conexões clínicas"
          )
        : "Sem conexões clínicas",
  }
}

function TimelineSummary({ summary }) {
  const timelineDescription = getTimelineDescription(summary)

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        Timeline
      </p>

      <p className="mt-1 text-sm font-black text-slate-950">
        {timelineDescription.title}
      </p>

      <p className="mt-0.5 text-xs text-slate-500">
        {timelineDescription.subtitle}
      </p>
    </div>
  )
}

function DatePill({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 inline-flex max-w-full items-center gap-1.5 text-xs font-semibold text-slate-700">
        <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span className="truncate">{value || "—"}</span>
      </p>
    </div>
  )
}

function ActionButton({ label, icon, tone = "slate", onClick }) {
  const toneClassName =
    tone === "rose"
      ? "text-rose-700 hover:bg-rose-50"
      : tone === "violet"
        ? "text-violet-700 hover:bg-violet-50"
        : "text-slate-600 hover:bg-slate-50"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${toneClassName}`}
    >
      {icon}
      {label}
    </button>
  )
}

/**
 * Linha responsiva de paciente.
 *
 * O card inteiro abre o prontuário; botões internos interrompem esse clique.
 */
export function PatientCard({
  patient,
  timelineSummary,
  onEdit,
  onDelete,
  onOpen,
}) {
  const summary = timelineSummary || {
    sessionsCount: 0,
    blocksCount: 0,
    connectionsCount: 0,
    hasTimeline: false,
  }

  function handleOpenPatient() {
    onOpen(patient)
  }

  function handleKeyboardOpen(event) {
    if (event.key === "Enter") {
      handleOpenPatient()
    }
  }

  function handleEditClick(event) {
    event.stopPropagation()
    onEdit(patient)
  }

  function handleDeleteClick(event) {
    event.stopPropagation()
    onDelete(patient)
  }

  function handleOpenButtonClick(event) {
    event.stopPropagation()
    onOpen(patient)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpenPatient}
      onKeyDown={handleKeyboardOpen}
      className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-4 outline-none transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/20 hover:shadow-sm focus-visible:ring-4 focus-visible:ring-violet-100"
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_220px_220px_auto] xl:items-center">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-sm font-black text-violet-800">
            {patient.name ? getInitials(patient.name) : <UserIcon />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="line-clamp-1 text-base font-black text-slate-950">
                {patient.name || "Paciente sem nome"}
              </h3>

              <span
                className={`max-w-full truncate rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                  patient.status
                )}`}
              >
                {patient.status || "Sem status"}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>{patient.age ? `${patient.age} anos` : "Idade não informada"}</span>

              {patient.mainComplaint && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="line-clamp-1">{patient.mainComplaint}</span>
                </>
              )}
            </div>

            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
              {patient.description || "Paciente sem descrição clínica inicial."}
            </p>
          </div>
        </div>

        <TimelineSummary summary={summary} />

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          <DatePill label="Última" value={patient.lastSession} />
          <DatePill label="Próxima" value={patient.nextSession} />
        </div>

        <div className="grid gap-2 border-t border-slate-100 pt-3 sm:flex sm:flex-wrap sm:justify-end xl:border-t-0 xl:pt-0">
          <ActionButton
            label="Abrir"
            tone="violet"
            icon={<OpenIcon className="h-3.5 w-3.5" />}
            onClick={handleOpenButtonClick}
          />

          <ActionButton
            label="Editar"
            icon={<EditIcon className="h-3.5 w-3.5" />}
            onClick={handleEditClick}
          />

          <ActionButton
            label="Excluir"
            tone="rose"
            icon={<TrashIcon className="h-3.5 w-3.5" />}
            onClick={handleDeleteClick}
          />
        </div>
      </div>
    </article>
  )
}