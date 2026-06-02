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

function InfoPill({ children, className = "" }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold shadow-sm sm:px-3 sm:text-xs ${className}`}
    >
      {children}
    </span>
  )
}

function ChipList({ title, icon, items = [], tone = "violet", emptyLabel }) {
  const chipClassName =
    tone === "indigo"
      ? "text-indigo-800"
      : "text-violet-800"

  return (
    <div className="min-w-0">
      <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
        {icon}
        {title}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {items.length > 0 ? (
          items.slice(0, 4).map((item) => (
            <span
              key={item}
              className={`max-w-full truncate rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold shadow-sm ${chipClassName}`}
              title={item}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400">{emptyLabel}</span>
        )}

        {items.length > 4 && (
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-500 shadow-sm">
            +{items.length - 4}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Card clínico padronizado para blocos da timeline.
 *
 * Usado nos modos Sessões, Emoções, Relações e Espelho. A responsividade foi
 * pensada para manter o card legível em celular sem quebrar o layout.
 */
export function ClinicalBlockCard({
  block,
  onOpenBlock,
  onEditBlock,
  onDeleteBlock,
  showActions = true,
}) {
  const connectionsCount = block.connections?.length || 0
  const hasConnections = connectionsCount > 0
  const intensity = Number(block.intensity || 0)
  const isHighIntensity = intensity >= 8
  const typeStyle = colorByType[block.type] || fallbackTypeStyle

  function handleOpenBlock() {
    onOpenBlock?.(block)
  }

  function handleKeyboardOpen(event) {
    if (event.key === "Enter") {
      handleOpenBlock()
    }
  }

  function handleEditClick(event) {
    event.stopPropagation()
    onEditBlock?.(block)
  }

  function handleDeleteClick(event) {
    event.stopPropagation()
    onDeleteBlock?.(block.id)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpenBlock}
      onKeyDown={handleKeyboardOpen}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-3 outline-none transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-sm focus-visible:ring-4 focus-visible:ring-violet-100 sm:rounded-3xl sm:p-4 ${typeStyle.card}`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-1 sm:w-1.5 ${typeStyle.accent}`}
        aria-hidden="true"
      />

      <div className="pl-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <InfoPill className="text-slate-500">
                <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {formatDate(block.eventDate || block.date)}
                </span>
              </InfoPill>

              {block.type && (
                <InfoPill className={typeStyle.pill}>
                  <span className="truncate">{block.type}</span>
                </InfoPill>
              )}

              {hasConnections && (
                <InfoPill className="bg-indigo-100 text-indigo-800">
                  <ConnectionIcon className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {connectionsCount} conexão
                    {connectionsCount !== 1 ? "ões" : ""}
                  </span>
                </InfoPill>
              )}
            </div>

            <h4 className="mt-3 line-clamp-2 text-sm font-black leading-snug text-slate-950 sm:line-clamp-1 sm:text-base">
              {block.title || "Acontecimento sem título"}
            </h4>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-black shadow-sm sm:shrink-0 ${
              isHighIntensity
                ? "bg-violet-800 text-white"
                : "bg-white/80 text-slate-700"
            }`}
          >
            {intensity || "—"}/10
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {block.text || "Sem narrativa registrada."}
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <ChipList
            title="Emoções"
            icon={<HeartIcon className="h-3.5 w-3.5 shrink-0" />}
            items={block.emotions || []}
            tone="violet"
            emptyLabel="Nenhuma emoção registrada"
          />

          <ChipList
            title="Relações"
            icon={<UsersIcon className="h-3.5 w-3.5 shrink-0" />}
            items={block.people || []}
            tone="indigo"
            emptyLabel="Nenhuma relação registrada"
          />
        </div>

        {showActions && (
          <div className="mt-4 grid grid-cols-1 gap-2 border-t border-white/70 pt-3 sm:flex sm:flex-wrap sm:justify-end">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                handleOpenBlock()
              }}
              className="rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
            >
              Abrir
            </button>

            {onEditBlock && (
              <button
                type="button"
                onClick={handleEditClick}
                className="rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Editar
              </button>
            )}

            {onDeleteBlock && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Excluir
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}