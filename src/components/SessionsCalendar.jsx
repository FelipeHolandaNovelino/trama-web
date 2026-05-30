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

const dotColorByType = {
  "Marco positivo": "bg-emerald-400",
  "Evento traumático": "bg-rose-400",
  Insight: "bg-amber-400",
  Evento: "bg-violet-400",
  "Observação clínica": "bg-blue-400",
}

/**
 * Mantém compatibilidade com a estrutura antiga.
 * Antes, meses podiam guardar blocos diretamente; agora, guardam sessões.
 */
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

/**
 * Centraliza todos os blocos para alimentar contadores globais.
 */
function getAllBlocks(timelineData) {
  return timelineData
    .flatMap((yearGroup) =>
      yearGroup.months.flatMap((monthGroup) =>
        getSessionsFromMonth(monthGroup).flatMap((session) =>
          session.blocks || []
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

function getTotalBlocksFromSessions(sessions) {
  return sessions.reduce((total, session) => {
    return total + (session.blocks || []).length
  }, 0)
}

function getMostCommonBlockTypesFromSessions(sessions) {
  const blocks = sessions.flatMap((session) => session.blocks || [])

  return blocks.slice(0, 5).map((block) => block.type)
}

function MiniBlockCard({ block, onOpenBlock }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onOpenBlock(block)
      }}
      className={`min-w-[128px] rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm sm:min-w-[132px] ${
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
      type="button"
      onClick={onClick}
      className={`min-h-[130px] rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[150px] ${
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

/**
 * Linha de sessão acessível e clicável.
 * Usa <article role="button"> para permitir botões internos sem HTML inválido.
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
      className="block w-full cursor-pointer border-b border-slate-100 text-left transition last:border-b-0 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300 lg:grid lg:grid-cols-[88px_170px_1fr_44px] lg:items-stretch"
    >
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 lg:flex-col lg:justify-center lg:border-b-0 lg:border-r lg:px-4 lg:py-5">
        <div>
          <p className="text-2xl font-bold text-slate-900">
            {getDayFromDate(session.date)}
          </p>

          <p className="text-xs font-medium text-slate-500">
            {getMonthNumberFromDate(session.date)}
          </p>
        </div>

        <p className="text-xs text-slate-400">16:00</p>
      </div>

      <div className="border-b border-slate-100 px-4 py-4 lg:flex lg:flex-col lg:justify-center lg:border-b-0 lg:border-r lg:px-5 lg:py-5">
        <p className="text-sm font-semibold text-slate-900">
          {session.title || `Sessão ${sessionNumber}`}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {(session.blocks || []).length} bloco
          {(session.blocks || []).length > 1 ? "s" : ""} na sessão
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 py-4 lg:px-5">
        {(session.blocks || []).map((block) => (
          <MiniBlockCard key={block.id} block={block} onOpenBlock={onOpenBlock} />
        ))}
      </div>

      <div className="hidden items-center justify-center text-xl text-slate-400 lg:flex">
        ›
      </div>
    </article>
  )
}

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

  function handleSelectYear(year) {
    onSelectYear(year)
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Calendário clínico
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              Sessões por mês
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Clique em um mês para ver as sessões registradas.
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={onToggleYearMenu}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-lg font-bold text-slate-900 shadow-sm hover:bg-slate-50 sm:w-auto"
            >
              {selectedYear || "Sem ano"}
              <span className="text-sm text-slate-400">▾</span>
            </button>

            {isYearMenuOpen && (
              <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:left-auto sm:w-44">
                {years.map((year) => (
                  <button
                    type="button"
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

        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">
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