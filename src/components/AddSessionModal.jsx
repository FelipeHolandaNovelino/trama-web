export function AddSessionModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-violet-700">
              Nova sessão
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Registrar sessão do paciente
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Crie blocos narrativos que poderão alimentar a timeline, os padrões
              emocionais e as relações importantes.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            Fechar
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Data da sessão
            </span>
            <input
              type="date"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Tipo do bloco
            </span>
            <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400">
              <option>Evento</option>
              <option>Insight</option>
              <option>Marco positivo</option>
              <option>Evento traumático</option>
              <option>Observação clínica</option>
            </select>
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Bloco narrativo
          </span>
          <textarea
            rows="5"
            placeholder="Escreva o que surgiu na sessão..."
            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
          />
        </label>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Emoções</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["vergonha", "medo", "culpa", "alívio", "raiva", "tristeza"].map(
                (emotion) => (
                  <button
                    key={emotion}
                    className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 hover:bg-violet-100 hover:text-violet-800"
                  >
                    {emotion}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              Pessoas relacionadas
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Mãe", "Pai", "Marido", "Filha", "Chefe"].map((person) => (
                <button
                  key={person}
                  className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 hover:bg-violet-100 hover:text-violet-800"
                >
                  {person}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Intensidade emocional
          </span>
          <input type="range" min="1" max="10" className="w-full" />
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm text-slate-700"
          >
            Cancelar
          </button>

          <button className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-medium text-white">
            Salvar bloco
          </button>
        </div>
      </div>
    </div>
  )
}