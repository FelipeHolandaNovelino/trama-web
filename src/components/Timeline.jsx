import { useMemo, useState } from "react"
import { TimelineBlockModal } from "./TimelineBlockModal"
import { TimelineBlock } from "./TimelineBlock"
import { SessionModal } from "./SessionModal"

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

const monthLabels = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
]

const monthNames = {
  JAN: "Janeiro",
  FEV: "Fevereiro",
  MAR: "Março",
  ABR: "Abril",
  MAI: "Maio",
  JUN: "Junho",
  JUL: "Julho",
  AGO: "Agosto",
  SET: "Setembro",
  OUT: "Outubro",
  NOV: "Novembro",
  DEZ: "Dezembro",
}

const colorByType = {
  "Marco positivo": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Evento traumático": "border-rose-200 bg-rose-50 text-rose-800",
  Insight: "border-amber-200 bg-amber-50 text-amber-800",
  Evento: "border-violet-200 bg-violet-50 text-violet-800",
  "Observação clínica": "border-blue-200 bg-blue-50 text-blue-800",
}

const mirrorColorByType = {
  "Marco positivo": "border-emerald-200 bg-emerald-50",
  "Evento traumático": "border-rose-200 bg-rose-50",
  Insight: "border-amber-200 bg-amber-50",
  Evento: "border-violet-200 bg-violet-50",
  "Observação clínica": "border-blue-200 bg-blue-50",
}

function getSessionsFromMonth(monthGroup) {
  if (!monthGroup) return []

  if (monthGroup.sessions) {
    return monthGroup.sessions
  }

  const blocks = monthGroup.blocks || []

  const sessionsByDate = blocks.reduce((sessions, block) => {
    const date = block.sessionDate || block.date

    if (!sessions[date]) {
      sessions[date] = []
    }

    sessions[date].push(block)

    return sessions
  }, {})

  return Object.entries(sessionsByDate).map(([date, sessionBlocks], index) => ({
    id: `session-${date}-${index}`,
    date,
    title: `Sessão ${index + 1}`,
    summary: sessionBlocks[0]?.text || "",
    blocks: sessionBlocks,
  }))
}

function getAllBlocks(timelineData) {
  return timelineData
    .flatMap((yearGroup) =>
      yearGroup.months.flatMap((monthGroup) =>
        getSessionsFromMonth(monthGroup).flatMap((session) =>
          (session.blocks || []).map((block) => ({
            ...block,
            sessionDate: block.sessionDate || session.date || block.date,
            eventDate: block.eventDate || block.date,
          }))
        )
      )
    )
    .filter(Boolean)
}

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

function getAvailableYears(timelineData) {
  return timelineData.map((yearGroup) => yearGroup.year)
}

function getYearGroup(timelineData, selectedYear) {
  return timelineData.find((yearGroup) => yearGroup.year === selectedYear)
}

function getMonthGroup(yearGroup, selectedMonth) {
  if (!yearGroup) return null

  return yearGroup.months.find((monthGroup) => monthGroup.month === selectedMonth)
}

function getMonthSessions(yearGroup, month) {
  const monthGroup = getMonthGroup(yearGroup, month)
  return getSessionsFromMonth(monthGroup)
}

function getDayFromDate(date) {
  if (!date) return "--"

  if (date.includes("/")) {
    return date.split("/")[0]
  }

  if (date.includes("-")) {
    return date.split("-")[2]
  }

  return "--"
}

function getMonthNumberFromDate(date) {
  if (!date) return ""

  if (date.includes("/")) {
    return date.split("/")[1]
  }

  if (date.includes("-")) {
    return date.split("-")[1]
  }

  return ""
}

function formatDateToComparable(dateString) {
  if (!dateString) return ""

  if (dateString.includes("-")) {
    return dateString
  }

  const [day, month, year] = dateString.split("/")
  return `${year}-${month}-${day}`
}

function getYearFromEventDate(dateString) {
  const comparableDate = formatDateToComparable(dateString)
  return comparableDate.split("-")[0]
}

function sortBlocksByEventDate(blocks) {
  return [...blocks].sort((firstBlock, secondBlock) => {
    const firstDate = formatDateToComparable(firstBlock.eventDate)
    const secondDate = formatDateToComparable(secondBlock.eventDate)

    return firstDate.localeCompare(secondDate)
  })
}

function groupBlocksByEventYear(blocks) {
  return blocks.reduce((groups, block) => {
    const year = getYearFromEventDate(block.eventDate)

    if (!groups[year]) {
      groups[year] = []
    }

    groups[year].push(block)

    return groups
  }, {})
}

function getSortedYearEntries(groupedBlocks) {
  return Object.entries(groupedBlocks).sort(([firstYear], [secondYear]) => {
    return Number(firstYear) - Number(secondYear)
  })
}

function GroupedTimelineView({
  groupedBlocks,
  onOpenConnectedBlock,
  onDeleteBlock,
  onEditBlock,
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
          <div className="mb-4">
            <h3 className="text-xl font-bold text-violet-800">{groupName}</h3>

            <p className="text-sm text-slate-500">
              {blocks.length} bloco{blocks.length > 1 ? "s" : ""} conectado
              {blocks.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {blocks.map((block) => (
              <TimelineBlock
                key={`${groupName}-${block.id}`}
                block={block}
                onOpenConnectedBlock={onOpenConnectedBlock}
                onDeleteBlock={onDeleteBlock}
                onEditBlock={onEditBlock}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MiniBlockCard({ block, onOpenBlock }) {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation()
        onOpenBlock(block)
      }}
      className={`min-w-[132px] rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        colorByType[block.type] || "border-slate-200 bg-slate-50 text-slate-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold">{block.type}</p>

        <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] text-slate-700">
          {block.intensity}/10
        </span>
      </div>

      <p className="mt-2 line-clamp-3 text-xs font-semibold text-slate-900">
        {block.title}
      </p>

      <div className="mt-2 flex flex-wrap gap-1">
        {(block.emotions || []).slice(0, 2).map((emotion) => (
          <span
            key={emotion}
            className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] text-slate-700"
          >
            {emotion}
          </span>
        ))}
      </div>
    </button>
  )
}

function SessionRow({ session, sessionNumber, onOpenSession, onOpenBlock }) {
  return (
    <button
      onClick={() => onOpenSession(session)}
      className="grid w-full grid-cols-[88px_150px_1fr_44px] items-stretch border-b border-slate-100 text-left transition last:border-b-0 hover:bg-slate-50"
    >
      <div className="flex flex-col items-center justify-center border-r border-slate-100 px-4 py-5">
        <p className="text-2xl font-bold text-slate-900">
          {getDayFromDate(session.date)}
        </p>

        <p className="text-xs font-medium text-slate-500">
          {getMonthNumberFromDate(session.date)}
        </p>

        <p className="mt-1 text-xs text-slate-400">16:00</p>
      </div>

      <div className="flex flex-col justify-center border-r border-slate-100 px-5 py-5">
        <p className="text-sm font-semibold text-slate-900">
          {session.title || `Sessão ${sessionNumber}`}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {(session.blocks || []).length} bloco
          {(session.blocks || []).length > 1 ? "s" : ""} na sessão
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 py-4">
        {(session.blocks || []).map((block) => (
          <MiniBlockCard key={block.id} block={block} onOpenBlock={onOpenBlock} />
        ))}
      </div>

      <div className="flex items-center justify-center text-xl text-slate-400">
        ›
      </div>
    </button>
  )
}

function ChronologicalTimelineView({
  timelineData,
  onOpenSession,
  onOpenBlock,
}) {
  const years = getAvailableYears(timelineData)
  const [selectedYear, setSelectedYear] = useState(years[0] || "")
  const [selectedMonth, setSelectedMonth] = useState("MAR")

  const yearGroup = getYearGroup(timelineData, selectedYear)
  const sessions = getMonthSessions(yearGroup, selectedMonth)
  const selectedYearIndex = years.findIndex((year) => year === selectedYear)

  function handlePreviousYear() {
    if (selectedYearIndex === years.length - 1) return

    setSelectedYear(years[selectedYearIndex + 1])
    setSelectedMonth("JAN")
  }

  function handleNextYear() {
    if (selectedYearIndex <= 0) return

    setSelectedYear(years[selectedYearIndex - 1])
    setSelectedMonth("JAN")
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePreviousYear}
          className="h-11 w-11 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          ‹
        </button>

        <button className="h-11 rounded-xl border border-slate-200 px-12 text-lg font-bold text-slate-900">
          {selectedYear || "Sem ano"}
        </button>

        <button
          onClick={handleNextYear}
          className="h-11 w-11 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-12 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {monthLabels.map((month) => {
          const isActive = selectedMonth === month
          const count = getMonthSessions(yearGroup, month).length

          return (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-3 py-4 text-sm transition ${
                isActive
                  ? "bg-violet-700 text-white"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-800"
              }`}
            >
              <span className="font-medium">{month}</span>

              {count > 0 && (
                <span
                  className={`ml-1 text-xs ${
                    isActive ? "text-violet-100" : "text-slate-400"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-[190px_1fr] overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <aside className="border-r border-slate-200 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold text-violet-800">
                {monthNames[selectedMonth]}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {sessions.length} sessão{sessions.length !== 1 ? "es" : ""}
              </p>
            </div>

            <span className="mt-1 h-2 w-2 rounded-full bg-violet-700" />
          </div>

          <p className="mt-7 text-sm leading-relaxed text-slate-600">
            Clique em uma sessão para abrir todos os blocos daquele atendimento.
          </p>

          <div className="mt-8 h-20 rounded-2xl bg-violet-50 p-3">
            <div className="flex h-full items-end gap-1">
              {[35, 48, 42, 68, 56, 82].map((height, index) => (
                <span
                  key={index}
                  style={{ height: `${height}%` }}
                  className="w-2 rounded-full bg-violet-400"
                />
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Sessões de {monthNames[selectedMonth].toLowerCase()}
              </h3>

              <p className="text-sm text-slate-500">
                {selectedYear} • blocos de eventos registrados por sessão
              </p>
            </div>

            <div className="flex gap-2">
              <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
                Ver em calendário
              </button>

              <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">
                Mais recentes
              </button>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="flex min-h-[280px] items-center justify-center p-8 text-center">
              <div>
                <p className="text-lg font-semibold text-slate-800">
                  Nenhuma sessão registrada neste mês
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Quando houver sessões em {monthNames[selectedMonth]}, elas
                  aparecerão aqui.
                </p>
              </div>
            </div>
          ) : (
            <div>
              {sessions.map((session, index) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  sessionNumber={sessions.length - index}
                  onOpenSession={onOpenSession}
                  onOpenBlock={onOpenBlock}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MirrorBlockCard({ block, onOpenBlock }) {
  const connectionsCount = block.connections?.length || 0
  const hasConnections = connectionsCount > 0

  return (
    <button
      onClick={() => onOpenBlock(block)}
      className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        mirrorColorByType[block.type] || "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-slate-500">
              {block.type} • {block.eventDate}
            </p>

            {hasConnections && (
              <span className="rounded-full bg-violet-700 px-2 py-0.5 text-[10px] font-semibold text-white">
                {connectionsCount} conexão
                {connectionsCount > 1 ? "ões" : ""}
              </span>
            )}
          </div>

          <h4 className="mt-1 font-semibold text-slate-900">{block.title}</h4>
        </div>

        <span className="rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700">
          {block.intensity}/10
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(block.emotions || []).slice(0, 3).map((emotion) => (
          <span
            key={emotion}
            className="rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700"
          >
            {emotion}
          </span>
        ))}

        {(block.people || []).slice(0, 2).map((person) => (
          <span
            key={person}
            className="rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700"
          >
            {person}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Relatado na sessão: {block.sessionDate}</span>
        <span className="font-medium text-violet-700">Abrir bloco</span>
      </div>
    </button>
  )
}

function MirrorTimelineView({ blocks, onOpenBlock }) {
  const sortedBlocks = sortBlocksByEventDate(blocks)
  const groupedBlocks = groupBlocksByEventYear(sortedBlocks)
  const yearEntries = getSortedYearEntries(groupedBlocks)

  return (
    <div className="mt-8">
      <div className="mb-6 rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-violet-950">
              Espelho do paciente
            </h3>

            <p className="mt-1 text-sm text-violet-700">
              Linha do tempo contínua da vida emocional, organizada pela data do
              acontecimento — não pela data da sessão.
            </p>
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-700">
            {sortedBlocks.length} acontecimento
            {sortedBlocks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {yearEntries.map(([year, yearBlocks]) => (
          <div key={year} className="grid grid-cols-[90px_1fr] gap-5">
            <div>
              <div className="sticky top-6 rounded-2xl bg-violet-700 px-4 py-3 text-center text-white">
                <p className="text-lg font-bold">{year}</p>
                <p className="text-[11px] text-violet-100">
                  {yearBlocks.length} evento
                  {yearBlocks.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="space-y-3 border-l-2 border-violet-100 pl-5">
              {yearBlocks.map((block) => (
                <MirrorBlockCard
                  key={block.id}
                  block={block}
                  onOpenBlock={onOpenBlock}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Timeline({
  timelineData,
  onDeleteBlock,
  onEditBlock,
  onAddBlockToSession,
  onUpdateSession,
  onDeleteSession,
}) {
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedMode, setSelectedMode] = useState("chronological")

  const currentMode = timelineModes.find((mode) => mode.id === selectedMode)

  const allBlocks = useMemo(() => {
    return getAllBlocks(timelineData)
  }, [timelineData])

  const blocksById = useMemo(() => {
    return allBlocks.reduce((accumulator, block) => {
      if (!block?.id) {
        return accumulator
      }

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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Sessões do paciente
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {currentMode.description}
          </p>
        </div>

        <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white">
          {timelineModes.map((mode) => {
            const isActive = selectedMode === mode.id

            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`px-5 py-2.5 text-sm transition ${
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
        <ChronologicalTimelineView
          timelineData={timelineData}
          onOpenSession={handleOpenSession}
          onOpenBlock={handleOpenBlock}
        />
      )}

      {selectedMode === "emotional" && (
        <GroupedTimelineView
          groupedBlocks={emotionalGroups}
          onOpenConnectedBlock={handleOpenConnectedBlock}
          onDeleteBlock={onDeleteBlock}
          onEditBlock={onEditBlock}
        />
      )}

      {selectedMode === "relational" && (
        <GroupedTimelineView
          groupedBlocks={relationalGroups}
          onOpenConnectedBlock={handleOpenConnectedBlock}
          onDeleteBlock={onDeleteBlock}
          onEditBlock={onEditBlock}
        />
      )}

      {selectedMode === "mirror" && (
        <MirrorTimelineView blocks={allBlocks} onOpenBlock={handleOpenBlock} />
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