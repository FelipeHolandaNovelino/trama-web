import { useEffect, useState } from "react"

const colorByType = {
  "Marco positivo": "border-emerald-200 bg-emerald-50",
  "Evento traumático": "border-rose-200 bg-rose-50",
  Insight: "border-amber-200 bg-amber-50",
  Evento: "border-violet-200 bg-violet-50",
  "Observação clínica": "border-blue-200 bg-blue-50",
}

function SessionBlockCard({ block, onOpenBlock, onEditBlock, onDeleteBlock }) {
  const connectionsCount = block.connections?.length || 0
  const hasConnections = connectionsCount > 0

  return (
    <article
      className={`rounded-2xl border p-4 ${
        colorByType[block.type] || "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-slate-500">
              {block.type}
            </p>

            {hasConnections && (
              <span className="rounded-full bg-violet-700 px-2 py-0.5 text-[10px] font-semibold text-white">
                {connectionsCount} conexão
                {connectionsCount > 1 ? "ões" : ""}
              </span>
            )}
          </div>

          <h4 className="mt-1 font-semibold text-slate-900">{block.title}</h4>

          <p className="mt-1 text-xs text-slate-500">
            Acontecimento: {block.eventDate || block.date}
          </p>
        </div>

        <span className="rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700">
          {block.intensity}/10
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
        {block.text}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(block.emotions || []).slice(0, 4).map((emotion) => (
          <span
            key={emotion}
            className="rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700"
          >
            {emotion}
          </span>
        ))}

        {(block.people || []).slice(0, 3).map((person) => (
          <span
            key={person}
            className="rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700"
          >
            {person}
          </span>
        ))}
      </div>

      <div className="mt-4 flex justify-between gap-3">
        <button
          onClick={() => onOpenBlock(block)}
          className="rounded-xl bg-white/80 px-3 py-2 text-xs font-medium text-violet-700 hover:bg-violet-100"
        >
          Abrir bloco
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onEditBlock(block)}
            className="rounded-xl bg-white/80 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Editar
          </button>

          <button
            onClick={() => onDeleteBlock(block.id)}
            className="rounded-xl bg-white/80 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100"
          >
            Excluir
          </button>
        </div>
      </div>
    </article>
  )
}

export function SessionModal({
  session,
  onClose,
  onOpenBlock,
  onEditBlock,
  onDeleteBlock,
  onAddBlockToSession,
  onUpdateSession,
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

  const totalConnections = (session.blocks || []).reduce((total, block) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-6 py-6"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <p className="text-sm font-semibold text-violet-700">
              Sessão do paciente
            </p>

            {isEditingSession ? (
              <div className="mt-3 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Título da sessão
                  </span>

                  <input
                    type="text"
                    value={sessionTitle}
                    onChange={(event) => setSessionTitle(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Resumo da sessão
                  </span>

                  <textarea
                    rows="3"
                    value={sessionSummary}
                    onChange={(event) => setSessionSummary(event.target.value)}
                    className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                    placeholder="Ex: sessão focada em limites, sobrecarga e conflitos familiares."
                  />
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveSessionEdit}
                    className="rounded-2xl bg-violet-800 px-4 py-2 text-sm font-medium text-white hover:bg-violet-900"
                  >
                    Salvar sessão
                  </button>

                  <button
                    onClick={handleCancelEdit}
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar edição
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {session.title || `Sessão em ${session.date}`}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Data da sessão: {session.date}
                </p>

                {session.summary ? (
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">
                    {session.summary}
                  </p>
                ) : (
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-500">
                    Esta sessão ainda não possui resumo.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            {!isEditingSession && (
              <>
                <button
                  onClick={() => setIsEditingSession(true)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                >
                  Editar sessão
                </button>

                <button
                  onClick={() => onAddBlockToSession(session)}
                  className="rounded-full bg-violet-800 px-4 py-2 text-sm font-medium text-white hover:bg-violet-900"
                >
                  + Adicionar bloco
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Fechar
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">
              Blocos registrados
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {(session.blocks || []).length}
            </p>
          </div>

          <div className="rounded-3xl bg-violet-50 p-4">
            <p className="text-xs font-semibold text-violet-700">
              Conexões na sessão
            </p>
            <p className="mt-1 text-2xl font-bold text-violet-900">
              {totalConnections}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">
              Tipo de registro
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Atendimento clínico
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900">Blocos da sessão</h3>

              <p className="text-sm text-slate-500">
                Abra um bloco para ver narrativa completa e conexões.
              </p>
            </div>

            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800">
              {totalConnections} conexão{totalConnections !== 1 ? "ões" : ""}
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(session.blocks || []).map((block) => (
              <SessionBlockCard
                key={block.id}
                block={block}
                onOpenBlock={onOpenBlock}
                onEditBlock={onEditBlock}
                onDeleteBlock={onDeleteBlock}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}