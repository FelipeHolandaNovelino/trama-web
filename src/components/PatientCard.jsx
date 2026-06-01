function CalendarIcon() {
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
      className="h-6 w-6"
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
 * Linha horizontal de paciente.
 *
 * O card inteiro abre o prontuário ao ser clicado.
 * Botões internos usam stopPropagation para não disparar a abertura do paciente.
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
      className="grid cursor-pointer gap-6 px-6 py-8 outline-none transition hover:bg-violet-50/30 focus-visible:bg-violet-50/40 focus-visible:ring-4 focus-visible:ring-violet-100 lg:grid-cols-[minmax(0,1.8fr)_1fr_1fr_180px] lg:items-center"
      aria-label={`Abrir prontuário de ${patient.name}`}
    >
      <section className="flex gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-violet-50 text-xl font-black text-violet-700">
          {getInitials(patient.name)}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black tracking-tight text-slate-950">
              {patient.name}
            </h3>

            <span className="text-slate-300">·</span>

            <span className="text-sm font-medium text-slate-500">
              {patient.age ? `${patient.age} anos` : "Idade não informada"}
            </span>
          </div>

          {patient.mainComplaint && (
            <p className="mt-3 text-sm font-bold text-slate-800">
              {patient.mainComplaint}
            </p>
          )}

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-500">
            {patient.description || "Paciente sem descrição clínica inicial."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(patient.tags || []).slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-violet-50 px-4 py-1.5 text-xs font-semibold text-violet-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5 border-slate-200 lg:border-l lg:px-8">
        <span
          className={`w-fit rounded-full border px-5 py-2 text-sm font-semibold ${getStatusClassName(
            patient.status
          )}`}
        >
          {patient.status}
        </span>

        <div className="flex gap-4 text-slate-500">
          <CalendarIcon />

          <div>
            {summary.hasTimeline ? (
              <>
                <p className="text-sm font-bold text-slate-700">
                  {formatCount(summary.sessionsCount, "sessão", "sessões")} ·{" "}
                  {formatCount(summary.blocksCount, "bloco", "blocos")}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {summary.connectionsCount > 0
                    ? formatCount(
                        summary.connectionsCount,
                        "conexão clínica",
                        "conexões clínicas"
                      )
                    : "Sem conexões clínicas"}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-slate-700">
                  Nenhuma sessão
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Sem blocos registrados
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 border-slate-200 text-slate-600 lg:border-l lg:px-8">
        <div className="flex gap-4">
          <CalendarIcon />

          <div>
            <p className="text-sm font-semibold text-slate-600">
              Última sessão
            </p>

            <p className="mt-1 text-lg font-medium text-slate-800">
              {patient.lastSession || "—"}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <CalendarIcon />

          <div>
            <p className="text-sm font-semibold text-slate-600">
              Próxima sessão
            </p>

            <p className="mt-1 text-lg font-medium text-slate-800">
              {patient.nextSession || "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-start gap-6 border-slate-200 text-slate-500 lg:justify-center lg:border-l lg:px-8">
        <button
          type="button"
          onClick={handleEditClick}
          className="transition hover:text-violet-700"
          aria-label={`Editar ${patient.name}`}
          title="Editar paciente"
        >
          <EditIcon />
        </button>

        <button
          type="button"
          onClick={handleDeleteClick}
          className="transition hover:text-rose-600"
          aria-label={`Excluir ${patient.name}`}
          title="Excluir paciente"
        >
          <TrashIcon />
        </button>

        <button
          type="button"
          onClick={handleOpenButtonClick}
          className="transition hover:text-violet-700"
          aria-label={`Abrir ${patient.name}`}
          title="Abrir paciente"
        >
          <OpenIcon />
        </button>
      </section>
    </article>
  )
}