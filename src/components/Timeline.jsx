import { useMemo, useState } from "react"
import { TimelineBlockModal } from "./TimelineBlockModal"
import { TimelineBlock } from "./TimelineBlock"

const timelineModes = [
  {
    id: "chronological",
    label: "Cronológica",
    description: "Histórico clínico organizado por ano, mês, sessões e blocos",
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

function getAllBlocks(timelineData) {
  return timelineData.flatMap((yearGroup) =>
    yearGroup.months.flatMap((monthGroup) => monthGroup.blocks)
  )
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

function getMonthCount(yearGroup, month) {
  const monthGroup = getMonthGroup(yearGroup, month)
  return monthGroup?.blocks.length || 0
}

function getTotalBlocksInYear(yearGroup) {
  if (!yearGroup) return 0

  return yearGroup.months.reduce((total, monthGroup) => {
    return total + monthGroup.blocks.length
  }, 0)
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

function groupBlocksIntoSessions(blocks) {
  const sessionsByDate = blocks.reduce((sessions, block) => {
    const date = block.date

    if (!sessions[date]) {
      sessions[date] = []
    }

    sessions[date].push(block)

    return sessions
  }, {})

  return Object.entries(sessionsByDate)
    .map(([date, sessionBlocks], index) => ({
      id: `session-${date}`,
      date,
      day: getDayFromDate(date),
      title: `Sessão ${index + 1}`,
      blocks: sessionBlocks,
    }))
    .sort((firstSession, secondSession) => {
      return Number(secondSession.day) - Number(firstSession.day)
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

function MiniBlockCard({ block, onOpenBlock, onEditBlock, onDeleteBlock }) {
  return (
    <div
      className={`min-w-[135px] rounded-xl border p-3 ${
        colorByType[block.type] || "border-slate-200 bg-slate-50 text-slate-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold">{block.type}</p>

        <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] text-slate-700">
          {block.intensity}/10
        </span>
      </div>

      <button
        onClick={() => onOpenBlock(block)}
        className="mt-2 line-clamp-2 text-left text-xs font-semibold text-slate-900 hover:underline"
      >
        {block.title}
      </button>

      <div className="mt-2 flex flex-wrap gap-1">
        {block.emotions.slice(0, 2).map((emotion) => (
          <span
            key={emotion}
            className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] text-slate-700"
          >
            {emotion}
          </span>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onEditBlock(block)}
          className="text-[10px] font-medium text-violet-700 hover:underline"
        >
          Editar
        </button>

        <button
          onClick={() => onDeleteBlock(block.id)}
          className="text-[10px] font-medium text-rose-700 hover:underline"
        >
          Excluir
        </button>
      </div>
    </div>
  )
}

function SessionRow({
  session,
  sessionNumber,
  onOpenBlock,
  onEditBlock,
  onDeleteBlock,
}) {
  const mainBlock = session.blocks[0]

  return (
    <div className="grid grid-cols-[88px_160px_1fr_36px] items-stretch border-b border-slate-100 last:border-b-0">
      <div className="flex flex-col items-center justify-center border-r border-slate-100 px-4 py-5">
        <p className="text-2xl font-bold text-slate-900">{session.day}</p>
        <p className="text-xs font-medium text-slate-500">
          {session.date.includes("/") ? session.date.split("/")[1] : ""}
        </p>
        <p className="mt-1 text-xs text-slate-400">Qua • 16:00</p>
      </div>

      <div className="flex flex-col justify-center border-r border-slate-100 px-5 py-5">
        <p className="text-sm font-semibold text-slate-900">
          Sessão {sessionNumber}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {session.blocks.length} bloco{session.blocks.length > 1 ? "s" : ""} na sessão
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 py-4">
        {session.blocks.map((block) => (
          <MiniBlockCard
            key={block.id}
            block={block}
            onOpenBlock={onOpenBlock}
            onEditBlock={onEditBlock}
            onDeleteBlock={onDeleteBlock}
          />
        ))}
      </div>

      <button
        onClick={() => onOpenBlock(mainBlock)}
        className="flex items-center justify-center text-slate-400 hover:text-violet-700"
        title="Abrir primeiro bloco da sessão"
      >
        ›
      </button>
    </div>
  )
}

function ChronologicalTimelineView({
  timelineData,
  selectedBlock,
  onOpenBlock,
  onDeleteBlock,
  onEditBlock,
}) {
  const years = getAvailableYears(timelineData)
  const [selectedYear, setSelectedYear] = useState(years[0])
  const [selectedMonth, setSelectedMonth] = useState("MAR")

  const yearGroup = getYearGroup(timelineData, selectedYear)
  const selectedMonthGroup = getMonthGroup(yearGroup, selectedMonth)
  const monthBlocks = selectedMonthGroup?.blocks || []
  const sessions = groupBlocksIntoSessions(monthBlocks)
  const selectedYearIndex = years.findIndex((year) => year === selectedYear)

  function handlePreviousYear() {
    if (selectedYearIndex === years.length - 1) return

    setSelectedYear(years[selectedYearIndex + 1])
    setSelectedMonth("JAN")
  }

  function handleNextYear() {
    if (selectedYearIndex === 0) return

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
          {selectedYear}
        </button>

        <button
          onClick={handleNextYear}
          className="h-11 w-11 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-12 rounded-2xl border border-slate-200 bg-white">
        {monthLabels.map((month) => {
          const isActive = selectedMonth === month
          const count = getMonthCount(yearGroup, month)

          return (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`relative px-3 py-4 text-sm transition ${
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
            Foco em reduzir sobrecarga e fortalecer limites saudáveis.
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
                  onOpenBlock={onOpenBlock}
                  onDeleteBlock={onDeleteBlock}
                  onEditBlock={onEditBlock}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Timeline({ timelineData, onDeleteBlock, onEditBlock }) {
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [selectedMode, setSelectedMode] = useState("chronological")

  const currentMode = timelineModes.find((mode) => mode.id === selectedMode)

  const allBlocks = useMemo(() => {
    return getAllBlocks(timelineData)
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

  function handleOpenBlock(block) {
    setSelectedBlock(block)
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div>
         <h3 className="text-xl font-bold text-slate-900">Sessões do paciente</h3>

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
          selectedBlock={selectedBlock}
          onOpenBlock={handleOpenBlock}
          onDeleteBlock={onDeleteBlock}
          onEditBlock={onEditBlock}
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

      <TimelineBlockModal
        block={selectedBlock}
        onClose={() => setSelectedBlock(null)}
      />
    </section>
  )
}