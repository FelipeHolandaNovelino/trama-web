function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
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

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

/**
 * Normaliza listas vindas de formatos antigos e novos.
 */
function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
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

function RelationshipChips({ relationships }) {
  const visibleRelationships = relationships.slice(0, 4)
  const hiddenCount = relationships.length - visibleRelationships.length

  if (relationships.length === 0) {
    return (
      <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-400">
        <UsersIcon />
        <span className="truncate">Sem relacionamentos</span>
      </span>
    )
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-xs">
        <UsersIcon />
        Relações
      </span>

      {visibleRelationships.map((relationship) => (
        <span
          key={relationship}
          title={relationship}
          className="max-w-[120px] truncate rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 sm:max-w-[160px]"
        >
          {relationship}
        </span>
      ))}

      {hiddenCount > 0 && (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
          +{hiddenCount}
        </span>
      )}
    </div>
  )
}

/**
 * Cabeçalho compacto do prontuário individual.
 *
 * Mantém as informações essenciais do paciente sem ocupar muito espaço.
 * Em telas menores, as informações quebram em linhas controladas para evitar
 * estouro visual.
 */
export function PatientHeader({ patient, onAddSession, onBackToPatients }) {
  const relationships = normalizeList(patient?.relationships)

  return (
    <header className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {onBackToPatients && (
              <button
                type="button"
                onClick={onBackToPatients}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <ArrowLeftIcon />
                <span className="truncate">Pacientes</span>
              </button>
            )}

            <StatusBadge status={patient?.status} />
          </div>

          <div className="mt-3 min-w-0">
            <h1 className="line-clamp-2 text-xl font-black leading-tight tracking-tight text-slate-950 sm:text-2xl">
              {patient?.name || "Paciente sem nome"}
            </h1>

            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              {patient?.age && <span className="shrink-0">{patient.age} anos</span>}

              {patient?.mainComplaint && (
                <>
                  <span className="hidden text-slate-300 sm:inline">·</span>

                  <span className="line-clamp-1 min-w-0 max-w-full sm:max-w-[520px]">
                    {patient.mainComplaint}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
              <CalendarIcon />
              <span className="shrink-0">Próxima sessão:</span>
              <strong className="truncate font-bold text-slate-700">
                {patient?.nextSession || "não informada"}
              </strong>
            </span>

            <RelationshipChips relationships={relationships} />
          </div>
        </div>

        <button
          type="button"
          onClick={onAddSession}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900 xl:w-auto xl:shrink-0"
        >
          <PlusIcon />
          Nova sessão
        </button>
      </div>
    </header>
  )
}