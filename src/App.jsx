import { timeline } from "./data/timeline"

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 px-5 py-6">
      <h1 className="text-2xl font-bold text-violet-800">trama</h1>

      <nav className="mt-10 space-y-2 text-sm">
        {["Pacientes", "Sessões", "Timeline", "Conexões", "Tags", "Configurações"].map(
          (item) => (
            <button
              key={item}
              className={`w-full text-left rounded-2xl px-4 py-3 ${
                item === "Timeline"
                  ? "bg-violet-100 text-violet-800 font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          )
        )}
      </nav>
    </aside>
  )
}

function PatientHeader() {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between gap-6">
        <div>
          <p className="text-sm text-slate-500">Paciente</p>
          <h2 className="text-3xl font-bold text-slate-900">João Luiz</h2>

          <div className="mt-2 flex gap-2 text-sm text-slate-500">
            <span>30 anos</span>
            <span>•</span>
            <span>Ansiedade crônica</span>
            <span>•</span>
            <span>Última sessão: 22/05/2025</span>
          </div>

          <p className="mt-4 max-w-2xl text-slate-600">
            Paciente com histórico de invalidação emocional, medo de rejeição e
            tendência ao isolamento. Em processo gradual de individuação.
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
        {["abandono", "vergonha", "autoestima", "validação", "isolamento"].map(
          (tag) => (
            <span
              key={tag}
              className="rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-700"
            >
              {tag}
            </span>
          )
        )}
      </div>
    </section>
  )
}

function TimelineBlock({ block }) {
  const colorByType = {
    "Marco positivo": "border-emerald-200 bg-emerald-50",
    "Evento traumático": "border-rose-200 bg-rose-50",
    Insight: "border-amber-200 bg-amber-50",
    Evento: "border-blue-200 bg-blue-50",
  }

  return (
    <div className={`rounded-2xl border p-4 ${colorByType[block.type] || "bg-white"}`}>
      <p className="text-xs font-semibold text-slate-500">{block.type}</p>
      <h4 className="mt-1 font-semibold text-slate-900">{block.title}</h4>
      <p className="mt-2 text-sm text-slate-600">{block.text}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {block.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white/70 px-2 py-1 text-xs text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function Timeline() {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Linha do tempo</h3>
          <p className="text-sm text-slate-500">
            História emocional organizada por anos e meses
          </p>
        </div>

        <div className="flex gap-2">
          <button className="rounded-xl bg-violet-100 px-3 py-2 text-sm text-violet-800">
            Cronológica
          </button>
          <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
            Emocional
          </button>
          <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
            Relacional
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {timeline.map((yearGroup) => (
          <div key={yearGroup.year}>
            <h3 className="text-2xl font-bold text-violet-800">{yearGroup.year}</h3>

            <div className="mt-4 space-y-4 border-l-2 border-violet-100 pl-6">
              {yearGroup.months.map((monthGroup) => (
                <div key={monthGroup.month} className="grid grid-cols-[70px_1fr] gap-4">
                  <div className="pt-4 text-sm font-semibold text-slate-500">
                    {monthGroup.month}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {monthGroup.blocks.map((block) => (
                      <TimelineBlock key={block.title} block={block} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

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
            <Timeline />
            <RightPanel />
          </div>
        </main>
      </div>
    </div>
  )
}