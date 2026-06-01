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

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
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

function OpenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" />
    </svg>
  )
}

/**
 * Gera as iniciais do paciente para o avatar textual.
 * Mantém uma identificação visual rápida sem depender de upload de imagem.
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
    return "border-amber-200 bg-amber-50 text-amber-700"
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
    title: `${formatCount(summary.sessionsCount, "sessão", "sessões")} · ${formatCount(
      summary.blocksCount,
      "bloco",
      "blocos"
    )}`,
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

/**
 * Linha horizontal de paciente.
 *
 * O card inteiro abre o prontuário ao ser clicado.
 * Os botões internos interrompem o clique para não abrir o paciente por acidente.
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

  const timelineDescription = getTimelineDescription(summary)

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
      aria-label={`Abrir prontuário de ${patient.name}`}
      className="grid cursor-pointer gap-5 px-5 py-6 outline-none transition hover:bg-violet-50/30 focus-visible:bg-violet-50/40 focus-visible:ring-4 focus-visible:ring-violet-100 lg:grid-cols-[minmax(0,1.7fr)_220px_260px_120px] lg:items-center lg:px-6"
    >
      <section className="flex min-w-0 gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-base font-black text-violet-700">
          {getInitials(patient.name)}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate text-lg font-black tracking-tight text-slate-950">
              {patient.name}
            </h3>

            <span className="text-slate-300">·</span>

            <span className="text-sm font-medium text-slate-500">
              {patient.age ? `${patient.age} anos` : "Idade não informada"}
            </span>
          </div>

          {patient.mainComplaint && (
            <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-800">
              {patient.mainComplaint}
            </p>
          )}

          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-slate-500">
            {patient.description || "Paciente sem descrição clínica inicial."}
          </p>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3 lg:block lg:border-l lg:border-slate-200 lg:px-6">
        <span
          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClassName(
            patient.status
          )}`}
        >
          {patient.status}
        </span>

        <div className="flex items-start gap-3 text-slate-500 lg:mt-4">
          <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0" />

          <div>
            <p className="text-sm font-bold text-slate-700">
              {timelineDescription.title}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {timelineDescription.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 text-slate-600 sm:grid-cols-2 lg:grid-cols-1 lg:border-l lg:border-slate-200 lg:px-6">
        <div className="flex items-start gap-3">
          <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Última sessão
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {patient.lastSession || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Próxima sessão
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {patient.nextSession || "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-start gap-2 border-slate-200 text-slate-500 lg:justify-end lg:border-l lg:px-4">
        <button
          type="button"
          onClick={handleEditClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-violet-50 hover:text-violet-700"
          aria-label={`Editar ${patient.name}`}
          title="Editar paciente"
        >
          <EditIcon />
        </button>

        <button
          type="button"
          onClick={handleDeleteClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-rose-50 hover:text-rose-600"
          aria-label={`Excluir ${patient.name}`}
          title="Excluir paciente"
        >
          <TrashIcon />
        </button>

        <button
          type="button"
          onClick={handleOpenButtonClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-violet-50 hover:text-violet-700"
          aria-label={`Abrir ${patient.name}`}
          title="Abrir paciente"
        >
          <OpenIcon />
        </button>
      </section>
    </article>
  )
}