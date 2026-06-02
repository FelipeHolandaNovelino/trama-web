import { useEffect, useState } from "react"

const colorByType = {
  "Marco positivo": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Evento traumático": "border-rose-200 bg-rose-50 text-rose-800",
  Insight: "border-amber-200 bg-amber-50 text-amber-800",
  Evento: "border-violet-200 bg-violet-50 text-violet-800",
  "Observação clínica": "border-blue-200 bg-blue-50 text-blue-800",
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

function CalendarIcon() {
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
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  )
}

function ConnectionIcon() {
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
      <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19.07" />
    </svg>
  )
}

/**
 * Metadado compacto da sessão.
 *
 * Substitui os cards grandes de Blocos, Conexões e Tipo por uma linha menor,
 * deixando o modal mais leve visualmente.
 */
function SessionMetaItem({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
      <strong className="font-black text-slate-800">{value}</strong>
      {label}
    </span>
  )
}

/**
 * Card compacto de bloco dentro da sessão.
 *
 * A linha inteira abre o bloco. Os botões internos interrompem o clique
 * para permitir editar e excluir sem abrir o modal do bloco por acidente.
 */
function SessionBlockCard({ block, onOpenBlock, onEditBlock, onDeleteBlock }) {
  const connectionsCount = block.connections?.length || 0
  const hasConnections = connectionsCount > 0

  function handleOpenBlock() {
    onOpenBlock(block)
  }

  function handleKeyboardOpen(event) {
    if (event.key === "Enter") {
      handleOpenBlock()
    }
  }

  function handleEditClick(event) {
    event.stopPropagation()
    onEditBlock(block)
  }

  function handleDeleteClick(event) {
    event.stopPropagation()
    onDeleteBlock(block.id)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpenBlock}
      onKeyDown={handleKeyboardOpen}
      className={`cursor-pointer rounded-2xl border px-4 py-3 outline-none transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-4 focus-visible:ring-violet-100 ${
        colorByType[block.type] || "border-slate-200 bg-slate-50 text-slate-800"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em]">
              {block.type}
            </span>

            {hasConnections && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold">
                <ConnectionIcon />
                {connectionsCount}
              </span>
            )}
          </div>

          <h4 className="mt-3 line-clamp-1 text-sm font-black text-slate-950">
            {block.title}
          </h4>

          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <CalendarIcon />
            {block.eventDate || block.date}
          </p>
        </div>

        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black text-slate-700">
          {block.intensity}/10
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
        {block.text}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(block.emotions || []).slice(0, 3).map((emotion) => (
          <span
            key={emotion}
            className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
          >
            {emotion}
          </span>
        ))}

        {(block.people || []).slice(0, 2).map((person) => (
          <span
            key={person}
            className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
          >
            {person}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-white/70 pt-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onOpenBlock(block)
          }}
          className="rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
        >
          Abrir
        </button>

        <button
          type="button"
          onClick={handleEditClick}
          className="rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={handleDeleteClick}
          className="rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Excluir
        </button>
      </div>
    </article>
  )
}

/**
 * Modal de visualização e gestão de uma sessão já criada.
 *
 * Permite revisar os blocos da sessão, editar dados da sessão, adicionar
 * novos blocos, abrir blocos existentes e excluir itens com confirmação externa.
 */
export function SessionModal({
  session,
  onClose,
  onOpenBlock,
  onEditBlock,
  onDeleteBlock,
  onAddBlockToSession,
  onUpdateSession,
  onDeleteSession,
}) {
  const [isEditingSession, setIsEditingSession] = useState(false)
  const [sessionTitle, setSessionTitle] = useState("")
  const [sessionSummary, setSessionSummary] = useState("")

  useEffect(() => {
    if (!session) return

    setSessionTitle(session.title || `Sessão em ${session.date}`)
    setSessionSummary(session.summary || "")
    setIsEditingSession(false)
  }, [session])

  if (!session) return null

  const sessionBlocks = session.blocks || []

  const totalConnections = sessionBlocks.reduce((total, block) => {
    return total + (block.connections?.length || 0)
  }, 0)

  function handleCancelEdit() {
    setSessionTitle(session.title || `Sessão em ${session.date}`)
    setSessionSummary(session.summary || "")
    setIsEditingSession(false)
  }

  function handleSaveSessionEdit() {
    if (!sessionTitle.trim()) {
      alert("O título da sessão não pode ficar vazio.")
      return
    }

    onUpdateSession(session.id, {
      title: sessionTitle.trim(),
      summary: sessionSummary.trim(),
    })

    setIsEditingSession(false)
  }

  function handleDeleteSession() {
    onDeleteSession(session.id)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-slate-50 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
                Sessão do paciente
              </p>

              {isEditingSession ? (
                <div className="mt-4 grid gap-3">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Título da sessão
                    </span>

                    <input
                      value={sessionTitle}
                      onChange={(event) => setSessionTitle(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Resumo da sessão
                    </span>

                    <textarea
                      rows={3}
                      value={sessionSummary}
                      onChange={(event) =>
                        setSessionSummary(event.target.value)
                      }
                      placeholder="Ex: sessão focada em limites, sobrecarga e conflitos familiares."
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    />
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleSaveSessionEdit}
                      className="rounded-2xl bg-violet-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-900"
                    >
                      Salvar sessão
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancelar edição
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    {session.title || `Sessão em ${session.date}`}
                  </h2>

                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <CalendarIcon />
                    {session.date}
                  </p>

                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                    {session.summary || "Esta sessão ainda não possui resumo."}
                  </p>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              aria-label="Fechar sessão"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <section className="border-b border-slate-200 bg-slate-50/60 px-6 py-2.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <SessionMetaItem
              label={sessionBlocks.length === 1 ? "bloco" : "blocos"}
              value={sessionBlocks.length}
            />

            <span className="text-slate-300">·</span>

            <SessionMetaItem
              label={totalConnections === 1 ? "conexão" : "conexões"}
              value={totalConnections}
            />

            <span className="text-slate-300">·</span>

            <span className="text-xs font-medium text-slate-500">
              Tipo:{" "}
              <strong className="font-semibold text-slate-700">
                Atendimento
              </strong>
            </span>
          </div>
        </section>

        <main className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {!isEditingSession && (
            <div className="mb-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingSession(true)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Editar sessão
              </button>

              <button
                type="button"
                onClick={() => onAddBlockToSession(session)}
                className="rounded-2xl bg-violet-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-900"
              >
                + Adicionar bloco
              </button>

              <button
                type="button"
                onClick={handleDeleteSession}
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Excluir sessão
              </button>
            </div>
          )}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-base font-black text-slate-950">
                  Blocos da sessão
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Abra um bloco para revisar a narrativa completa e suas
                  conexões.
                </p>
              </div>

              <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                {totalConnections} conexão{totalConnections !== 1 ? "ões" : ""}
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {sessionBlocks.length > 0 ? (
                sessionBlocks.map((block) => (
                  <SessionBlockCard
                    key={block.id}
                    block={block}
                    onOpenBlock={onOpenBlock}
                    onEditBlock={onEditBlock}
                    onDeleteBlock={onDeleteBlock}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center lg:col-span-2">
                  <p className="text-sm font-semibold text-slate-700">
                    Nenhum bloco registrado
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Adicione um bloco para começar a organizar esta sessão.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}