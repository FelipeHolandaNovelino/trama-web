import { useEffect, useMemo, useState } from "react"

import { TimelineBlockModal } from "./TimelineBlockModal"
import { SessionModal } from "./SessionModal"
import { MirrorTimeline } from "./MirrorTimeline"
import { SessionsCalendar } from "./SessionsCalendar"
import { GroupedBlocksView } from "./GroupedBlocksView"
import { TimelineEmptyState } from "./TimelineEmptyState"
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
    description: "Histórico clínico por ano, mês, sessões e blocos",
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
    description: "Acontecimentos pela data real na vida do paciente",
  },
]

/**
 * Controla as quatro visualizações principais da timeline clínica.
 *
 * A responsabilidade deste componente é distribuir os dados para calendário,
 * agrupamentos e espelho, além de controlar os modais de sessão e bloco.
 */
export function Timeline({
  timelineData,
  onCreateSession,
  onDeleteBlock,
  onEditBlock,
  onAddBlockToSession,
  onUpdateSession,
  onDeleteSession,
}) {
  /**
   * Lista de anos disponíveis na timeline atual.
   * Pacientes sem sessões podem começar sem nenhum ano disponível.
   */
  const years = useMemo(() => getAvailableYears(timelineData), [timelineData])

  const [selectedBlock, setSelectedBlock] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedMode, setSelectedMode] = useState("chronological")
  const [selectedYear, setSelectedYear] = useState(years[0] || "")
  const [selectedMonth, setSelectedMonth] = useState("JAN")
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false)

  const currentMode = timelineModes.find((mode) => mode.id === selectedMode)

  /**
   * Quando a timeline começa vazia e a primeira sessão é criada,
   * o ano selecionado precisa acompanhar o novo dado disponível.
   */
  useEffect(() => {
    if (years.length === 0) {
      setSelectedYear("")
      setSelectedMonth("JAN")
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
   * Lista única de blocos usada pelas visões clínicas.
   */
  const allBlocks = useMemo(() => {
    return getAllBlocks(timelineData)
  }, [timelineData])

  const hasTimelineContent = allBlocks.length > 0

  /**
   * Índice usado para abrir blocos conectados dentro dos modais.
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
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-black tracking-tight text-slate-950">
              Timeline clínica
            </h3>

            <span className="hidden text-slate-300 sm:inline">·</span>

            <p className="text-sm text-slate-500">
              {currentMode?.description}
            </p>
          </div>
        </div>

        <div className="flex w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60 p-1 lg:w-auto">
          {timelineModes.map((mode) => {
            const isActive = selectedMode === mode.id

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode.id)}
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition lg:flex-none ${
                  isActive
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
                }`}
              >
                {mode.label}
              </button>
            )
          })}
        </div>
      </header>

      <div className="mt-4">
        {!hasTimelineContent ? (
          <TimelineEmptyState onCreateSession={onCreateSession} />
        ) : (
          <>
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
          </>
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