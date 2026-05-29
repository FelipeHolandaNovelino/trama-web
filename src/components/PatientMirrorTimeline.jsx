import { useState } from "react"
import { TimelineBlockModal } from "./TimelineBlockModal"

const colorByType = {
  "Marco positivo": "border-emerald-200 bg-emerald-50",
  "Evento traumático": "border-rose-200 bg-rose-50",
  Insight: "border-amber-200 bg-amber-50",
  Evento: "border-violet-200 bg-violet-50",
  "Observação clínica": "border-blue-200 bg-blue-50",
}

function getSessionsFromMonth(monthGroup) {
  if (monthGroup.sessions) {
    return monthGroup.sessions
  }

  const blocks = monthGroup.blocks || []

  const sessionsByDate = blocks.reduce((sessions, block) => {
    if (!sessions[block.date]) {
      sessions[block.date] = []
    }

    sessions[block.date].push(block)

    return sessions
  }, {})

  return Object.entries(sessionsByDate).map(([date, sessionBlocks], index) => ({
    id: `session-${date}-${index}`,
    date,
    title: `Sessão ${index + 1}`,
    blocks: sessionBlocks,
  }))
}

function getAllBlocks(timelineData) {
  return timelineData.flatMap((yearGroup) =>
    yearGroup.months.flatMap((monthGroup) =>
      getSessionsFromMonth(monthGroup).flatMap((session) =>
        session.blocks.map((block) => ({
          ...block,
          sessionDate: block.sessionDate || session.date || block.date,
          eventDate: block.eventDate || block.date,
        }))
      )
    )
  )
}

function formatDateToComparable(dateString) {
  if (!dateString) return ""

  if (dateString.includes("-")) {
    return dateString
  }

  const [day, month, year] = dateString.split("/")
  return `${year}-${month}-${day}`
}

function getYearFromDate(dateString) {
  const comparableDate = formatDateToComparable(dateString)
  return comparableDate.split("-")[0]
}

function groupBlocksByEventYear(blocks) {
  return blocks.reduce((groups, block) => {
    const year = getYearFromDate(block.eventDate)

    if (!groups[year]) {
      groups[year] = []
    }

    groups[year].push(block)

    return groups
  }, {})
}

function sortBlocksByEventDate(blocks) {
  return [...blocks].sort((firstBlock, secondBlock) => {
    const firstDate = formatDateToComparable(firstBlock.eventDate)
    const secondDate = formatDateToComparable(secondBlock.eventDate)

    return firstDate.localeCompare(secondDate)
  })
}

function getSortedYearEntries(groupedBlocks) {
  return Object.entries(groupedBlocks).sort(([firstYear], [secondYear]) => {
    return Number(firstYear) - Number(secondYear)
  })
}

function MirrorBlockCard({ block, onOpenBlock }) {
  return (
    <button
      onClick={() => onOpenBlock(block)}
      className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        colorByType[block.type] || "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {block.type} • {block.eventDate}
          </p>

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

export function PatientMirrorTimeline({ timelineData }) {
  const [selectedBlock, setSelectedBlock] = useState(null)

  const allBlocks = sortBlocksByEventDate(getAllBlocks(timelineData))
  const groupedBlocks = groupBlocksByEventYear(allBlocks)
  const yearEntries = getSortedYearEntries(groupedBlocks)

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Espelho do paciente
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Linha do tempo contínua da vida emocional, organizada pela data do
            acontecimento.
          </p>
        </div>

        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
          {allBlocks.length} acontecimento{allBlocks.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-8 space-y-8">
        {yearEntries.map(([year, blocks]) => (
          <div key={year} className="grid grid-cols-[90px_1fr] gap-5">
            <div>
              <div className="sticky top-6 rounded-2xl bg-violet-700 px-4 py-3 text-center text-white">
                <p className="text-lg font-bold">{year}</p>
                <p className="text-[11px] text-violet-100">
                  {blocks.length} evento{blocks.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="space-y-3 border-l-2 border-violet-100 pl-5">
              {blocks.map((block) => (
                <MirrorBlockCard
                  key={block.id}
                  block={block}
                  onOpenBlock={setSelectedBlock}
                />
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