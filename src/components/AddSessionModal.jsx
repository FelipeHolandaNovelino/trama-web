import { useEffect, useState } from "react"

import {
  availableEmotions,
  availablePeople,
  availableTags,
} from "../data/sessionOptions"

function toggleItem(list, item) {
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

function BlockDraftEditor({
  block,
  index,
  totalBlocks,
  existingBlocks,
  initialBlock,
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
            Bloco {index + 1}
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {block.title || "Novo bloco narrativo"}
          </h3>
        </div>

        {totalBlocks > 1 && (
          <button
            onClick={onRemove}
            className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
          >
            Remover
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Data do acontecimento
          </span>

          <input
            type="date"
            value={block.eventDate}
            onChange={(event) => updateField("eventDate", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
          />

          <p className="text-xs text-slate-500">
            Quando isso aconteceu na vida do paciente.
          </p>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Tipo do bloco
          </span>

          <select
            value={block.type}
            onChange={(event) => updateField("type", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
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
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
        />
      </label>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-slate-700">
          Bloco narrativo
        </span>

        <textarea
          rows="4"
          value={block.text}
          onChange={(event) => updateField("text", event.target.value)}
          placeholder="Escreva o que surgiu na sessão..."
          className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
        />
      </label>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Emoções</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {availableEmotions.map((emotion) => {
              const isSelected = block.emotions.includes(emotion)

              return (
                <button
                  key={emotion}
                  onClick={() => toggleDraftItem("emotions", emotion)}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    isSelected
                      ? "bg-violet-800 text-white"
                      : "bg-white text-slate-700 hover:bg-violet-100 hover:text-violet-800"
                  }`}
                >
                  {emotion}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">
            Pessoas relacionadas
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {availablePeople.map((person) => {
              const isSelected = block.people.includes(person)

              return (
                <button
                  key={person}
                  onClick={() => toggleDraftItem("people", person)}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    isSelected
                      ? "bg-violet-800 text-white"
                      : "bg-white text-slate-700 hover:bg-violet-100 hover:text-violet-800"
                  }`}
                >
                  {person}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">Tags clínicas</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = block.tags.includes(tag)

            return (
              <button
                key={tag}
                onClick={() => toggleDraftItem("tags", tag)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  isSelected
                    ? "bg-violet-800 text-white"
                    : "bg-white text-slate-700 hover:bg-violet-100 hover:text-violet-800"
                }`}
              >
                #{tag}
              </button>
            )
          })}
        </div>
      </div>

      <label className="mt-4 block space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
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

      <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
        <p className="text-sm font-semibold text-violet-900">
          Conectar a evento anterior
        </p>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Evento relacionado
          </span>

          <select
            value={block.connectedBlockId}
            onChange={(event) =>
              updateField("connectedBlockId", event.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
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
      </div>
    </div>
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
}) {
  const [sessionDate, setSessionDate] = useState("")
  const [sessionSummary, setSessionSummary] = useState("")
  const [blocks, setBlocks] = useState([createEmptyBlockDraft()])

  const isEditingBlock = Boolean(initialBlock)
  const isAddingBlockToExistingSession = Boolean(targetSession)

  useEffect(() => {
    if (!isOpen) return

    if (initialBlock) {
      setSessionDate(formatDateToInput(initialBlock.sessionDate || initialBlock.date))
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
      tags: block.tags,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-6 py-6"
      onClick={handleClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] bg-slate-50 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[320px_1fr]">
          <aside className="bg-gradient-to-b from-violet-800 to-slate-950 p-7 text-white">
            <p className="text-sm font-semibold text-violet-200">
              {isEditingBlock
                ? "Editar bloco"
                : isAddingBlockToExistingSession
                ? "Adicionar bloco"
                : "Nova sessão"}
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight">
              {isEditingBlock
                ? "Atualizar bloco narrativo"
                : isAddingBlockToExistingSession
                ? "Adicionar bloco nesta sessão"
                : "Registrar sessão com múltiplos blocos"}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-violet-100">
              A sessão representa o momento do atendimento. Os blocos representam
              os acontecimentos, insights e observações relatadas dentro dela.
            </p>

            <div className="mt-8 rounded-3xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-violet-200">
                Estrutura
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl bg-white/10 p-3">
                  Data da sessão: {sessionDate || "não definida"}
                </div>

                <div className="rounded-2xl bg-white/10 p-3">
                  {blocks.length} bloco{blocks.length > 1 ? "s" : ""} em edição
                </div>

                <div className="rounded-2xl bg-white/10 p-3">
                  Espelho usa a data do acontecimento
                </div>
              </div>
            </div>
          </aside>

          <div className="min-h-0 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {isEditingBlock
                    ? "Editar bloco"
                    : isAddingBlockToExistingSession
                    ? "Novo bloco para sessão existente"
                    : "Dados da sessão"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Organize o atendimento e adicione os blocos narrativos.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Fechar
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Data da sessão
                </span>

                <input
                  type="date"
                  value={sessionDate}
                  disabled={isAddingBlockToExistingSession}
                  onChange={(event) => setSessionDate(event.target.value)}
                  className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 ${
                    isAddingBlockToExistingSession
                      ? "cursor-not-allowed bg-slate-100 text-slate-500"
                      : ""
                  }`}
                />

                <p className="text-xs text-slate-500">
                  Quando o paciente relatou esses conteúdos.
                </p>
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
                  className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 ${
                    isAddingBlockToExistingSession
                      ? "cursor-not-allowed bg-slate-100 text-slate-500"
                      : ""
                  }`}
                />
              </label>
            </div>

            <div className="mt-6 space-y-5">
              {blocks.map((block, index) => (
                <BlockDraftEditor
                  key={block.id}
                  block={block}
                  index={index}
                  totalBlocks={blocks.length}
                  existingBlocks={existingBlocks}
                  initialBlock={initialBlock}
                  onChange={(updatedBlock) => updateBlock(index, updatedBlock)}
                  onRemove={() => removeBlock(index)}
                />
              ))}
            </div>

            {!isEditingBlock && !isAddingBlockToExistingSession && (
              <button
                onClick={addBlock}
                className="mt-5 w-full rounded-3xl border border-dashed border-violet-300 bg-white px-5 py-4 text-sm font-semibold text-violet-800 hover:bg-violet-50"
              >
                + Adicionar outro bloco à sessão
              </button>
            )}

            <div className="sticky bottom-0 mt-6 flex justify-end gap-3 border-t border-slate-200 bg-slate-50/95 py-4 backdrop-blur">
              <button
                onClick={handleClose}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-medium text-white hover:bg-violet-900"
              >
                {isEditingBlock
                  ? "Salvar alterações"
                  : isAddingBlockToExistingSession
                  ? "Adicionar bloco"
                  : "Salvar sessão"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}