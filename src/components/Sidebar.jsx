const menuItems = [
  {
    label: "Home",
    icon: "⌂",
  },
  {
    label: "Pacientes",
    icon: "○",
  },
]

/**
 * Navegação lateral principal do Trama.
 *
 * Nesta fase, o menu foi reduzido para manter o fluxo mais claro:
 * - Home: tela inicial do profissional;
 * - Pacientes: listagem e acesso aos prontuários.
 *
 * A timeline continua existindo, mas é acessada ao abrir um paciente.
 */
export function Sidebar({ activePage, onChangePage }) {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm xl:flex">
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-800 text-lg font-black text-white">
            ⧉
          </div>

          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-950">
              Trama
            </h1>

            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Prontuário clínico inteligente
            </p>
          </div>
        </div>
      </header>

      <nav className="mt-8 grid gap-2">
        {menuItems.map((item) => {
          const isActive = activePage === item.label

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onChangePage(item.label)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? "bg-violet-50 text-violet-800"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm ${
                  isActive
                    ? "bg-white text-violet-800 shadow-sm"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                {item.icon}
              </span>

              {item.label}
            </button>
          )
        })}
      </nav>

      <footer className="mt-auto rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-sm font-black text-violet-800">
            CN
          </div>

          <div>
            <p className="text-sm font-black text-slate-900">
              Dra. Camila Nogueira
            </p>

            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Psicóloga · CRP 06/123456
            </p>
          </div>
        </div>
      </footer>
    </aside>
  )
}