import { useState } from "react"

const availableEmotions = [
  "vergonha",
  "medo",
  "culpa",
  "alívio",
  "raiva",
  "tristeza",
  "felicidade",
  "abandono",
]

const availablePeople = ["Mãe", "Pai", "Marido", "Filha", "Chefe"]

const availableTags = [
  "invalidação",
  "autonomia",
  "trabalho",
  "abandono",
  "exposição",
  "reparação",
]

function toggleItem(list, item) {
  if (list.includes(item)) {
    return list.filter((currentItem) => currentItem !== item)
  }

  return [...list, item]
}

export function AddSessionModal({ isOpen, onClose }) {
  const [sessionDate, setSessionDate] = useState("")
  const [blockType, setBlockType] = useState("Evento")
  const [narrativeText, setNarrativeText] = useState("")
  const [selectedEmotions, setSelectedEmotions] = useState([])
  const [selectedPeople, setSelectedPeople] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [intensity, setIntensity] = useState(5)

  if (!isOpen) return null

  function handleSaveBlock() {
    const newBlock = {
      date: sessionDate,
      type: blockType,
      text: narrativeText,
      emotions: selectedEmotions,
      people: selectedPeople,
      tags: selectedTags,
      intensity,
    }

    console.log("Novo bloco narrativo:", newBlock)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-violet-700">
              Nova sessão
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Registrar sessão do paciente
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Crie blocos narrativos que poderão alimentar a timeline, os padrões
              emocionais e as relações importantes.
            </p>
          </div>

          <button
            onClick={onClose}
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

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">
            Prévia do bloco
          </p>

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
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm text-slate-700"
          >
            Cancelar
          </button>

          <button
            onClick={handleSaveBlock}
            className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-medium text-white"
          >
            Salvar bloco
          </button>
        </div>
      </div>
    </div>
  )
}