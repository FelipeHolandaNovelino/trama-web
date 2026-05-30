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

const mirrorConnectionColorByStrength = {
  leve: "border-slate-200 bg-slate-50 text-slate-700",
  moderada: "border-amber-200 bg-amber-50 text-amber-800",
  forte: "border-emerald-200 bg-emerald-50 text-emerald-800",
}

const dotColorByType = {
  "Marco positivo": "bg-emerald-400",
  "Evento traumático": "bg-rose-400",
  Insight: "bg-amber-400",
  Evento: "bg-violet-400",
  "Observação clínica": "bg-blue-400",
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

function getAllSessions(timelineData) {
  return timelineData.flatMap((yearGroup) =>
    yearGroup.months.flatMap((monthGroup) => getSessionsFromMonth(monthGroup))
  )
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

function getMonthFromEventDate(dateString) {
  const comparableDate = formatDateToComparable(dateString)
  const [, month] = comparableDate.split("-")

  return monthLabels[Number(month) - 1] || ""
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

function getTotalBlocksFromSessions(sessions) {
  return sessions.reduce((total, session) => {
    return total + (session.blocks || []).length
  }, 0)
}

function getMostCommonBlockTypesFromSessions(sessions) {
  const blocks = sessions.flatMap((session) => session.blocks || [])

  return blocks.slice(0, 5).map((block) => block.type)
}

function getBlocksById(blocks) {
  return blocks.reduce((accumulator, block) => {
    if (!block?.id) return accumulator

    accumulator[block.id] = block
    return accumulator
  }, {})
}

function getMirrorMainBlocks(blocks) {
  const targetIds = new Set(
    blocks.flatMap((block) =>
      (block.connections || []).map((connection) => connection.targetBlockId)
    )
  )

  return sortBlocksByEventDate(blocks).filter((block) => !targetIds.has(block.id))
}

function getMirrorConnectedBlocks(block, blocksById) {
  return (block.connections || [])
    .map((connection) => {
      const connectedBlock = blocksById[connection.targetBlockId]

      if (!connectedBlock) return null

      return {
        ...connectedBlock,
        connectionReason: connection.reason,
        connectionStrength: connection.strength,
      }
    })
    .filter(Boolean)
}

function getUniquePeopleCount(blocks) {
  const people = new Set()

  blocks.forEach((block) => {
    ;(block.people || []).forEach((person) => people.add(person))
  })

  return people.size
}

function getConnectionsCount(blocks) {
  return blocks.reduce((total, block) => {
    return total + (block.connections || []).length
  }, 0)
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

function MonthCalendarCard({ month, sessions, isActive, onClick }) {
  const totalBlocks = getTotalBlocksFromSessions(sessions)
  const blockTypes = getMostCommonBlockTypesFromSessions(sessions)

  return (
    <button
      onClick={onClick}
      className={`min-h-[150px] rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        isActive
          ? "border-violet-300 bg-violet-50 shadow-sm"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-sm font-bold ${
              isActive ? "text-violet-800" : "text-slate-800"
            }`}
          >
            {month}
          </p>

          <p className="mt-1 text-xs text-slate-500">{monthNames[month]}</p>
        </div>

        {sessions.length > 0 && (
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              isActive
                ? "bg-violet-700 text-white"
                : "bg-violet-100 text-violet-800"
            }`}
          >
            {sessions.length}
          </span>
        )}
      </div>

      <div className="mt-5">
        {sessions.length === 0 ? (
          <p className="text-xs text-slate-400">Sem sessões</p>
        ) : (
          <>
            <p className="text-xs font-medium text-slate-600">
              {sessions.length} sessão{sessions.length > 1 ? "es" : ""}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {totalBlocks} bloco{totalBlocks > 1 ? "s" : ""}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {blockTypes.map((type, index) => (
                <span
                  key={`${type}-${index}`}
                  className={`h-2 w-2 rounded-full ${
                    dotColorByType[type] || "bg-slate-300"
                  }`}
                  title={type}
                />
              ))}
            </div>
          </>
        )}
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
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false)

  const yearGroup = getYearGroup(timelineData, selectedYear)
  const sessions = getMonthSessions(yearGroup, selectedMonth)

  const totalSessionsInYear = monthLabels.reduce((total, month) => {
    return total + getMonthSessions(yearGroup, month).length
  }, 0)

  const totalBlocksInAllYears = getAllBlocks(timelineData).length
  const totalSessionsInAllYears = getAllSessions(timelineData).length

  function handleSelectYear(year) {
    setSelectedYear(year)
    setSelectedMonth("JAN")
    setIsYearMenuOpen(false)
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Calendário clínico
            </p>

            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              Sessões por mês
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Clique em um mês para ver as sessões registradas.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsYearMenuOpen(!isYearMenuOpen)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-lg font-bold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              {selectedYear || "Sem ano"}
              <span className="text-sm text-slate-400">▾</span>
            </button>

            {isYearMenuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleSelectYear(year)}
                    className={`w-full px-4 py-3 text-left text-sm transition ${
                      year === selectedYear
                        ? "bg-violet-50 font-semibold text-violet-800"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-4">
          {monthLabels.map((month) => {
            const monthSessions = getMonthSessions(yearGroup, month)

            return (
              <MonthCalendarCard
                key={month}
                month={month}
                sessions={monthSessions}
                isActive={selectedMonth === month}
                onClick={() => setSelectedMonth(month)}
              />
            )
          })}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Sessões no ano
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalSessionsInYear}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Sessões totais
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalSessionsInAllYears}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Blocos de eventos totais
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalBlocksInAllYears}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">Mês aberto</p>

            <p className="mt-1 text-lg font-bold text-violet-800">
              {monthNames[selectedMonth]}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Sessões de {monthNames[selectedMonth].toLowerCase()}
            </h3>

            <p className="text-sm text-slate-500">
              {selectedYear} • {sessions.length} sessão
              {sessions.length !== 1 ? "es" : ""} encontrada
              {sessions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="flex min-h-[240px] items-center justify-center p-8 text-center">
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
  )
}

function MirrorConnectedCard({ block, onOpenBlock }) {
  return (
    <button
      onClick={() => onOpenBlock(block)}
      className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        mirrorConnectionColorByStrength[block.connectionStrength] ||
        "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      <p className="text-xs font-semibold text-slate-500">
        {block.eventDate || block.date}
      </p>

      <h5 className="mt-1 text-sm font-bold text-slate-900">{block.title}</h5>

      {block.connectionReason && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {block.connectionReason}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(block.emotions || []).slice(0, 2).map((emotion) => (
          <span
            key={emotion}
            className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] text-slate-700"
          >
            {emotion}
          </span>
        ))}
      </div>
    </button>
  )
}

function MirrorMainCard({ block, connectedBlocks, onOpenBlock }) {
  const year = getYearFromEventDate(block.eventDate)
  const month = getMonthFromEventDate(block.eventDate)

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
      <button
        onClick={() => onOpenBlock(block)}
        className={`relative rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
          mirrorColorByType[block.type] || "border-slate-200 bg-white"
        }`}
      >
        <div className="absolute -left-[29px] top-7 h-4 w-4 rounded-full border-4 border-white bg-violet-700 shadow" />

        <div className="grid gap-4 md:grid-cols-[90px_1fr_180px]">
          <div className="border-r border-slate-200 pr-4">
            <p className="text-2xl font-bold text-slate-900">
              {getDayFromDate(block.eventDate)}
            </p>

            <p className="text-xs font-semibold text-violet-700">{month}</p>

            <p className="mt-1 text-xs text-slate-400">{year}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500">{block.type}</p>

            <h4 className="mt-1 text-lg font-bold text-slate-900">
              {block.title}
            </h4>

            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
              {block.text}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(block.emotions || []).slice(0, 4).map((emotion) => (
                <span
                  key={emotion}
                  className="rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>

          <div className="border-l border-slate-200 pl-4">
            <p className="text-xs font-semibold text-slate-500">
              Pessoas envolvidas
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {(block.people || []).slice(0, 3).map((person) => (
                <span
                  key={person}
                  className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-slate-700"
                >
                  {person}
                </span>
              ))}

              {(block.people || []).length > 3 && (
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-slate-700">
                  +{block.people.length - 3}
                </span>
              )}
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-500">
              Intensidade
            </p>

            <div className="mt-2 flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index < Math.ceil((block.intensity || 0) / 2)
                      ? "bg-violet-700"
                      : "bg-slate-200"
                  }`}
                />
              ))}

              <span className="ml-2 text-xs text-slate-500">
                {block.intensity}/10
              </span>
            </div>

            <p className="mt-4 text-xs font-medium text-violet-700">
              Abrir acontecimento
            </p>
          </div>
        </div>
      </button>

      <div className="relative">
        {connectedBlocks.length > 0 && (
          <>
            <div className="absolute -left-4 top-1/2 hidden h-px w-4 border-t border-dashed border-violet-300 lg:block" />

            <div className="space-y-3">
              {connectedBlocks.map((connectedBlock) => (
                <MirrorConnectedCard
                  key={connectedBlock.id}
                  block={connectedBlock}
                  onOpenBlock={onOpenBlock}
                />
              ))}
            </div>
          </>
        )}

        {connectedBlocks.length === 0 && (
          <div className="hidden h-full items-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-xs text-slate-400 lg:flex">
            Sem desdobramentos conectados.
          </div>
        )}
      </div>
    </div>
  )
}

function MirrorTimelineView({ blocks, onOpenBlock }) {
  const [showOnlyConnected, setShowOnlyConnected] = useState(false)

  const blocksById = getBlocksById(blocks)
  const sortedBlocks = sortBlocksByEventDate(blocks)
  const mainBlocks = getMirrorMainBlocks(sortedBlocks)
  const visibleBlocks = showOnlyConnected
    ? mainBlocks.filter((block) => (block.connections || []).length > 0)
    : mainBlocks

  const totalPeople = getUniquePeopleCount(blocks)
  const totalConnections = getConnectionsCount(blocks)
  const firstYear = sortedBlocks[0]
    ? getYearFromEventDate(sortedBlocks[0].eventDate)
    : "-"
  const lastYear = sortedBlocks[sortedBlocks.length - 1]
    ? getYearFromEventDate(sortedBlocks[sortedBlocks.length - 1].eventDate)
    : "-"

  return (
    <div className="mt-8">
      <div className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-violet-700">
              Espelho longitudinal
            </p>

            <h3 className="mt-1 text-2xl font-bold text-violet-950">
              Linha da vida emocional
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-violet-700">
              Visualize os acontecimentos principais em todos os anos, com seus
              desdobramentos e conexões emocionais ao lado.
            </p>
          </div>

          <button
            onClick={() => setShowOnlyConnected(!showOnlyConnected)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              showOnlyConnected
                ? "bg-violet-800 text-white"
                : "bg-white text-violet-800 hover:bg-violet-100"
            }`}
          >
            {showOnlyConnected
              ? "Mostrar todos"
              : "Mostrar apenas conectados"}
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Eventos principais
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {mainBlocks.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Pessoas envolvidas
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalPeople}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Conexões identificadas
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalConnections}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Período coberto
            </p>

            <p className="mt-1 text-lg font-bold text-violet-800">
              {firstYear} — {lastYear}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
        <div className="relative border-l-2 border-violet-100 pl-8">
          <div className="space-y-5">
            {visibleBlocks.map((block) => {
              const connectedBlocks = getMirrorConnectedBlocks(block, blocksById)

              return (
                <MirrorMainCard
                  key={block.id}
                  block={block}
                  connectedBlocks={connectedBlocks}
                  onOpenBlock={onOpenBlock}
                />
              )
            })}
          </div>
        </div>

        {visibleBlocks.length === 0 && (
          <div className="flex min-h-[220px] items-center justify-center text-center">
            <div>
              <p className="text-lg font-semibold text-slate-800">
                Nenhum acontecimento encontrado
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Os acontecimentos aparecerão aqui quando houver blocos
                registrados.
              </p>
            </div>
          </div>
        )}
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