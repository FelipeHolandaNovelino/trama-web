export function TimelineBlockModal({ block, onClose }) {
  if (!block) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-violet-700">
              Bloco relacionado
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {block.title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {block.type} • {block.date}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            Fechar
          </button>
        </div>

        <p className="mt-5 text-slate-700">{block.text}</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">Emoções</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {block.emotions.map((emotion) => (
                <span
                  key={emotion}
                  className="rounded-full bg-white px-3 py-1 text-xs text-slate-700"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">
              Pessoas relacionadas
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {block.people.map((person) => (
                <span
                  key={person}
                  className="rounded-full bg-white px-3 py-1 text-xs text-slate-700"
                >
                  {person}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">
              Tags clínicas
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {block.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-3 py-1 text-xs text-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">
              Intensidade emocional
            </p>

            <p className="mt-2 text-2xl font-bold text-violet-800">
              {block.intensity}/10
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}