/**
 * Estado vazio da timeline clínica.
 *
 * Este componente aparece quando o paciente ainda não possui sessões,
 * blocos ou eventos registrados. Ele orienta o usuário e oferece uma ação
 * direta para iniciar o prontuário.
 */
export function TimelineEmptyState({ onCreateSession }) {
  return (
    <section className="rounded-3xl border border-dashed border-violet-200 bg-violet-50/60 p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">
        ✦
      </div>

      <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
        Este paciente ainda não possui sessões
      </h3>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
        Comece registrando a primeira sessão clínica para construir a linha do
        tempo emocional do paciente. A partir dela, o Trama poderá organizar
        acontecimentos, emoções, relações, padrões e conexões.
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCreateSession}
          className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900"
        >
          + Criar primeira sessão
        </button>

        <span className="text-xs text-slate-500">
          Sessões criadas aqui ficam salvas apenas neste paciente.
        </span>
      </div>
    </section>
  )
}