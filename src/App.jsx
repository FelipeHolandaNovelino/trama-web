import { timeline } from "./data/timeline"
import { Sidebar } from "./components/Sidebar"
import { PatientHeader } from "./components/PatientHeader"
import { Timeline } from "./components/Timeline"

function RightPanel() {
  return (
    <aside className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">Espelho do paciente</h3>
        <p className="mt-3 text-sm text-slate-600">
          Ferida central ligada à invalidação afetiva. Medo principal de ser
          rejeitado ao se expressar autenticamente.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">Padrões emocionais</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <p>• Culpa após felicidade</p>
          <p>• Vergonha diante de exposição</p>
          <p>• Medo de invalidação</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">Medicações</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <p>Sertralina 50mg — manhã</p>
          <p>Clonazepam 0,5mg — se necessário</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-slate-900">Relações importantes</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Mãe", "Pai", "Marido", "Filha", "Chefe"].map((person) => (
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

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <PatientHeader />

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            <Timeline timelineData={timeline} />
            <RightPanel />
          </div>
        </main>
      </div>
    </div>
  )
}