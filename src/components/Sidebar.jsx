export function Sidebar() {
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