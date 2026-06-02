import { useEffect, useState } from "react"

import { ClinicalBlockCard } from "./ClinicalBlockCard"

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

/**
 * Metadado compacto da sessão.
 *
 * Mantém a leitura de quantidade de blocos e conexões sem ocupar espaço
 * com cards grandes no topo do modal.
 */
function SessionMetaItem({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
      <strong className="font-black text-slate-800">{value}</strong>
      {label}
    </span>
  )
}

function SessionActions({
  onEditSession,
  onAddBlockToSession,
  onDeleteSession,
  session,
}) {
  return (
    <div className="mb-4 grid gap-2 sm:mb-5 sm:flex sm:flex-wrap sm:justify-end">
      <button
        type="button"
        onClick={onEditSession}
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
        onClick={onDeleteSession}
        className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
      >
        Excluir sessão
      </button>
    </div>
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-0 py-0 sm:items-center sm:px-4 sm:py-4"
      onClick={onClose}
    >
      <div
        className="flex h-[96vh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-slate-50 shadow-2xl sm:max-h-[92vh] sm:max-w-5xl sm:rounded-[2rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
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

                  <div className="grid gap-2 sm:flex sm:flex-wrap">
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
                  <h2 className="mt-1 line-clamp-2 text-xl font-black tracking-tight text-slate-950 sm:mt-2 sm:text-2xl">
                    {session.title || `Sessão em ${session.date}`}
                  </h2>

                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <CalendarIcon />
                    {session.date}
                  </p>

                  <p className="mt-3 line-clamp-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:line-clamp-2">
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

        <section className="shrink-0 border-b border-slate-200 bg-slate-50/60 px-4 py-2.5 sm:px-6">
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

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {!isEditingSession && (
            <SessionActions
              session={session}
              onEditSession={() => setIsEditingSession(true)}
              onAddBlockToSession={onAddBlockToSession}
              onDeleteSession={handleDeleteSession}
            />
          )}

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-950">
                  Blocos da sessão
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Abra um bloco para revisar a narrativa completa e suas
                  conexões.
                </p>
              </div>

              <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                {totalConnections} conexão{totalConnections !== 1 ? "ões" : ""}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:mt-5 xl:grid-cols-2">
              {sessionBlocks.length > 0 ? (
                sessionBlocks.map((block) => (
                  <ClinicalBlockCard
                    key={block.id}
                    block={block}
                    onOpenBlock={onOpenBlock}
                    onEditBlock={onEditBlock}
                    onDeleteBlock={onDeleteBlock}
                    showActions
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center xl:col-span-2">
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