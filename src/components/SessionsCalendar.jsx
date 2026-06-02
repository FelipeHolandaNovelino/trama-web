import {
  getAllBlocks,
  getAllSessions,
  getAvailableYears,
  getDayFromDate,
  getMonthNumberFromDate,
  getMonthSessions,
  getMostCommonBlockTypesFromSessions,
  getTotalBlocksFromSessions,
  getYearGroup,
  monthLabels,
  monthNames,
} from "../utils/timelineUtils"

const colorByType = {
  "Marco positivo": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Evento traumático": "border-rose-200 bg-rose-50 text-rose-800",
  Insight: "border-amber-200 bg-amber-50 text-amber-800",
  Evento: "border-violet-200 bg-violet-50 text-violet-800",
  "Observação clínica": "border-blue-200 bg-blue-50 text-blue-800",
}

const dotColorByType = {
  "Marco positivo": "bg-emerald-400",
  "Evento traumático": "bg-rose-400",
  Insight: "bg-amber-400",
  Evento: "bg-violet-400",
  "Observação clínica": "bg-blue-400",
}

/**
 * Miniatura compacta de bloco dentro da linha de sessão.
 * Mantém acesso rápido ao bloco sem deixar a lista alta demais.
 */
function MiniBlockCard({ block, onOpenBlock }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onOpenBlock(block)
      }}
      className={`min-w-[112px] rounded-xl border px-3 py-2 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        colorByType[block.type] || "border-slate-200 bg-slate-50 text-slate-800"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[11px] font-bold uppercase tracking-[0.12em]">
          {block.type}
        </span>

        <span className="shrink-0 text-[11px] font-black">
          {block.intensity}/10
        </span>
      </div>

      <p className="mt-1 line-clamp-1 text-xs font-semibold">{block.title}</p>

      <div className="mt-1.5 flex flex-wrap gap-1">
        {(block.emotions || []).slice(0, 2).map((emotion) => (
          <span
            key={emotion}
            className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold"
          >
            {emotion}
          </span>
        ))}
      </div>
    </button>
  )
}

/**
 * Card compacto de mês.
 * Mostra o essencial: mês, quantidade de sessões, blocos e tipos principais.
 */
function MonthCalendarCard({ month, sessions, isActive, onClick }) {
  const totalBlocks = getTotalBlocksFromSessions(sessions)
  const blockTypes = getMostCommonBlockTypesFromSessions(sessions)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-3 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        isActive
          ? "border-violet-300 bg-violet-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-violet-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className={`text-xs font-black ${
              isActive ? "text-violet-800" : "text-slate-800"
            }`}
          >
            {month}
          </p>

          <p className="mt-0.5 text-[11px] font-medium text-slate-400">
            {monthNames[month]}
          </p>
        </div>

        {sessions.length > 0 && (
          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-violet-700 shadow-sm">
            {sessions.length}
          </span>
        )}
      </div>

      {sessions.length === 0 ? (
        <p className="mt-3 text-xs font-medium text-slate-400">Sem sessões</p>
      ) : (
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-700">
            {sessions.length} sessão{sessions.length > 1 ? "es" : ""}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {totalBlocks} bloco{totalBlocks > 1 ? "s" : ""}
          </p>

          <div className="mt-2 flex gap-1">
            {blockTypes.slice(0, 4).map((type, index) => (
              <span
                key={`${type}-${index}`}
                className={`h-1.5 w-1.5 rounded-full ${
                  dotColorByType[type] || "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </button>
  )
}

/**
 * Linha compacta de sessão.
 * A linha inteira abre a sessão; os blocos internos continuam clicáveis.
 */
function SessionRow({ session, sessionNumber, onOpenSession, onOpenBlock }) {
  function handleOpenSession() {
    onOpenSession(session)
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onOpenSession(session)
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpenSession}
      onKeyDown={handleKeyDown}
      className="grid cursor-pointer gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition hover:border-violet-200 hover:bg-violet-50/30 focus-visible:ring-4 focus-visible:ring-violet-100 lg:grid-cols-[72px_minmax(0,1fr)_auto] lg:items-center"
    >
      <div className="flex items-center gap-3 lg:block">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
          <span className="text-lg font-black leading-none">
            {getDayFromDate(session.date)}
          </span>

          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {getMonthNumberFromDate(session.date)}
          </span>
        </div>

        <span className="text-xs font-semibold text-slate-400 lg:mt-2 lg:block">
          16:00
        </span>
      </div>

      <div className="min-w-0">
        <h4 className="truncate text-sm font-black text-slate-950">
          {session.title || `Sessão ${sessionNumber}`}
        </h4>

        <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-slate-500">
          {session.summary || "Sessão sem resumo clínico."}
        </p>

        <p className="mt-1 text-xs font-semibold text-slate-400">
          {(session.blocks || []).length} bloco
          {(session.blocks || []).length > 1 ? "s" : ""} na sessão
        </p>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:max-w-[420px]">
        {(session.blocks || []).slice(0, 4).map((block) => (
          <MiniBlockCard
            key={block.id}
            block={block}
            onOpenBlock={onOpenBlock}
          />
        ))}

        {(session.blocks || []).length > 4 && (
          <span className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
            +{(session.blocks || []).length - 4}
          </span>
        )}

        <span className="shrink-0 text-xl font-light text-slate-300">›</span>
      </div>
    </article>
  )
}

/**
 * Calendário clínico compacto.
 *
 * Mantém a visão anual por meses, mas reduz altura, espaçamento e peso visual
 * para deixar a timeline aparecer mais cedo na tela.
 */
export function SessionsCalendar({
  timelineData,
  selectedYear,
  selectedMonth,
  isYearMenuOpen,
  onSelectYear,
  onSelectMonth,
  onToggleYearMenu,
  onOpenSession,
  onOpenBlock,
}) {
  const years = getAvailableYears(timelineData)
  const yearGroup = getYearGroup(timelineData, selectedYear)
  const sessions = getMonthSessions(yearGroup, selectedMonth)

  const totalSessionsInYear = monthLabels.reduce((total, month) => {
    return total + getMonthSessions(yearGroup, month).length
  }, 0)

  const totalBlocksInAllYears = getAllBlocks(timelineData).length
  const totalSessionsInAllYears = getAllSessions(timelineData).length

  const summaryItems = [
    {
      label: "Ano",
      value: selectedYear || "—",
    },
    {
      label: "Sessões no ano",
      value: totalSessionsInYear,
    },
    {
      label: "Sessões totais",
      value: totalSessionsInAllYears,
    },
    {
      label: "Blocos",
      value: totalBlocksInAllYears,
    },
    {
      label: "Mês aberto",
      value: monthNames[selectedMonth] || "—",
    },
  ]

  return (
    <section className="grid gap-4">
      <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h4 className="text-sm font-black text-slate-950">
            Calendário clínico
          </h4>

          <p className="mt-0.5 text-xs text-slate-500">
            Selecione um mês para ver as sessões registradas.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={onToggleYearMenu}
            className="inline-flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 lg:w-auto"
          >
            {selectedYear || "Sem ano"}
            <span className="text-slate-400">▾</span>
          </button>

          {isYearMenuOpen && (
            <div className="absolute right-0 z-20 mt-2 min-w-36 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => onSelectYear(year)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition ${
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
      </header>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12">
        {monthLabels.map((month) => {
          const monthSessions = getMonthSessions(yearGroup, month)

          return (
            <MonthCalendarCard
              key={month}
              month={month}
              sessions={monthSessions}
              isActive={selectedMonth === month}
              onClick={() => onSelectMonth(month)}
            />
          )
        })}
      </section>

      <section className="grid gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:grid-cols-5">
        {summaryItems.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {item.label}
            </p>

            <p className="mt-1 text-sm font-black text-slate-800">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-950">
              Sessões de {monthNames[selectedMonth]?.toLowerCase()}
            </h4>

            <p className="mt-0.5 text-xs text-slate-500">
              {selectedYear || "—"} • {sessions.length} sessão
              {sessions.length !== 1 ? "es" : ""} encontrada
              {sessions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </header>

        <div className="mt-3 grid gap-3">
          {sessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
              <p className="text-sm font-black text-slate-800">
                Nenhuma sessão registrada neste mês
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Quando houver sessões em {monthNames[selectedMonth]}, elas
                aparecerão aqui.
              </p>
            </div>
          ) : (
            sessions.map((session, index) => (
              <SessionRow
                key={session.id}
                session={session}
                sessionNumber={index + 1}
                onOpenSession={onOpenSession}
                onOpenBlock={onOpenBlock}
              />
            ))
          )}
        </div>
      </section>
    </section>
  )
}