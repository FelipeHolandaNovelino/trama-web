/**
 * Estado vazio compacto da timeline clínica.
 *
 * Aparece quando o paciente ainda não possui sessões, blocos ou eventos.
 * A intenção é orientar sem ocupar espaço demais antes da área principal.
 */
export function TimelineEmptyState({ onCreateSession }) {
  return (
    <section className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 px-5 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-black text-violet-700 shadow-sm">
            ✦
          </div>

          <div>
            <h3 className="text-base font-black tracking-tight text-slate-950">
              Nenhuma sessão registrada
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
              Comece criando a primeira sessão para construir a timeline clínica
              deste paciente.
            </p>

            <p className="mt-2 text-xs font-medium text-slate-400">
              Sessões, blocos, emoções e conexões ficarão salvos apenas neste
              prontuário.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreateSession}
          className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-violet-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900"
        >
          + Criar primeira sessão
        </button>
      </div>
    </section>
  )
}