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
    description: "Blocos filtrados e agrupados pelas emoções recorrentes",
  },
  {
    id: "relational",
    label: "Relações",
    description: "Blocos filtrados e agrupados pelos relacionamentos do paciente",
  },
  {
    id: "mirror",
    label: "Espelho",
    description: "Acontecimentos pela data real na vida do paciente",
  },
]

/**
 * Extrai o nome de um grupo de forma segura.
 *
 * Mantém compatibilidade caso groupBlocksByArrayField retorne grupos
 * em formatos diferentes.
 */
function getGroupLabel(group) {
  if (!group) return ""

  if (typeof group === "string") return group

  return group.label || group.name || group.title || group.key || group.group || ""
}

/**
 * Retorna as opções disponíveis dentro de um agrupamento.
 *
 * Funciona com dois formatos possíveis:
 * - objeto: { Ansiedade: [...], Culpa: [...] }
 * - array: [{ label: "Ansiedade", blocks: [...] }]
 */
function getGroupOptions(groupedBlocks) {
  if (!groupedBlocks) return []

  if (Array.isArray(groupedBlocks)) {
    return groupedBlocks
      .map((group) => getGroupLabel(group))
      .filter(Boolean)
      .sort((firstOption, secondOption) =>
        firstOption.localeCompare(secondOption, "pt-BR")
      )
  }

  return Object.keys(groupedBlocks).sort((firstOption, secondOption) =>
    firstOption.localeCompare(secondOption, "pt-BR")
  )
}

/**
 * Filtra um agrupamento mantendo o mesmo formato recebido.
 *
 * Isso evita alterar o contrato com GroupedBlocksView.
 */
function filterGroupedBlocksByLabel(groupedBlocks, selectedLabel) {
  if (!selectedLabel) {
    return groupedBlocks
  }

  if (Array.isArray(groupedBlocks)) {
    return groupedBlocks.filter((group) => getGroupLabel(group) === selectedLabel)
  }

  if (groupedBlocks && groupedBlocks[selectedLabel]) {
    return {
      [selectedLabel]: groupedBlocks[selectedLabel],
    }
  }

  return Array.isArray(groupedBlocks) ? [] : {}
}

/**
 * Filtro compacto para visões agrupadas da timeline.
 *
 * Usado nos modos Emoções e Relações.
 */
function TimelineGroupFilter({
  title,
  description,
  allLabel,
  options,
  selectedOption,
  selectedLabelPrefix,
  onSelectOption,
}) {
  if (options.length === 0) {
    return null
  }

  return (
    <section className="mb-4 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black text-slate-900">{title}</p>

          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>

        <select
          value={selectedOption}
          onChange={(event) => onSelectOption(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 lg:w-72"
        >
          <option value="">{allLabel}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {selectedOption && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
            {selectedLabelPrefix}: {selectedOption}
          </span>

          <button
            type="button"
            onClick={() => onSelectOption("")}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            Limpar filtro
          </button>
        </div>
      )}
    </section>
  )
}

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
  const [selectedEmotion, setSelectedEmotion] = useState("")
  const [selectedRelationship, setSelectedRelationship] = useState("")
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
   * Limpa filtros específicos ao trocar de modo.
   *
   * Isso evita que o usuário volte a uma visualização com filtro antigo
   * sem perceber.
   */
  useEffect(() => {
    if (selectedMode !== "emotional") {
      setSelectedEmotion("")
    }

    if (selectedMode !== "relational") {
      setSelectedRelationship("")
    }
  }, [selectedMode])

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

  /**
   * Opções do filtro de emoções.
   *
   * Elas vêm das emoções já usadas nos blocos da timeline.
   */
  const emotionOptions = useMemo(() => {
    return getGroupOptions(emotionalGroups)
  }, [emotionalGroups])

  /**
   * Opções do filtro de relacionamento.
   *
   * Elas vêm dos relacionamentos já usados em blocos da timeline.
   */
  const relationshipOptions = useMemo(() => {
    return getGroupOptions(relationalGroups)
  }, [relationalGroups])

  const filteredEmotionalGroups = useMemo(() => {
    return filterGroupedBlocksByLabel(emotionalGroups, selectedEmotion)
  }, [emotionalGroups, selectedEmotion])

  const filteredRelationalGroups = useMemo(() => {
    return filterGroupedBlocksByLabel(relationalGroups, selectedRelationship)
  }, [relationalGroups, selectedRelationship])

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
              <>
                <TimelineGroupFilter
                  title="Filtrar por emoção"
                  description="Visualize apenas os blocos associados a uma emoção específica."
                  allLabel="Todas as emoções"
                  options={emotionOptions}
                  selectedOption={selectedEmotion}
                  selectedLabelPrefix="Exibindo"
                  onSelectOption={setSelectedEmotion}
                />

                <GroupedBlocksView
                  groupedBlocks={filteredEmotionalGroups}
                  emptyTitle={
                    selectedEmotion
                      ? `Nenhum bloco relacionado a ${selectedEmotion}`
                      : "Nenhuma emoção registrada"
                  }
                  emptyDescription={
                    selectedEmotion
                      ? "Esta emoção ainda não possui blocos registrados na timeline."
                      : "As emoções aparecerão aqui quando houver blocos na timeline deste paciente."
                  }
                  onOpenConnectedBlock={handleOpenConnectedBlock}
                  onDeleteBlock={onDeleteBlock}
                  onEditBlock={onEditBlock}
                />
              </>
            )}

            {selectedMode === "relational" && (
              <>
                <TimelineGroupFilter
                  title="Filtrar por relacionamento"
                  description="Visualize apenas os blocos associados a uma relação específica."
                  allLabel="Todos os relacionamentos"
                  options={relationshipOptions}
                  selectedOption={selectedRelationship}
                  selectedLabelPrefix="Exibindo"
                  onSelectOption={setSelectedRelationship}
                />

                <GroupedBlocksView
                  groupedBlocks={filteredRelationalGroups}
                  emptyTitle={
                    selectedRelationship
                      ? `Nenhum bloco relacionado a ${selectedRelationship}`
                      : "Nenhuma relação registrada"
                  }
                  emptyDescription={
                    selectedRelationship
                      ? "Este relacionamento ainda não possui blocos registrados na timeline."
                      : "As pessoas importantes aparecerão aqui quando houver blocos relacionados na timeline deste paciente."
                  }
                  onOpenConnectedBlock={handleOpenConnectedBlock}
                  onDeleteBlock={onDeleteBlock}
                  onEditBlock={onEditBlock}
                />
              </>
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