import { useEffect, useMemo, useState } from "react"

const initialFormData = {
  name: "",
  birthDate: "",
  age: "",
  status: "Triagem inicial",
  email: "",
  phone: "",
  treatmentStartDate: "",
  lastSessionDate: "",
  nextSessionDate: "",
  mainComplaint: "",
  description: "",
  tags: "",
  relationships: [],
}

/**
 * Calcula a idade com base na data de nascimento informada.
 */
function calculateAgeFromBirthDate(birthDate) {
  if (!birthDate) return ""

  const today = new Date()
  const birth = new Date(`${birthDate}T00:00:00`)

  let age = today.getFullYear() - birth.getFullYear()

  const monthDifference = today.getMonth() - birth.getMonth()
  const dayDifference = today.getDate() - birth.getDate()

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age -= 1
  }

  return age >= 0 ? String(age) : ""
}

/**
 * Converte data do input date para o formato visual brasileiro.
 */
function formatDateToBrazilian(dateValue) {
  if (!dateValue) return "—"

  const [year, month, day] = dateValue.split("-")

  if (!year || !month || !day) return "—"

  return `${day}/${month}/${year}`
}

/**
 * Formata relacionamentos com primeira letra maiúscula.
 *
 * Isso mantém opções como "mãe", "PAI" ou "chefe antigo" em um padrão visual
 * mais limpo para aparecer depois no campo Relações da timeline.
 */
function formatRelationshipName(value) {
  const normalizedValue = String(value).trim().toLocaleLowerCase("pt-BR")

  if (!normalizedValue) return ""

  return (
    normalizedValue.charAt(0).toLocaleUpperCase("pt-BR") +
    normalizedValue.slice(1)
  )
}

/**
 * Normaliza listas vindas de formatos antigos e novos.
 *
 * Aceita array ou string separada por vírgula para manter compatibilidade
 * com pacientes cadastrados antes desta alteração.
 */
function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

/**
 * Normaliza especificamente os relacionamentos do paciente.
 *
 * Além de aceitar formatos antigos, também aplica a padronização visual
 * com primeira letra maiúscula.
 */
function normalizeRelationships(value) {
  return normalizeList(value)
    .map((relationship) => formatRelationshipName(relationship))
    .filter(Boolean)
}

function createInitialFormDataFromPatient(patient) {
  if (!patient) {
    return initialFormData
  }

  return {
    name: patient.name || "",
    birthDate: patient.birthDate || "",
    age: patient.age || "",
    status: patient.status || "Triagem inicial",
    email: patient.email || "",
    phone: patient.phone || "",
    treatmentStartDate: patient.treatmentStartDate || "",
    lastSessionDate: patient.lastSessionDate || "",
    nextSessionDate: patient.nextSessionDate || "",
    mainComplaint: patient.mainComplaint || "",
    description: patient.description || "",
    tags: normalizeList(patient.tags).join(", "),
    relationships: normalizeRelationships(patient.relationships),
  }
}

/**
 * Modal de criação e edição de paciente.
 *
 * Os relacionamentos cadastrados aqui passam a ser usados como opções
 * no campo Relações ao criar blocos na timeline do paciente.
 */
export function AddPatientModal({
  isOpen,
  onClose,
  onCreatePatient,
  onSavePatient,
  initialPatient = null,
}) {
  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState("")
  const [relationshipDraft, setRelationshipDraft] = useState("")

  const isEditing = Boolean(initialPatient)

  useEffect(() => {
    if (!isOpen) return

    setFormData(createInitialFormDataFromPatient(initialPatient))
    setRelationshipDraft("")
    setFormError("")
  }, [isOpen, initialPatient])

  const calculatedAge = useMemo(() => {
    return calculateAgeFromBirthDate(formData.birthDate)
  }, [formData.birthDate])

  if (!isOpen) {
    return null
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    if (formError) {
      setFormError("")
    }
  }

  function handleAddRelationship() {
    const relationship = formatRelationshipName(relationshipDraft)

    if (!relationship) return

    setFormData((currentData) => {
      const alreadyExists = currentData.relationships.some(
        (currentRelationship) =>
          currentRelationship.toLocaleLowerCase("pt-BR") ===
          relationship.toLocaleLowerCase("pt-BR")
      )

      if (alreadyExists) {
        return currentData
      }

      return {
        ...currentData,
        relationships: [...currentData.relationships, relationship],
      }
    })

    setRelationshipDraft("")
  }

  function handleRelationshipKeyDown(event) {
    if (event.key !== "Enter") return

    event.preventDefault()
    handleAddRelationship()
  }

  function handleRemoveRelationship(relationshipToRemove) {
    setFormData((currentData) => ({
      ...currentData,
      relationships: currentData.relationships.filter(
        (relationship) => relationship !== relationshipToRemove
      ),
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formData.name.trim()) {
      setFormError("Informe o nome do paciente para continuar.")
      return
    }

    const patientAge = calculatedAge || formData.age

    const patientPayload = {
      name: formData.name.trim(),
      birthDate: formData.birthDate,
      age: patientAge,
      status: formData.status,
      email: formData.email,
      phone: formData.phone,
      treatmentStartDate: formData.treatmentStartDate,
      lastSessionDate: formData.lastSessionDate,
      nextSessionDate: formData.nextSessionDate,
      lastSession: formatDateToBrazilian(formData.lastSessionDate),
      nextSession: formatDateToBrazilian(formData.nextSessionDate),
      mainComplaint: formData.mainComplaint,
      description: formData.description,
      tags: normalizeList(formData.tags),
      relationships: normalizeRelationships(formData.relationships),
      mirror: initialPatient?.mirror || {
        centralWound: "",
        mainFear: "",
      },
      emotionalPatterns: initialPatient?.emotionalPatterns || [],
      medications: initialPatient?.medications || [],
    }

    const savePatient = onSavePatient || onCreatePatient

    savePatient(patientPayload)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-4"
      onClick={onClose}
    >
      <section
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-slate-50 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
                {isEditing ? "Editar paciente" : "Novo paciente"}
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {isEditing ? "Atualizar cadastro" : "Cadastrar paciente"}
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
                Registre os dados principais do paciente e seus relacionamentos
                importantes para usar depois na timeline clínica.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Fechar
            </button>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto px-6 py-5"
        >
          {formError && (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {formError}
            </div>
          )}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">
              Identificação
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Dados básicos para reconhecer o paciente dentro do sistema.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Nome do paciente *
                </span>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Status
                </span>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                >
                  <option>Triagem inicial</option>
                  <option>Em acompanhamento</option>
                  <option>Encerrado</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Data de nascimento
                </span>

                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />

                {calculatedAge && (
                  <span className="text-xs text-slate-500">
                    Idade calculada automaticamente: {calculatedAge} anos.
                  </span>
                )}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Idade
                </span>

                <input
                  name="age"
                  value={calculatedAge || formData.age}
                  onChange={handleChange}
                  disabled={Boolean(calculatedAge)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </label>
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">Contato</h3>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  E-mail
                </span>

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Telefone
                </span>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </label>
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">
              Agenda clínica
            </h3>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Início do acompanhamento
                </span>

                <input
                  type="date"
                  name="treatmentStartDate"
                  value={formData.treatmentStartDate}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Última sessão
                </span>

                <input
                  type="date"
                  name="lastSessionDate"
                  value={formData.lastSessionDate}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Próxima sessão
                </span>

                <input
                  type="date"
                  name="nextSessionDate"
                  value={formData.nextSessionDate}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </label>
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">
              Síntese clínica inicial
            </h3>

            <div className="mt-5 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Queixa principal
                </span>

                <input
                  name="mainComplaint"
                  value={formData.mainComplaint}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Descrição inicial
                </span>

                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Tags clínicas
                </span>

                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Ex: ansiedade, trabalho, culpa"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />

                <span className="text-xs text-slate-500">
                  Separe as tags por vírgula. Elas não aparecem no card, mas
                  continuam úteis para busca.
                </span>
              </label>
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-violet-100 bg-violet-50/40 p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">
              Relacionamentos do paciente
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Cadastre os vínculos que poderão aparecer como opções em Relações
              ao criar blocos na timeline.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={relationshipDraft}
                onChange={(event) => setRelationshipDraft(event.target.value)}
                onKeyDown={handleRelationshipKeyDown}
                placeholder="Ex: Mãe, Pai, Marido, Chefe"
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />

              <button
                type="button"
                onClick={handleAddRelationship}
                className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-900"
              >
                Adicionar
              </button>
            </div>

            {formData.relationships.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.relationships.map((relationship) => (
                  <button
                    key={relationship}
                    type="button"
                    onClick={() => handleRemoveRelationship(relationship)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-violet-800 shadow-sm transition hover:bg-violet-100"
                    title="Remover relacionamento"
                  >
                    {relationship} ×
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-dashed border-violet-200 bg-white/70 px-4 py-3 text-sm text-slate-500">
                Nenhum relacionamento cadastrado ainda.
              </p>
            )}
          </section>

          <footer className="sticky bottom-0 -mx-6 -mb-5 mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900"
            >
              {isEditing ? "Salvar alterações" : "Criar paciente"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}