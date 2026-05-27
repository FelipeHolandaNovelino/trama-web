export function PatientHeader({ patient }) {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between gap-6">
        <div>
          <p className="text-sm text-slate-500">Paciente</p>
          <h2 className="text-3xl font-bold text-slate-900">{patient.name}</h2>

          <div className="mt-2 flex gap-2 text-sm text-slate-500">
            <span>{patient.age} anos</span>
            <span>•</span>
            <span>{patient.mainComplaint}</span>
            <span>•</span>
            <span>Última sessão: {patient.lastSession}</span>
          </div>

          <p className="mt-4 max-w-2xl text-slate-600">
            {patient.summary}
          </p>
        </div>

        <div className="flex gap-3">
          <button className="h-11 rounded-2xl bg-violet-800 px-5 text-white font-medium shadow-sm">
            + Adicionar sessão
          </button>
          <button className="h-11 rounded-2xl border border-slate-200 px-5 text-slate-700">
            Editar espelho
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {patient.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}