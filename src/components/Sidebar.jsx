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
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-xl text-violet-700 sm:h-11 sm:w-11 sm:text-2xl">
              ⧉
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-violet-950 sm:text-xl">
                Trama
              </h1>

              <p className="text-[11px] text-slate-500 sm:text-xs">
                Prontuário clínico inteligente
              </p>
            </div>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 lg:hidden">
            CN
          </div>
        </div>

        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-1 lg:justify-center lg:pb-0">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium transition sm:px-4 sm:py-2.5 sm:text-sm ${
                item.isActive
                  ? "bg-violet-100 text-violet-800"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="text-sm sm:text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="text-right">
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