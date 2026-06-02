import { useMemo, useState } from "react"

import { ClinicalBlockCard } from "./ClinicalBlockCard"

/**
 * Converte uma data da timeline em timestamp seguro para ordenação.
 */
function getDateTimestamp(dateValue) {
  if (!dateValue) return 0

  const timestamp = new Date(`${dateValue}T00:00:00`).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

/**
 * Extrai o ano da data do acontecimento.
 */
function getYearFromDate(dateValue) {
  if (!dateValue) return "Sem data"

  if (dateValue.includes("-")) {
    return dateValue.split("-")[0] || "Sem data"
  }

  if (dateValue.includes("/")) {
    return dateValue.split("/")[2] || "Sem data"
  }

  return "Sem data"
}

/**
 * Remove repetições e valores vazios de uma lista.
 */
function getUniqueItems(items = []) {
  return [...new Set(items.filter(Boolean))]
}

/**
 * Retorna anos disponíveis no Espelho.
 */
function getAvailableMirrorYears(blocks) {
  const years = getUniqueItems(
    blocks.map((block) => getYearFromDate(block.eventDate || block.date))
  )

  return years.sort((firstYear, secondYear) => {
    if (firstYear === "Sem data") return 1
    if (secondYear === "Sem data") return -1

    return Number(firstYear) - Number(secondYear)
  })
}

/**
 * Agrupa acontecimentos por ano real do evento.
 */
function groupBlocksByYear(blocks) {
  return blocks.reduce((groups, block) => {
    const year = getYearFromDate(block.eventDate || block.date)

    if (!groups[year]) {
      groups[year] = []
    }

    groups[year].push(block)

    return groups
  }, {})
}

/**
 * Calcula dados resumidos do Espelho.
 */
function getMirrorSummary(blocks) {
  const connectionsCount = blocks.reduce((total, block) => {
    return total + (block.connections?.length || 0)
  }, 0)

  const emotions = getUniqueItems(blocks.flatMap((block) => block.emotions || []))

  const relationships = getUniqueItems(
    blocks.flatMap((block) => block.people || [])
  )

  const highIntensityCount = blocks.filter(
    (block) => Number(block.intensity || 0) >= 8
  ).length

  return {
    eventsCount: blocks.length,
    connectionsCount,
    emotionsCount: emotions.length,
    relationshipsCount: relationships.length,
    highIntensityCount,
  }
}

function MirrorSummaryLine({ summary }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
      <span>
        <strong className="font-black text-slate-800">
          {summary.eventsCount}
        </strong>{" "}
        acontecimentos
      </span>

      <span className="text-slate-300">·</span>

      <span>
        <strong className="font-black text-slate-800">
          {summary.connectionsCount}
        </strong>{" "}
        conexões
      </span>

      <span className="text-slate-300">·</span>

      <span>
        <strong className="font-black text-slate-800">
          {summary.emotionsCount}
        </strong>{" "}
        emoções
      </span>

      <span className="text-slate-300">·</span>

      <span>
        <strong className="font-black text-slate-800">
          {summary.relationshipsCount}
        </strong>{" "}
        relações
      </span>

      <span className="text-slate-300">·</span>

      <span>
        <strong className="font-black text-slate-800">
          {summary.highIntensityCount}
        </strong>{" "}
        alta intensidade
      </span>
    </div>
  )
}

function MirrorFilterButton({ isActive, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
        isActive
          ? "bg-violet-800 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800"
      }`}
    >
      {children}
    </button>
  )
}

function MirrorYearSelect({ years, selectedYear, onSelectYear }) {
  if (years.length === 0) {
    return null
  }

  return (
    <select
      value={selectedYear}
      onChange={(event) => onSelectYear(event.target.value)}
      className="h-[34px] w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 sm:w-40"
    >
      <option value="">Todos os anos</option>

      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  )
}

/**
 * Espelho do paciente.
 *
 * Organiza acontecimentos pela data real em que ocorreram na vida do paciente.
 * Os cards agora usam ClinicalBlockCard, garantindo o mesmo padrão visual
 * dos modos Sessões, Emoções e Relações.
 */
export function MirrorTimeline({ blocks = [], onOpenBlock }) {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedYear, setSelectedYear] = useState("")

  const sortedBlocks = useMemo(() => {
    return [...blocks].sort((firstBlock, secondBlock) => {
      return (
        getDateTimestamp(firstBlock.eventDate || firstBlock.date) -
        getDateTimestamp(secondBlock.eventDate || secondBlock.date)
      )
    })
  }, [blocks])

  const availableYears = useMemo(() => {
    return getAvailableMirrorYears(sortedBlocks)
  }, [sortedBlocks])

  const filteredBlocks = useMemo(() => {
    return sortedBlocks.filter((block) => {
      const blockYear = getYearFromDate(block.eventDate || block.date)
      const matchesYear = !selectedYear || blockYear === selectedYear
      const hasConnections = (block.connections || []).length > 0
      const isHighIntensity = Number(block.intensity || 0) >= 8

      if (!matchesYear) {
        return false
      }

      if (activeFilter === "connected") {
        return hasConnections
      }

      if (activeFilter === "highIntensity") {
        return isHighIntensity
      }

      return true
    })
  }, [activeFilter, selectedYear, sortedBlocks])

  const summary = useMemo(() => {
    return getMirrorSummary(sortedBlocks)
  }, [sortedBlocks])

  const filteredSummary = useMemo(() => {
    return getMirrorSummary(filteredBlocks)
  }, [filteredBlocks])

  const groupedBlocks = useMemo(() => {
    return groupBlocksByYear(filteredBlocks)
  }, [filteredBlocks])

  const years = Object.keys(groupedBlocks).sort((firstYear, secondYear) => {
    if (firstYear === "Sem data") return 1
    if (secondYear === "Sem data") return -1

    return Number(firstYear) - Number(secondYear)
  })

  if (blocks.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
        <h3 className="text-base font-black text-slate-950">
          Espelho ainda vazio
        </h3>

        <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          Os acontecimentos aparecerão aqui quando houver blocos registrados na
          timeline do paciente.
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-4">
      <header className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
                Espelho do paciente
              </p>

              <span className="hidden text-slate-300 sm:inline">·</span>

              <h3 className="text-base font-black tracking-tight text-slate-950">
                Linha da vida emocional
              </h3>
            </div>

            <div className="mt-2">
              <MirrorSummaryLine summary={summary} />
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
            <MirrorYearSelect
              years={availableYears}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
            />

            <MirrorFilterButton
              isActive={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            >
              Todos
            </MirrorFilterButton>

            <MirrorFilterButton
              isActive={activeFilter === "connected"}
              onClick={() => setActiveFilter("connected")}
            >
              Conectados
            </MirrorFilterButton>

            <MirrorFilterButton
              isActive={activeFilter === "highIntensity"}
              onClick={() => setActiveFilter("highIntensity")}
            >
              Alta intensidade
            </MirrorFilterButton>
          </div>
        </div>
      </header>

      {(selectedYear || activeFilter !== "all") && (
        <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">
            Resultado atual:
          </span>

          {selectedYear && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              Ano: {selectedYear}
            </span>
          )}

          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
            {filteredSummary.eventsCount} acontecimento
            {filteredSummary.eventsCount !== 1 ? "s" : ""}
          </span>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            {filteredSummary.connectionsCount} conexão
            {filteredSummary.connectionsCount !== 1 ? "ões" : ""}
          </span>

          <button
            type="button"
            onClick={() => {
              setSelectedYear("")
              setActiveFilter("all")
            }}
            className="ml-auto rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            Limpar filtros
          </button>
        </section>
      )}

      {filteredBlocks.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
          <h3 className="text-base font-black text-slate-950">
            Nenhum acontecimento encontrado
          </h3>

          <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            Ajuste o ano ou o tipo de filtro para visualizar outros
            acontecimentos do espelho.
          </p>
        </section>
      ) : (
        <section className="grid gap-6">
          {years.map((year) => (
            <section key={year} className="grid gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-16 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                  {year}
                </span>

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-semibold text-slate-400">
                  {groupedBlocks[year].length} acontecimento
                  {groupedBlocks[year].length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid gap-3 xl:grid-cols-2">
                {groupedBlocks[year].map((block) => (
                  <ClinicalBlockCard
                    key={block.id}
                    block={block}
                    onOpenBlock={onOpenBlock}
                    showActions={false}
                  />
                ))}
              </div>
            </section>
          ))}
        </section>
      )}
    </section>
  )
}