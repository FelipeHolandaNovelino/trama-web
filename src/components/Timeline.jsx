import { useMemo, useState } from "react"
import { TimelineBlockModal } from "./TimelineBlockModal"
import { SessionModal } from "./SessionModal"
import { MirrorTimeline } from "./MirrorTimeline"
import { SessionsCalendar } from "./SessionsCalendar"
import { GroupedBlocksView } from "./GroupedBlocksView"

import {
  getAllBlocks,
  getAvailableYears,
  getBlocksById,
  groupBlocksByArrayField,
} from "../utils/timelineUtils"

const timelineModes = [
  {
    id: "chronological",
    label: "Sessões",
    description: "Histórico clínico organizado por ano, mês, sessões e blocos",
  },
  {
    id: "emotional",
    label: "Emoções",
    description: "Blocos agrupados pelas emoções recorrentes",
  },
  {
    id: "relational",
    label: "Relações",
    description: "Blocos agrupados pelas pessoas importantes",
  },
  {
    id: "mirror",
    label: "Espelho",
    description:
      "Acontecimentos organizados pela data em que ocorreram na vida do paciente",
  },
]

export function Timeline({
  timelineData,
  onDeleteBlock,
  onEditBlock,
  onAddBlockToSession,
  onUpdateSession,
  onDeleteSession,
}) {
  const years = getAvailableYears(timelineData)

  const [selectedBlock, setSelectedBlock] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedMode, setSelectedMode] = useState("chronological")
  const [selectedYear, setSelectedYear] = useState(years[0] || "")
  const [selectedMonth, setSelectedMonth] = useState("MAR")
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false)

  const currentMode = timelineModes.find((mode) => mode.id === selectedMode)

  /**
   * Lista única de blocos usada por todas as visões clínicas.
   */
  const allBlocks = useMemo(() => {
    return getAllBlocks(timelineData)
  }, [timelineData])

  /**
   * Índice usado para abrir blocos conectados dentro do modal.
   */
  const blocksById = useMemo(() => {
    return getBlocksById(allBlocks)
  }, [allBlocks])

  const emotionalGroups = useMemo(() => {
    return groupBlocksByArrayField(allBlocks, "emotions")
  }, [allBlocks])

  const relationalGroups = useMemo(() => {
    return groupBlocksByArrayField(allBlocks, "people")
  }, [allBlocks])

  function handleSelectYear(year) {
    setSelectedYear(year)
    setSelectedMonth("JAN")
    setIsYearMenuOpen(false)
  }

  function handleToggleYearMenu() {
    setIsYearMenuOpen((isOpen) => !isOpen)
  }

  function handleOpenConnectedBlock(blockId) {
    const connectedBlock = blocksById[blockId]

    if (!connectedBlock) return

    setSelectedBlock(connectedBlock)
  }

  function handleOpenBlock(block) {
    setSelectedBlock(block)
  }

  function handleOpenSession(session) {
    setSelectedSession(session)
  }

  function handleAddBlockToSession(session) {
    setSelectedSession(null)
    onAddBlockToSession(session)
  }

  function handleUpdateSession(sessionId, updatedSessionData) {
    onUpdateSession(sessionId, updatedSessionData)

    setSelectedSession((currentSession) => {
      if (!currentSession || currentSession.id !== sessionId) {
        return currentSession
      }

      return {
        ...currentSession,
        title: updatedSessionData.title,
        summary: updatedSessionData.summary,
      }
    })
  }

  function handleDeleteSession(sessionId) {
    onDeleteSession(sessionId)
    setSelectedSession(null)
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
            Sessões do paciente
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {currentMode.description}
          </p>
        </div>

        <div className="flex overflow-x-auto rounded-xl border border-slate-200 bg-white">
          {timelineModes.map((mode) => {
            const isActive = selectedMode === mode.id

            return (
              <button
                type="button"
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`shrink-0 px-4 py-2.5 text-sm transition sm:px-5 ${
                  isActive
                    ? "bg-violet-700 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {mode.label}
              </button>
            )
          })}
        </div>
      </div>

      {selectedMode === "chronological" && (
        <SessionsCalendar
          timelineData={timelineData}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          isYearMenuOpen={isYearMenuOpen}
          onSelectYear={handleSelectYear}
          onSelectMonth={setSelectedMonth}
          onToggleYearMenu={handleToggleYearMenu}
          onOpenSession={handleOpenSession}
          onOpenBlock={handleOpenBlock}
        />
      )}

      {selectedMode === "emotional" && (
        <GroupedBlocksView
          groupedBlocks={emotionalGroups}
          emptyTitle="Nenhuma emoção registrada"
          emptyDescription="Os blocos aparecerão agrupados aqui quando tiverem emoções associadas."
          onOpenConnectedBlock={handleOpenConnectedBlock}
          onDeleteBlock={onDeleteBlock}
          onEditBlock={onEditBlock}
        />
      )}

      {selectedMode === "relational" && (
        <GroupedBlocksView
          groupedBlocks={relationalGroups}
          emptyTitle="Nenhuma relação registrada"
          emptyDescription="Os blocos aparecerão agrupados aqui quando tiverem pessoas relacionadas."
          onOpenConnectedBlock={handleOpenConnectedBlock}
          onDeleteBlock={onDeleteBlock}
          onEditBlock={onEditBlock}
        />
      )}

      {selectedMode === "mirror" && (
        <MirrorTimeline blocks={allBlocks} onOpenBlock={handleOpenBlock} />
      )}

      <SessionModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        onOpenBlock={handleOpenBlock}
        onEditBlock={onEditBlock}
        onDeleteBlock={onDeleteBlock}
        onAddBlockToSession={handleAddBlockToSession}
        onUpdateSession={handleUpdateSession}
        onDeleteSession={handleDeleteSession}
      />

      <TimelineBlockModal
        block={selectedBlock}
        onClose={() => setSelectedBlock(null)}
        onOpenConnectedBlock={handleOpenConnectedBlock}
      />
    </section>
  )
}