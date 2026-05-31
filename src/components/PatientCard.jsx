/**
 * Gera as iniciais do nome do paciente para uso no avatar textual.
 * Essa solução evita depender de imagens enquanto o cadastro real não existe.
 */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Card visual de um paciente na listagem.
 *
 * Este componente não altera dados diretamente.
 * Ele apenas exibe as informações e dispara ações recebidas por props.
 */
export function PatientCard({ patient, onEdit, onDelete, onOpen }) {
  return (
    <article className="flex min-h-[400px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-sm font-black text-violet-800">
              {getInitials(patient.name)}
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-950">
                {patient.name}
              </h3>

              <p className="text-sm text-slate-500">
                {patient.age ? `${patient.age} anos` : "Idade não informada"}
              </p>
            </div>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {patient.status}
          </span>
        </div>

        {patient.mainComplaint && (
          <p className="mt-5 text-sm font-medium text-slate-700">
            {patient.mainComplaint}
          </p>
        )}

        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          {patient.description || "Paciente sem descrição clínica inicial."}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(patient.tags || []).slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Última sessão</span>

            <strong className="font-semibold text-slate-800">
              {patient.lastSession}
            </strong>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Próxima sessão</span>

            <strong className="font-semibold text-slate-800">
              {patient.nextSession}
            </strong>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onEdit(patient)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => onDelete(patient)}
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Excluir
          </button>

          {/*
            A navegação ainda é controlada pelo App.jsx.
            Futuramente, esse clique pode ser substituído por uma rota real.
          */}
          <button
            type="button"
            onClick={() => onOpen(patient)}
            className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
          >
            Abrir
          </button>
        </div>
      </div>
    </article>
  )
}