/**
 * Cards de estatísticas da listagem de pacientes.
 *
 * Este componente é apenas visual: ele recebe números prontos por props
 * e não conhece a origem dos dados.
 */
export function PatientsStats({ stats }) {
  const statCards = [
    {
      label: "Total de pacientes",
      value: stats.total,
    },
    {
      label: "Em acompanhamento",
      value: stats.active,
    },
    {
      label: "Triagem inicial",
      value: stats.screening,
    },
  ]

  return (
    <section className="mt-6 grid gap-4 md:grid-cols-3">
      {statCards.map((stat) => (
        <article
          key={stat.label}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">{stat.label}</p>

          <strong className="mt-2 block text-3xl font-black text-slate-950">
            {stat.value}
          </strong>
        </article>
      ))}
    </section>
  )
}