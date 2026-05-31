/**
 * Opções de status disponíveis para filtrar a lista de pacientes.
 * Mantemos esse array perto do componente porque ele pertence à interface de filtro.
 */
const STATUS_OPTIONS = [
  "Todos",
  "Triagem inicial",
  "Em acompanhamento",
  "Encerrado",
]

/**
 * Componente responsável pelos controles de busca e filtro da lista de pacientes.
 *
 * Ele não filtra os dados diretamente.
 * A página pai controla o estado e passa os valores prontos por props.
 */
export function PatientsFilters({
  searchTerm,
  statusFilter,
  totalPatients,
  filteredPatientsCount,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}) {
  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_240px_auto] lg:items-end">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">
            Buscar paciente
          </span>

          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Busque por nome, queixa, tag, relação, e-mail ou telefone"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Status</span>

          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Limpar filtros
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span>
          Exibindo{" "}
          <strong className="font-semibold text-slate-800">
            {filteredPatientsCount}
          </strong>{" "}
          de{" "}
          <strong className="font-semibold text-slate-800">
            {totalPatients}
          </strong>{" "}
          pacientes.
        </span>

        {hasActiveFilters && (
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            Filtros ativos
          </span>
        )}
      </div>
    </section>
  )
}