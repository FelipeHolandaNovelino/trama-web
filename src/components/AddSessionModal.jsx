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

export function AddSessionModal({
  isOpen,
  onClose,
  onSaveBlock,
  existingBlocks = [],
  initialBlock = null,
}) {
  const [sessionDate, setSessionDate] = useState("")
  const [blockType, setBlockType] = useState("Evento")
  const [blockTitle, setBlockTitle] = useState("")
  const [narrativeText, setNarrativeText] = useState("")
  const [selectedEmotions, setSelectedEmotions] = useState([])
  const [selectedPeople, setSelectedPeople] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [intensity, setIntensity] = useState(5)
  const [connectedBlockId, setConnectedBlockId] = useState("")
  const [connectionStrength, setConnectionStrength] = useState("moderada")
  const [connectionReason, setConnectionReason] = useState("")

  useEffect(() => {
    if (!isOpen) return

    if (!initialBlock) {
      resetForm()
      return
    }

    const firstConnection = initialBlock.connections?.[0]

    setSessionDate(formatDateToInput(initialBlock.date))
    setBlockType(initialBlock.type)
    setBlockTitle(initialBlock.title)
    setNarrativeText(initialBlock.text)
    setSelectedEmotions(initialBlock.emotions || [])
    setSelectedPeople(initialBlock.people || [])
    setSelectedTags(initialBlock.tags || [])
    setIntensity(initialBlock.intensity || 5)
    setConnectedBlockId(firstConnection?.targetBlockId || "")
    setConnectionStrength(firstConnection?.strength || "moderada")
    setConnectionReason(firstConnection?.reason || "")
  }, [isOpen, initialBlock])

  const selectedConnectedBlock = existingBlocks.find(
    (block) => block.id === connectedBlockId
  )

  const availableConnectionBlocks = existingBlocks.filter(
    (block) => block.id !== initialBlock?.id
  )

  if (!isOpen) return null

  function resetForm() {
    setSessionDate("")
    setBlockType("Evento")
    setBlockTitle("")
    setNarrativeText("")
    setSelectedEmotions([])
    setSelectedPeople([])
    setSelectedTags([])
    setIntensity(5)
    setConnectedBlockId("")
    setConnectionStrength("moderada")
    setConnectionReason("")
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  function handleSaveBlock() {
    if (!sessionDate || !blockTitle.trim() || !narrativeText.trim()) {
      alert("Preencha a data, o título e o texto do bloco narrativo.")
      return
    }

    const connections =
      selectedConnectedBlock && connectionReason.trim()
        ? [
            {
              targetBlockId: selectedConnectedBlock.id,
              targetTitle: selectedConnectedBlock.title,
              strength: connectionStrength,
              reason: connectionReason,
            },
          ]
        : []

    const blockData = {
      id: initialBlock?.id || `block-${Date.now()}`,
      type: blockType,
      title: blockTitle,
      date: sessionDate,
      text: narrativeText,
      emotions: selectedEmotions,
      people: selectedPeople,
      tags: selectedTags,
      intensity,
      connections,
    }

    onSaveBlock(blockData)
    resetForm()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-violet-700">
              {initialBlock ? "Editar bloco" : "Nova sessão"}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {initialBlock
                ? "Editar bloco narrativo"
                : "Registrar sessão do paciente"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Crie ou atualize blocos narrativos que alimentam a timeline, os
              padrões emocionais e as relações importantes.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
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
              onChange={(event) => setSessionDate(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Tipo do bloco
            </span>

            <select
              value={blockType}
              onChange={(event) => setBlockType(event.target.value)}
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
            value={blockTitle}
            onChange={(event) => setBlockTitle(event.target.value)}
            placeholder="Ex: Discussão com o chefe"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
          />
        </label>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Bloco narrativo
          </span>

          <textarea
            rows="5"
            value={narrativeText}
            onChange={(event) => setNarrativeText(event.target.value)}
            placeholder="Escreva o que surgiu na sessão..."
            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
          />
        </label>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">Emoções</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {availableEmotions.map((emotion) => {
                const isSelected = selectedEmotions.includes(emotion)

                return (
                  <button
                    key={emotion}
                    onClick={() =>
                      setSelectedEmotions(toggleItem(selectedEmotions, emotion))
                    }
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
                const isSelected = selectedPeople.includes(person)

                return (
                  <button
                    key={person}
                    onClick={() =>
                      setSelectedPeople(toggleItem(selectedPeople, person))
                    }
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
              const isSelected = selectedTags.includes(tag)

              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(toggleItem(selectedTags, tag))}
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
              {intensity}/10
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(event) => setIntensity(Number(event.target.value))}
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
              value={connectedBlockId}
              onChange={(event) => setConnectedBlockId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
            >
              <option value="">Nenhum evento conectado</option>

              {availableConnectionBlocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.title} — {block.date}
                </option>
              ))}
            </select>
          </label>

          {connectedBlockId && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Força da ligação
                </span>

                <select
                  value={connectionStrength}
                  onChange={(event) => setConnectionStrength(event.target.value)}
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
                  value={connectionReason}
                  onChange={(event) => setConnectionReason(event.target.value)}
                  placeholder="Ex: repetição de invalidação"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                />
              </label>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">
            Prévia do bloco
          </p>

          <h3 className="mt-2 font-semibold text-slate-900">
            {blockTitle || "Título do bloco"}
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            {narrativeText || "O texto do bloco aparecerá aqui."}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {[...selectedEmotions, ...selectedPeople, ...selectedTags].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-2 py-1 text-xs text-slate-700"
                >
                  {item}
                </span>
              )
            )}
          </div>

          {selectedConnectedBlock && connectionReason && (
            <div className="mt-4 rounded-2xl bg-white p-3 text-sm text-slate-600">
              Conectado a{" "}
              <strong className="text-slate-900">
                {selectedConnectedBlock.title}
              </strong>{" "}
              com ligação <strong>{connectionStrength}</strong>.
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm text-slate-700"
          >
            Cancelar
          </button>

          <button
            onClick={handleSaveBlock}
            className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-medium text-white"
          >
            {initialBlock ? "Salvar alterações" : "Salvar bloco"}
          </button>
        </div>
      </div>
    </div>
  )
}