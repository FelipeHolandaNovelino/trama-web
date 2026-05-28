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
    description: "Eventos agrupados pelas emoções recorrentes",
  },
  {
    id: "relational",
    label: "Relacional",
    description: "Eventos agrupados pelas pessoas importantes",
  },
]

function groupBlocksByArrayField(blocks, fieldName) {
  return blocks.reduce((groups, block) => {
    const values = block[fieldName] || []

    values.forEach((value) => {
      if (!groups[value]) {
        groups[value] = []
      }

      groups[value].push(block)
    })

    return groups
  }, {})
}

function GroupedTimelineView({
  groupedBlocks,
  onOpenConnectedBlock,
  onDeleteBlock,
}) {
  const groups = Object.entries(groupedBlocks).sort(([firstName], [secondName]) =>
    firstName.localeCompare(secondName)
  )

  return (
    <div className="mt-8 space-y-6">
      {groups.map(([groupName, blocks]) => (
        <div
          key={groupName}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-violet-800">
                {groupName}
              </h3>
              <p className="text-sm text-slate-500">
                {blocks.length} bloco{blocks.length > 1 ? "s" : ""} conectado
                {blocks.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {blocks.map((block) => (
              <TimelineBlock
                key={`${groupName}-${block.id}`}
                block={block}
                onOpenConnectedBlock={onOpenConnectedBlock}
                onDeleteBlock={onDeleteBlock}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ChronologicalTimelineView({
  timelineData,
  onOpenConnectedBlock,
  onDeleteBlock,
}) {
  return (
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
                      onOpenConnectedBlock={onOpenConnectedBlock}
                      onDeleteBlock={onDeleteBlock}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function Timeline({ timelineData, onDeleteBlock }) {
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [selectedMode, setSelectedMode] = useState("chronological")

  const currentMode = timelineModes.find((mode) => mode.id === selectedMode)

  const allBlocks = useMemo(() => {
    return timelineData.flatMap((yearGroup) =>
      yearGroup.months.flatMap((monthGroup) => monthGroup.blocks)
    )
  }, [timelineData])

  const blocksById = useMemo(() => {
    return allBlocks.reduce((accumulator, block) => {
      accumulator[block.id] = block
      return accumulator
    }, {})
  }, [allBlocks])

  const emotionalGroups = useMemo(() => {
    return groupBlocksByArrayField(allBlocks, "emotions")
  }, [allBlocks])

  const relationalGroups = useMemo(() => {
    return groupBlocksByArrayField(allBlocks, "people")
  }, [allBlocks])

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

      {selectedMode === "chronological" && (
        <ChronologicalTimelineView
          timelineData={timelineData}
          onOpenConnectedBlock={handleOpenConnectedBlock}
          onDeleteBlock={onDeleteBlock}
        />
      )}

      {selectedMode === "emotional" && (
        <GroupedTimelineView
          groupedBlocks={emotionalGroups}
          onOpenConnectedBlock={handleOpenConnectedBlock}
          onDeleteBlock={onDeleteBlock}
        />
      )}

      {selectedMode === "relational" && (
        <GroupedTimelineView
          groupedBlocks={relationalGroups}
          onOpenConnectedBlock={handleOpenConnectedBlock}
          onDeleteBlock={onDeleteBlock}
        />
      )}

      <TimelineBlockModal
        block={selectedBlock}
        onClose={() => setSelectedBlock(null)}
      />
    </section>
  )
}