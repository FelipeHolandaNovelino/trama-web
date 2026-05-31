import { useEffect, useMemo, useState } from "react"

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
  /**
   * Lista de anos disponíveis na timeline atual.
   * Como a timeline agora pode começar vazia, esse valor precisa reagir a novas sessões.
   */
  const years = useMemo(() => getAvailableYears(timelineData), [timelineData])

  const [selectedBlock, setSelectedBlock] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedMode, setSelectedMode] = useState("chronological")
  const [selectedYear, setSelectedYear] = useState(years[0] || "")
  const [selectedMonth, setSelectedMonth] = useState("MAR")
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false)

  const currentMode = timelineModes.find((mode) => mode.id === selectedMode)

  /**
   * Quando a timeline começa vazia e a primeira sessão é criada,
   * o ano selecionado precisa ser atualizado para o novo ano disponível.
   */
  useEffect(() => {
    if (years.length === 0) {
      setSelectedYear("")
      return
    }

    if (selectedYear && years.includes(selectedYear)) {
      return
    }

    const firstAvailableYear = years[0]
    const firstYearGroup = timelineData.find(
      (yearGroup) => yearGroup.year === firstAvailableYear
    )

    setSelectedYear(firstAvailableYear)
    setSelectedMonth(firstYearGroup?.months?.[0]?.month || "JAN")
  }, [selectedYear, timelineData, years])

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
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-950">
            Sessões do paciente
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {currentMode?.description}
          </p>
        </div>

        <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {timelineModes.map((mode) => {
            const isActive = selectedMode === mode.id

            return (
              <button
                key={mode.id}
                type="button"
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
      </header>

      <div className="mt-5">
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
            emptyDescription="As emoções aparecerão aqui quando houver blocos na timeline deste paciente."
            onOpenConnectedBlock={handleOpenConnectedBlock}
            onDeleteBlock={onDeleteBlock}
            onEditBlock={onEditBlock}
          />
        )}

        {selectedMode === "relational" && (
          <GroupedBlocksView
            groupedBlocks={relationalGroups}
            emptyTitle="Nenhuma relação registrada"
            emptyDescription="As pessoas importantes aparecerão aqui quando houver blocos na timeline deste paciente."
            onOpenConnectedBlock={handleOpenConnectedBlock}
            onDeleteBlock={onDeleteBlock}
            onEditBlock={onEditBlock}
          />
        )}

        {selectedMode === "mirror" && (
          <MirrorTimeline blocks={allBlocks} onOpenBlock={handleOpenBlock} />
        )}
      </div>

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