export function RightPanel({ patient }) {
  return (
    <aside className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">Espelho do paciente</h3>
        <p className="mt-3 text-sm text-slate-600">
          {patient.mirror.centralWound} {patient.mirror.mainFear}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">Padrões emocionais</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          {patient.emotionalPatterns.map((pattern) => (
            <p key={pattern}>• {pattern}</p>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">Medicações</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          {patient.medications.map((medication) => (
            <p key={medication}>{medication}</p>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">Relações importantes</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {patient.relationships.map((person) => (
            <span
              key={person}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
            >
              {person}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}