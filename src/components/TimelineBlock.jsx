import { useState } from "react"

export function TimelineBlock({
  block,
  onOpenConnectedBlock,
  onDeleteBlock,
  onEditBlock,
}) {
  const [isOpen, setIsOpen] = useState(false)

  const colorByType = {
    "Marco positivo": "border-emerald-200 bg-emerald-50",
    "Evento traumático": "border-rose-200 bg-rose-50",
    Insight: "border-amber-200 bg-amber-50",
    Evento: "border-blue-200 bg-blue-50",
    "Observação clínica": "border-slate-200 bg-slate-50",
  }

  const connectionColorByStrength = {
    leve: "bg-slate-100 text-slate-700",
    moderada: "bg-violet-100 text-violet-800",
    forte: "bg-rose-100 text-rose-800",
  }

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`w-full cursor-pointer rounded-xl border p-3 text-left transition hover:shadow-md ${
        colorByType[block.type] || "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-semibold text-slate-500">
              {block.type}
            </p>

            <span className="text-[11px] text-slate-400">•</span>

            <p className="text-[11px] text-slate-500">{block.date}</p>
          </div>

          <h4 className="mt-1 text-sm font-semibold leading-snug text-slate-900">
            {block.title}
          </h4>
        </div>

        <span className="shrink-0 rounded-full bg-white/70 px-2 py-1 text-[11px] text-slate-700">
          {block.intensity}/10
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {block.emotions.slice(0, 3).map((emotion) => (
          <span
            key={emotion}
            className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-slate-700"
          >
            {emotion}
          </span>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={(event) => {
            event.stopPropagation()
            onEditBlock(block)
          }}
          className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100"
        >
          Editar
        </button>

        <button
          onClick={(event) => {
            event.stopPropagation()
            onDeleteBlock(block.id)
          }}
          className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-100"
        >
          Excluir
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4 border-t border-white/70 pt-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Bloco narrativo
            </p>
            <p className="mt-2 text-sm text-slate-600">{block.text}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500">
              Pessoas relacionadas
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {block.people.map((person) => (
                <span
                  key={person}
                  className="rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700"
                >
                  {person}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500">Tags clínicas</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {block.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {block.connections && block.connections.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Conexões emocionais
              </p>

              <div className="mt-2 space-y-2">
                {block.connections.map((connection) => (
                  <button
                    key={connection.targetBlockId}
                    onClick={(event) => {
                      event.stopPropagation()
                      onOpenConnectedBlock(connection.targetBlockId)
                    }}
                    className="w-full rounded-2xl bg-white/80 p-3 text-left text-xs text-slate-700 transition hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">
                        {connection.targetTitle}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 ${
                          connectionColorByStrength[connection.strength]
                        }`}
                      >
                        ligação {connection.strength}
                      </span>
                    </div>

                    <p className="mt-2 text-slate-600">{connection.reason}</p>
                    <p className="mt-2 font-medium text-violet-700">
                      Clique para abrir o bloco relacionado
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500">
            Clique novamente para recolher o bloco.
          </p>
        </div>
      )}
    </div>
  )
}