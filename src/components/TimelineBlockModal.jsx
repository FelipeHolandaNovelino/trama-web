const colorByType = {
  "Marco positivo": {
    card: "border-emerald-200 bg-emerald-50/70",
    pill: "bg-emerald-100 text-emerald-800",
    accent: "bg-emerald-500",
  },
  "Evento traumático": {
    card: "border-rose-200 bg-rose-50/70",
    pill: "bg-rose-100 text-rose-800",
    accent: "bg-rose-500",
  },
  Insight: {
    card: "border-amber-200 bg-amber-50/70",
    pill: "bg-amber-100 text-amber-800",
    accent: "bg-amber-500",
  },
  Evento: {
    card: "border-violet-200 bg-violet-50/70",
    pill: "bg-violet-100 text-violet-800",
    accent: "bg-violet-500",
  },
  "Observação clínica": {
    card: "border-sky-200 bg-sky-50/70",
    pill: "bg-sky-100 text-sky-800",
    accent: "bg-sky-500",
  },
}

const fallbackTypeStyle = {
  card: "border-slate-200 bg-white",
  pill: "bg-slate-100 text-slate-700",
  accent: "bg-slate-400",
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

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

function HeartIcon({ className = "h-4 w-4" }) {
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  )
}

function UsersIcon({ className = "h-4 w-4" }) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ConnectionIcon({ className = "h-4 w-4" }) {
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
      <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19.07" />
    </svg>
  )
}

/**
 * Formata datas salvas como YYYY-MM-DD para DD/MM/YYYY.
 */
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

function InfoPill({ icon, label, value }) {
  if (!value) return null

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
      {icon}
      <span className="text-slate-400">{label}:</span>
      <strong className="font-bold text-slate-800">{value}</strong>
    </span>
  )
}

function ChipGroup({ title, icon, items = [], tone = "violet", emptyLabel }) {
  const toneClassName =
    tone === "indigo"
      ? "bg-indigo-50 text-indigo-700"
      : "bg-violet-50 text-violet-700"

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {icon}
        {title}
      </p>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClassName}`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">{emptyLabel}</p>
      )}
    </section>
  )
}

function ConnectionCard({ connection, onOpenConnectedBlock }) {
  function handleOpenConnection() {
    if (!connection?.targetBlockId) return

    onOpenConnectedBlock(connection.targetBlockId)
  }

  return (
    <button
      type="button"
      onClick={handleOpenConnection}
      className="w-full rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
            <ConnectionIcon className="h-3.5 w-3.5" />
            Conexão clínica
          </p>

          <h4 className="mt-2 line-clamp-1 text-sm font-black text-slate-950">
            {connection.targetTitle || "Bloco conectado"}
          </h4>
        </div>

        {connection.strength && (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm">
            {connection.strength}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {connection.reason || "Conexão sem motivo descrito."}
      </p>
    </button>
  )
}

/**
 * Modal de leitura completa de um bloco clínico.
 *
 * É aberto a partir da timeline, do espelho, dos agrupamentos e de sessões.
 * Mantém foco em leitura clínica: acontecimento, narrativa, emoções, relações
 * e conexões com outros blocos.
 */
export function TimelineBlockModal({
  block,
  onClose,
  onOpenConnectedBlock = () => {},
}) {
  if (!block) return null

  const typeStyle = colorByType[block.type] || fallbackTypeStyle
  const connections = block.connections || []
  const intensity = Number(block.intensity || 0)
  const isHighIntensity = intensity >= 8

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-4"
      onClick={onClose}
    >
      <article
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-slate-50 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header
          className={`relative overflow-hidden border-b px-6 py-5 ${typeStyle.card}`}
        >
          <span
            className={`absolute left-0 top-0 h-full w-1.5 ${typeStyle.accent}`}
            aria-hidden="true"
          />

          <div className="pl-2">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
                    Acontecimento clínico
                  </p>

                  {block.type && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${typeStyle.pill}`}
                    >
                      {block.type}
                    </span>
                  )}

                  {connections.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 shadow-sm">
                      <ConnectionIcon className="h-3.5 w-3.5" />
                      {connections.length} conexão
                      {connections.length !== 1 ? "ões" : ""}
                    </span>
                  )}
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                  {block.title || "Acontecimento sem título"}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  <InfoPill
                    icon={<CalendarIcon className="h-3.5 w-3.5" />}
                    label="Acontecimento"
                    value={formatDate(block.eventDate || block.date)}
                  />

                  <InfoPill
                    icon={<CalendarIcon className="h-3.5 w-3.5" />}
                    label="Sessão"
                    value={formatDate(block.sessionDate)}
                  />

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black shadow-sm ${
                      isHighIntensity
                        ? "bg-violet-800 text-white"
                        : "bg-white/80 text-slate-700"
                    }`}
                  >
                    Intensidade {intensity || "—"}/10
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-500 transition hover:bg-white hover:text-slate-900"
                aria-label="Fechar acontecimento"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Narrativa
            </p>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
              {block.text || "Nenhuma narrativa registrada para este bloco."}
            </p>
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-2">
            <ChipGroup
              title="Emoções"
              icon={<HeartIcon className="h-3.5 w-3.5" />}
              items={block.emotions || []}
              tone="violet"
              emptyLabel="Nenhuma emoção registrada."
            />

            <ChipGroup
              title="Relações"
              icon={<UsersIcon className="h-3.5 w-3.5" />}
              items={block.people || []}
              tone="indigo"
              emptyLabel="Nenhuma relação registrada."
            />
          </section>

          <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Conexões clínicas
                </p>

                <h3 className="mt-1 text-base font-black text-slate-950">
                  Blocos relacionados
                </h3>
              </div>

              <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {connections.length} conexão
                {connections.length !== 1 ? "ões" : ""}
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {connections.length > 0 ? (
                connections.map((connection) => (
                  <ConnectionCard
                    key={`${connection.targetBlockId}-${connection.reason}`}
                    connection={connection}
                    onOpenConnectedBlock={onOpenConnectedBlock}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-5 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    Nenhuma conexão registrada
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Conexões aparecerão aqui quando este bloco for relacionado a
                    outros acontecimentos.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="flex justify-end border-t border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-900"
          >
            Fechar
          </button>
        </footer>
      </article>
    </div>
  )
}