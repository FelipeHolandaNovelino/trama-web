export function PatientHeader({ patient, onAddSession }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="h-20 w-20 rounded-full object-cover"
          />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-950">
                {patient.name}
              </h2>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
                {patient.age} anos
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
              <span>Última sessão: {patient.lastSession}</span>
              <span>{patient.mainComplaint}</span>
              <span>{patient.context}</span>
            </div>

            <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600">
              {patient.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(patient.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Editar paciente
          </button>

          <button
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