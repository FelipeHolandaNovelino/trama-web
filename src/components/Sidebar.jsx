const menuItems = [
  {
    label: "Pacientes",
    icon: "👤",
    isActive: false,
  },
  {
    label: "Sessões",
    icon: "📋",
    isActive: false,
  },
  {
    label: "Timeline",
    icon: "☷",
    isActive: true,
  },
  {
    label: "Conexões",
    icon: "⌘",
    isActive: false,
  },
  {
    label: "Tags",
    icon: "◇",
    isActive: false,
  },
  {
    label: "Relatórios",
    icon: "▣",
    isActive: false,
  },
  {
    label: "Configurações",
    icon: "⚙",
    isActive: false,
  },
]

export function Sidebar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-6 px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-2xl text-violet-700">
            ⧉
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-violet-950">
              Trama
            </h1>

            <p className="text-xs text-slate-500">
              Prontuário clínico inteligente
            </p>
          </div>
        </div>

        <nav className="flex flex-1 items-center justify-center gap-2 overflow-x-auto">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                item.isActive
                  ? "bg-violet-100 text-violet-800"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-semibold text-slate-900">
              Dra. Camila Nogueira
            </p>

            <p className="text-xs text-slate-500">
              Psicóloga · CRP 06/123456
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
            CN
          </div>
        </div>
      </div>
    </header>
  )
}