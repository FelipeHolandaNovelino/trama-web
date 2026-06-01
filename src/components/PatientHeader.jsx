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
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  )
}

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

function MailIcon() {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function PhoneIcon() {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.61a2 2 0 0 1-.45 2.11L8 9.72a16 16 0 0 0 6.28 6.28l1.28-1.28a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.61.62A2 2 0 0 1 22 16.92Z" />
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

/**
 * Gera iniciais seguras para o avatar textual do paciente.
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
 * Mantém o status visual consistente com a lista de pacientes.
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
 * Informação discreta exibida na linha auxiliar do cabeçalho.
 */
function CompactInfoItem({ icon, label, value }) {
  if (!value) {
    return null
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
      <span className="text-slate-400">{icon}</span>
      <span className="text-slate-400">{label}:</span>
      <strong className="font-semibold text-slate-700">{value}</strong>
    </span>
  )
}

/**
 * Cabeçalho compacto do paciente aberto.
 *
 * O objetivo é contextualizar o prontuário sem ocupar espaço excessivo
 * antes da timeline clínica.
 */
export function PatientHeader({
  patient,
  onAddSession,
  onBackToPatients,
  onEditPatient,
}) {
  const description = patient.description || patient.summary
  const complaint = patient.mainComplaint || patient.context
  const ageLabel = patient.age ? `${patient.age} anos` : "Idade não informada"

  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-sm font-black text-violet-700">
            {patient.avatar ? (
              <img
                src={patient.avatar}
                alt=""
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              getInitials(patient.name)
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {onBackToPatients && (
                <button
                  type="button"
                  onClick={onBackToPatients}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                >
                  <ArrowLeftIcon />
                  Pacientes
                </button>
              )}

              <h1 className="truncate text-xl font-black tracking-tight text-slate-950">
                {patient.name}
              </h1>

              <span className="text-slate-300">·</span>

              <span className="text-sm font-medium text-slate-500">
                {ageLabel}
              </span>

              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClassName(
                  patient.status
                )}`}
              >
                {patient.status || "Status não informado"}
              </span>
            </div>

            {complaint && (
              <p className="mt-1.5 line-clamp-1 text-sm font-semibold text-slate-800">
                {complaint}
              </p>
            )}

            {description && (
              <p className="mt-1 line-clamp-1 max-w-5xl text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <CompactInfoItem
                icon={<CalendarIcon />}
                label="Última"
                value={patient.lastSession || "—"}
              />

              <CompactInfoItem
                icon={<CalendarIcon />}
                label="Próxima"
                value={patient.nextSession || "—"}
              />

              <CompactInfoItem
                icon={<MailIcon />}
                label="E-mail"
                value={patient.email}
              />

              <CompactInfoItem
                icon={<PhoneIcon />}
                label="Telefone"
                value={patient.phone}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:items-center">
          {onEditPatient && (
            <button
              type="button"
              onClick={onEditPatient}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Editar paciente
            </button>
          )}

          <button
            type="button"
            onClick={onAddSession}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900"
          >
            <PlusIcon />
            Nova sessão
          </button>
        </div>
      </div>
    </section>
  )
}