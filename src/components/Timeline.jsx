import { useMemo, useState } from "react"
import { TimelineBlockModal } from "./TimelineBlockModal"
import { TimelineBlock } from "./TimelineBlock"

const timelineModes = [
  {
    id: "chronological",
    label: "Cronológica",
    description: "História emocional organizada por anos e meses",
  },
  {
    id: "emotional",
    label: "Emocional",
    description: "Visualização dos eventos a partir das emoções recorrentes",
  },
  {
    id: "relational",
    label: "Relacional",
    description: "Visualização dos eventos a partir das pessoas importantes",
  },
]

export function Timeline({ timelineData }) {
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [selectedMode, setSelectedMode] = useState("chronological")

  const currentMode = timelineModes.find((mode) => mode.id === selectedMode)

  const blocksById = useMemo(() => {
    const allBlocks = timelineData.flatMap((yearGroup) =>
      yearGroup.months.flatMap((monthGroup) => monthGroup.blocks)
    )

    return allBlocks.reduce((accumulator, block) => {
      accumulator[block.id] = block
      return accumulator
    }, {})
  }, [timelineData])

  function handleOpenConnectedBlock(blockId) {
    setSelectedBlock(blocksById[blockId])
  }

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Linha do tempo</h3>
          <p className="text-sm text-slate-500">{currentMode.description}</p>
        </div>

        <div className="flex gap-2">
          {timelineModes.map((mode) => {
            const isActive = selectedMode === mode.id

            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-violet-100 text-violet-800"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {mode.label}
              </button>
            )
          })}
        </div>
      </div>

      {selectedMode !== "chronological" && (
        <div className="mt-6 rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-4 text-sm text-violet-800">
          Modo <strong>{currentMode.label}</strong> selecionado. Nesta fase do
          MVP, a visualização ainda usa a mesma timeline cronológica, mas esse
          botão já prepara a interface para futuras leituras emocionais e
          relacionais.
        </div>
      )}

      <div className="mt-8 space-y-10">
        {timelineData.map((yearGroup) => (
          <div key={yearGroup.year}>
            <h3 className="text-2xl font-bold text-violet-800">
              {yearGroup.year}
            </h3>

            <div className="mt-4 space-y-4 border-l-2 border-violet-100 pl-6">
              {yearGroup.months.map((monthGroup) => (
                <div
                  key={monthGroup.month}
                  className="grid grid-cols-[70px_1fr] gap-4"
                >
                  <div className="pt-4 text-sm font-semibold text-slate-500">
                    {monthGroup.month}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {monthGroup.blocks.map((block) => (
                      <TimelineBlock
                        key={block.id}
                        block={block}
                        onOpenConnectedBlock={handleOpenConnectedBlock}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TimelineBlockModal
        block={selectedBlock}
        onClose={() => setSelectedBlock(null)}
      />
    </section>
  )
}