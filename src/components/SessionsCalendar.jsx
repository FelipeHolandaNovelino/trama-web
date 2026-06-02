function CalendarIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  )
}

function ChevronDownIcon({ isOpen = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function formatDate(dateValue) {
  if (!dateValue) return "Data não informada"

  if (dateValue.includes("/")) {
    return dateValue
  }

  const [year, month, day] = dateValue.split("-")

  if (!year || !month || !day) {
    return dateValue
  }

  return `${day}/${month}/${year}`
}

function getAvailableYears(timelineData = []) {
  return timelineData.map((yearGroup) => yearGroup.year).filter(Boolean)
}

function getCurrentYearGroup(timelineData = [], selectedYear) {
  return timelineData.find((yearGroup) => yearGroup.year === selectedYear)
}

function getCurrentMonthGroup(yearGroup, selectedMonth) {
  return yearGroup?.months?.find((monthGroup) => monthGroup.month === selectedMonth)
}

function getMonthSessions(monthGroup) {
  return monthGroup?.sessions || []
}

function getMonthBlocksCount(monthGroup) {
  return getMonthSessions(monthGroup).reduce((total, session) => {
    return total + (session.blocks?.length || 0)
  }, 0)
}

function getSessionConnectionsCount(session) {
  return (session.blocks || []).reduce((total, block) => {
    return total + (block.connections?.length || 0)
  }, 0)
}

function YearSelector({
  years,
  selectedYear,
  isYearMenuOpen,
  onToggleYearMenu,
  onSelectYear,
}) {
  return (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={onToggleYearMenu}
        className="flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-36"
      >
        <span>{selectedYear || "Ano"}</span>
        <ChevronDownIcon isOpen={isYearMenuOpen} />
      </button>

      {isYearMenuOpen && (
        <div className="absolute left-0 top-12 z-20 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-36">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => onSelectYear(year)}
              className={`block w-full px-4 py-2.5 text-left text-sm font-semibold transition ${
                selectedYear === year
                  ? "bg-violet-50 text-violet-800"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MonthButton({ monthGroup, isActive, onSelectMonth }) {
  const sessionsCount = getMonthSessions(monthGroup).length
  const blocksCount = getMonthBlocksCount(monthGroup)

  return (
    <button
      type="button"
      onClick={() => onSelectMonth(monthGroup.month)}
      className={`rounded-2xl border px-3 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
        isActive
          ? "border-violet-300 bg-violet-50 text-violet-900 shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/40"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-black">{monthGroup.month}</span>

        {sessionsCount > 0 && (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isActive
                ? "bg-violet-800 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {sessionsCount}
          </span>
        )}
      </div>

      <p className="mt-1 text-[11px] font-medium text-slate-400">
        {blocksCount} bloco{blocksCount !== 1 ? "s" : ""}
      </p>
    </button>
  )
}

function SessionCard({ session, onOpenSession }) {
  const blocksCount = session.blocks?.length || 0
  const connectionsCount = getSessionConnectionsCount(session)

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpenSession(session)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onOpenSession(session)
        }
      }}
      className="cursor-pointer rounded-3xl border border-slate-200 bg-white p-4 outline-none transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-sm focus-visible:ring-4 focus-visible:ring-violet-100"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
            <CalendarIcon className="h-3.5 w-3.5" />
            {formatDate(session.date)}
          </span>

          <h4 className="mt-3 line-clamp-2 text-sm font-black leading-snug text-slate-950 sm:line-clamp-1 sm:text-base">
            {session.title || `Sessão em ${formatDate(session.date)}`}
          </h4>
        </div>

        <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
          {blocksCount} bloco{blocksCount !== 1 ? "s" : ""}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
        {session.summary || "Sessão sem resumo registrado."}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
          {connectionsCount} conexão{connectionsCount !== 1 ? "ões" : ""}
        </span>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onOpenSession(session)
          }}
          className="ml-auto rounded-xl bg-violet-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-900"
        >
          Abrir sessão
        </button>
      </div>
    </article>
  )
}

/**
 * Calendário compacto de sessões.
 *
 * Mostra anos, meses e sessões do paciente. A responsividade prioriza leitura
 * em telas pequenas sem perder o formato compacto no desktop.
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
}) {
  const years = getAvailableYears(timelineData)
  const currentYearGroup = getCurrentYearGroup(timelineData, selectedYear)
  const months = currentYearGroup?.months || []
  const currentMonthGroup = getCurrentMonthGroup(currentYearGroup, selectedMonth)
  const sessions = getMonthSessions(currentMonthGroup)

  if (years.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
        <h3 className="text-base font-black text-slate-950">
          Nenhuma sessão registrada
        </h3>

        <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          Crie a primeira sessão para iniciar o calendário clínico deste
          paciente.
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-4">
      <header className="rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
              Calendário de sessões
            </p>

            <h3 className="mt-1 text-base font-black text-slate-950">
              {selectedYear || "Ano não selecionado"}
            </h3>
          </div>

          <YearSelector
            years={years}
            selectedYear={selectedYear}
            isYearMenuOpen={isYearMenuOpen}
            onToggleYearMenu={onToggleYearMenu}
            onSelectYear={onSelectYear}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12">
          {months.map((monthGroup) => (
            <MonthButton
              key={monthGroup.month}
              monthGroup={monthGroup}
              isActive={selectedMonth === monthGroup.month}
              onSelectMonth={onSelectMonth}
            />
          ))}
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
              {selectedMonth || "Mês"}
            </p>

            <h3 className="mt-1 text-base font-black text-slate-950">
              Sessões do mês
            </h3>
          </div>

          <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            {sessions.length} sessão{sessions.length !== 1 ? "ões" : ""}
          </span>
        </div>

        {sessions.length > 0 ? (
          <div className="mt-5 grid gap-3 xl:grid-cols-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onOpenSession={onOpenSession}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
            <p className="text-sm font-semibold text-slate-700">
              Nenhuma sessão neste mês
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Selecione outro mês ou crie uma nova sessão para este paciente.
            </p>
          </div>
        )}
      </section>
    </section>
  )
}