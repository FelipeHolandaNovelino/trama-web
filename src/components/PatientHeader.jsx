/**
 * Gera iniciais seguras para o avatar textual do paciente.
 * Útil enquanto o cadastro real ainda não possui upload de imagem.
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

export function PatientHeader({ patient, onAddSession, onBackToPatients }) {
  /**
   * Alguns pacientes usam "description" e o paciente base usa "summary".
   * Esse fallback mantém o componente compatível com os dois formatos.
   */
  const description = patient.description || patient.summary

  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5 lg:px-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {patient.avatar ? (
            <img
              src={patient.avatar}
              alt={patient.name}
              className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-violet-50 text-lg font-black text-violet-800 sm:h-20 sm:w-20 sm:text-xl">
              {getInitials(patient.name)}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                {patient.name}
              </h2>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 sm:text-sm">
                {patient.age} anos
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 sm:text-sm">
              <span>Última sessão: {patient.lastSession}</span>

              {patient.mainComplaint && <span>{patient.mainComplaint}</span>}

              {patient.context && <span>{patient.context}</span>}
            </div>

            {description && (
              <p className="mt-2 max-w-5xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                {description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {(patient.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-medium text-violet-700 sm:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          {onBackToPatients && (
            <button
              type="button"
              onClick={onBackToPatients}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Voltar para pacientes
            </button>
          )}

          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Editar paciente
          </button>

          <button
            type="button"
            onClick={onAddSession}
            className="rounded-2xl bg-violet-800 px-4 py-2 text-sm font-medium text-white hover:bg-violet-900"
          >
            + Nova sessão
          </button>
        </div>
      </div>
    </section>
  )
}