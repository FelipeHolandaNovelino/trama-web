import { useEffect, useState } from "react"

import { availableEmotions } from "../data/sessionOptions"

function toggleItem(list = [], item) {
  if (list.includes(item)) {
    return list.filter((currentItem) => currentItem !== item)
  }

  return [...list, item]
}

function formatDateToInput(dateString) {
  if (!dateString) return ""

  if (dateString.includes("-")) {
    return dateString
  }

  const [day, month, year] = dateString.split("/")

  return `${year}-${month}-${day}`
}

/**
 * Cria um rascunho vazio de bloco.
 *
 * Tags permanecem como array vazio para compatibilidade com a estrutura atual,
 * mas não são mais exibidas no modal.
 */
function createEmptyBlockDraft() {
  return {
    id: `draft-${Date.now()}-${Math.random()}`,
    type: "Evento",
    title: "",
    eventDate: "",
    text: "",
    emotions: [],
    people: [],
    tags: [],
    intensity: 5,
    connectedBlockId: "",
    connectionStrength: "moderada",
    connectionReason: "",
  }
}

/**
 * Converte um bloco existente em rascunho editável.
 *
 * Tags antigas são preservadas internamente para evitar perda de dados
 * ao editar blocos criados antes da remoção visual das tags.
 */
function createDraftFromBlock(block) {
  const firstConnection = block.connections?.[0]

  return {
    id: block.id,
    type: block.type || "Evento",
    title: block.title || "",
    eventDate: formatDateToInput(block.eventDate || block.date),
    text: block.text || "",
    emotions: block.emotions || [],
    people: block.people || [],
    tags: block.tags || [],
    intensity: block.intensity || 5,
    connectedBlockId: firstConnection?.targetBlockId || "",
    connectionStrength: firstConnection?.strength || "moderada",
    connectionReason: firstConnection?.reason || "",
  }
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

function PlusIcon() {
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
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

/**
 * Lista expansiva de múltipla seleção.
 *
 * Usada para Emoções e Relações. Mantém a tela limpa e só mostra as opções
 * quando o usuário decide abrir a lista.
 */
function CollapsibleOptionList({
  label,
  description,
  options,
  selectedOptions,
  emptyMessage = "Nenhuma opção disponível.",
  onToggle,
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800">{label}</p>

          {description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            {selectedOptions.length}
          </span>

          <span
            className={`text-sm text-slate-400 transition ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </div>
      </button>

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-3">
          {selectedOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 transition hover:bg-violet-200"
              title="Remover seleção"
            >
              {option} ×
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="border-t border-slate-100 px-4 py-3">
          {options.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              {emptyMessage}
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {options.map((option) => {
                const isSelected = selectedOptions.includes(option)

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onToggle(option)}
                    className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition ${
                      isSelected
                        ? "border-violet-700 bg-violet-800 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800"
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

/**
 * Editor visual de um bloco narrativo.
 *
 * O componente concentra os campos do bloco, mantendo a sessão mais limpa.
 */
function BlockDraftEditor({
  block,
  index,
  totalBlocks,
  existingBlocks,
  initialBlock,
  relationshipOptions,
  onChange,
  onRemove,
}) {
  const selectedConnectedBlock = existingBlocks.find(
    (existingBlock) => existingBlock.id === block.connectedBlockId
  )

  const availableConnectionBlocks = existingBlocks.filter(
    (existingBlock) => existingBlock.id !== initialBlock?.id
  )

  function updateField(fieldName, value) {
    onChange({
      ...block,
      [fieldName]: value,
    })
  }

  function toggleDraftItem(fieldName, item) {
    updateField(fieldName, toggleItem(block[fieldName], item))
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
            Bloco {index + 1}
          </p>

          <h4 className="mt-1 text-lg font-black text-slate-950">
            {block.title || "Novo bloco narrativo"}
          </h4>
        </div>

        {totalBlocks > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Remover
          </button>
        )}
      </header>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Data do acontecimento
          </span>

          <input
            type="date"
            value={block.eventDate}
            onChange={(event) => updateField("eventDate", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Tipo do bloco
          </span>

          <select
            value={block.type}
            onChange={(event) => updateField("type", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          >
            <option>Evento</option>
            <option>Insight</option>
            <option>Marco positivo</option>
            <option>Evento traumático</option>
            <option>Observação clínica</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-slate-700">
          Título do bloco
        </span>

        <input
          type="text"
          value={block.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Ex: Discussão com o chefe"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        />
      </label>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-slate-700">
          Bloco narrativo
        </span>

        <textarea
          rows={4}
          value={block.text}
          onChange={(event) => updateField("text", event.target.value)}
          placeholder="Escreva o que surgiu na sessão..."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        />
      </label>

      <div className="mt-4 grid gap-3">
        <CollapsibleOptionList
          label="Emoções"
          description="Abra para selecionar as emoções associadas ao bloco."
          options={availableEmotions}
          selectedOptions={block.emotions}
          onToggle={(emotion) => toggleDraftItem("emotions", emotion)}
        />

        <CollapsibleOptionList
          label="Relações"
          description="Abra para selecionar relacionamentos cadastrados no perfil deste paciente."
          options={relationshipOptions}
          selectedOptions={block.people}
          emptyMessage="Nenhum relacionamento cadastrado no perfil do paciente."
          onToggle={(person) => toggleDraftItem("people", person)}
        />
      </div>

      <label className="mt-4 block space-y-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-700">
            Intensidade emocional
          </span>

          <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800">
            {block.intensity}/10
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          value={block.intensity}
          onChange={(event) =>
            updateField("intensity", Number(event.target.value))
          }
          className="w-full"
        />
      </label>

      <section className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
        <div>
          <p className="text-sm font-bold text-violet-900">
            Conectar a evento anterior
          </p>

          <p className="mt-0.5 text-xs text-violet-700/70">
            Use quando este bloco retoma ou aprofunda um acontecimento já
            registrado.
          </p>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Evento relacionado
          </span>

          <select
            value={block.connectedBlockId}
            onChange={(event) =>
              updateField("connectedBlockId", event.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          >
            <option value="">Nenhum evento conectado</option>

            {availableConnectionBlocks.map((existingBlock) => (
              <option key={existingBlock.id} value={existingBlock.id}>
                {existingBlock.title} —{" "}
                {existingBlock.eventDate || existingBlock.date}
              </option>
            ))}
          </select>
        </label>

        {block.connectedBlockId && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Força da ligação
              </span>

              <select
                value={block.connectionStrength}
                onChange={(event) =>
                  updateField("connectionStrength", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              >
                <option value="leve">Leve</option>
                <option value="moderada">Moderada</option>
                <option value="forte">Forte</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Motivo da conexão
              </span>

              <input
                type="text"
                value={block.connectionReason}
                onChange={(event) =>
                  updateField("connectionReason", event.target.value)
                }
                placeholder="Ex: repetição de sobrecarga"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>
          </div>
        )}

        {selectedConnectedBlock && block.connectionReason && (
          <div className="mt-4 rounded-2xl bg-white p-3 text-sm text-slate-600">
            Conectado a{" "}
            <strong className="text-slate-900">
              {selectedConnectedBlock.title}
            </strong>{" "}
            com ligação <strong>{block.connectionStrength}</strong>.
          </div>
        )}
      </section>
    </section>
  )
}

export function AddSessionModal({
  isOpen,
  onClose,
  onSaveBlock,
  onSaveSession,
  onSaveBlockToExistingSession,
  existingBlocks = [],
  initialBlock = null,
  targetSession = null,
  relationshipOptions = [],
}) {
  const [sessionDate, setSessionDate] = useState("")
  const [sessionSummary, setSessionSummary] = useState("")
  const [blocks, setBlocks] = useState([createEmptyBlockDraft()])

  const isEditingBlock = Boolean(initialBlock)
  const isAddingBlockToExistingSession = Boolean(targetSession)

  useEffect(() => {
    if (!isOpen) return

    if (initialBlock) {
      setSessionDate(
        formatDateToInput(initialBlock.sessionDate || initialBlock.date)
      )
      setSessionSummary("")
      setBlocks([createDraftFromBlock(initialBlock)])
      return
    }

    if (targetSession) {
      setSessionDate(formatDateToInput(targetSession.date))
      setSessionSummary(targetSession.summary || "")
      setBlocks([createEmptyBlockDraft()])
      return
    }

    resetForm()
  }, [isOpen, initialBlock, targetSession])

  if (!isOpen) return null

  function resetForm() {
    setSessionDate("")
    setSessionSummary("")
    setBlocks([createEmptyBlockDraft()])
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  function updateBlock(index, updatedBlock) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block, currentIndex) =>
        currentIndex === index ? updatedBlock : block
      )
    )
  }

  function addBlock() {
    setBlocks((currentBlocks) => [...currentBlocks, createEmptyBlockDraft()])
  }

  function removeBlock(indexToRemove) {
    setBlocks((currentBlocks) =>
      currentBlocks.filter((_, index) => index !== indexToRemove)
    )
  }

  function validateBlocks() {
    return blocks.every(
      (block) => block.eventDate && block.title.trim() && block.text.trim()
    )
  }

  /**
   * Prepara o bloco final para salvar na timeline.
   *
   * Tags não são mais preenchidas visualmente.
   * Blocos novos recebem tags vazias; blocos antigos preservam tags existentes.
   */
  function prepareBlock(block) {
    const selectedConnectedBlock = existingBlocks.find(
      (existingBlock) => existingBlock.id === block.connectedBlockId
    )

    const connections =
      selectedConnectedBlock && block.connectionReason.trim()
        ? [
            {
              targetBlockId: selectedConnectedBlock.id,
              targetTitle: selectedConnectedBlock.title,
              strength: block.connectionStrength,
              reason: block.connectionReason,
            },
          ]
        : []

    return {
      id: initialBlock?.id || `block-${Date.now()}-${Math.random()}`,
      type: block.type,
      title: block.title,
      sessionDate,
      eventDate: block.eventDate,
      date: block.eventDate,
      text: block.text,
      emotions: block.emotions,
      people: block.people,
      tags: block.tags || [],
      intensity: block.intensity,
      connections,
    }
  }

  function handleSave() {
    if (!sessionDate) {
      alert("Preencha a data da sessão.")
      return
    }

    if (!validateBlocks()) {
      alert(
        "Todos os blocos precisam ter data do acontecimento, título e texto narrativo."
      )
      return
    }

    if (isEditingBlock) {
      onSaveBlock(prepareBlock(blocks[0]))
      resetForm()
      onClose()
      return
    }

    if (isAddingBlockToExistingSession) {
      onSaveBlockToExistingSession(targetSession.id, prepareBlock(blocks[0]))
      resetForm()
      onClose()
      return
    }

    const preparedBlocks = blocks.map((block) => prepareBlock(block))

    const sessionData = {
      id: `session-${Date.now()}`,
      date: sessionDate,
      title: `Sessão em ${sessionDate}`,
      summary:
        sessionSummary ||
        `${preparedBlocks.length} bloco${
          preparedBlocks.length > 1 ? "s" : ""
        } registrado${preparedBlocks.length > 1 ? "s" : ""}.`,
      blocks: preparedBlocks,
    }

    onSaveSession(sessionData)
    resetForm()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-4"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-slate-50 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
                {isEditingBlock
                  ? "Editar bloco"
                  : isAddingBlockToExistingSession
                    ? "Adicionar bloco"
                    : "Nova sessão"}
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {isEditingBlock
                  ? "Atualizar bloco narrativo"
                  : isAddingBlockToExistingSession
                    ? "Adicionar bloco à sessão"
                    : "Registrar sessão"}
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
                Organize a sessão e registre blocos narrativos com emoções,
                relações e conexões clínicas.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              aria-label="Fechar modal"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Data da sessão
                </span>

                <input
                  type="date"
                  value={sessionDate}
                  disabled={isAddingBlockToExistingSession}
                  onChange={(event) => setSessionDate(event.target.value)}
                  className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${
                    isAddingBlockToExistingSession
                      ? "cursor-not-allowed bg-slate-100 text-slate-500"
                      : ""
                  }`}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Resumo da sessão
                </span>

                <input
                  type="text"
                  value={sessionSummary}
                  disabled={isAddingBlockToExistingSession}
                  onChange={(event) => setSessionSummary(event.target.value)}
                  placeholder="Ex: limites, sobrecarga e relação com o trabalho"
                  className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${
                    isAddingBlockToExistingSession
                      ? "cursor-not-allowed bg-slate-100 text-slate-500"
                      : ""
                  }`}
                />
              </label>
            </div>
          </section>

          <div className="mt-5 space-y-5">
            {blocks.map((block, index) => (
              <BlockDraftEditor
                key={block.id}
                block={block}
                index={index}
                totalBlocks={blocks.length}
                existingBlocks={existingBlocks}
                initialBlock={initialBlock}
                relationshipOptions={relationshipOptions}
                onChange={(updatedBlock) => updateBlock(index, updatedBlock)}
                onRemove={() => removeBlock(index)}
              />
            ))}
          </div>

          {!isEditingBlock && !isAddingBlockToExistingSession && (
            <button
              type="button"
              onClick={addBlock}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-3xl border border-dashed border-violet-300 bg-white px-5 py-4 text-sm font-semibold text-violet-800 transition hover:bg-violet-50"
            >
              <PlusIcon />
              Adicionar outro bloco à sessão
            </button>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-900"
          >
            {isEditingBlock
              ? "Salvar alterações"
              : isAddingBlockToExistingSession
                ? "Adicionar bloco"
                : "Salvar sessão"}
          </button>
        </footer>
      </div>
    </div>
  )
}