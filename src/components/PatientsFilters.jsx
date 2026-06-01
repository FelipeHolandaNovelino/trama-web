const STATUS_OPTIONS = [
  { value: "Todos", label: "Todos os status" },
  { value: "Triagem inicial", label: "Triagem inicial" },
  { value: "Em acompanhamento", label: "Em acompanhamento" },
  { value: "Encerrado", label: "Encerrado" },
]

function SearchIcon() {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function FilterIcon() {
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
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="9" cy="6" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="11" cy="18" r="2" />
    </svg>
  )
}

/**
 * Filtros compactos da página de pacientes.
 *
 * O componente fica discreto no topo e não exibe estatísticas.
 */
export function PatientsFilters({
  searchTerm,
  statusFilter,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[360px_220px_52px] md:items-center">
        <label className="relative block">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar paciente..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <label className="block">
          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          >
            {STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          title="Limpar filtros"
          aria-label="Limpar filtros"
          className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 md:w-12"
        >
          <FilterIcon />
        </button>
      </div>
    </section>
  )
}