const STATUS_OPTIONS = [
  { value: "Todos", label: "Todos os status" },
  { value: "Triagem inicial", label: "Triagem inicial" },
  { value: "Em acompanhamento", label: "Em acompanhamento" },
  { value: "Encerrado", label: "Encerrado" },
]

function SearchIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function FilterIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 3H2l8 9.46V19l4 2v-8.54Z" />
    </svg>
  )
}

/**
 * Filtros compactos da página de pacientes.
 *
 * Mantém busca, filtro por status e limpeza dos filtros ativos.
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
    <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px_auto]">
      <label className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <SearchIcon />
        </span>

        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nome, queixa, status ou descrição..."
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        />
      </label>

      <label className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <FilterIcon />
        </span>

        <select
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
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
        className={`h-12 rounded-2xl px-4 text-sm font-semibold transition ${
          hasActiveFilters
            ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
        }`}
      >
        Limpar
      </button>
    </section>
  )
}