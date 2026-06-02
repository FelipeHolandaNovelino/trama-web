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
 * Padroniza relacionamentos com primeira letra maiúscula.
 *
 * Exemplo:
 * mãe -> Mãe
 * PAI -> Pai
 * chefe antigo -> Chefe antigo
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
 * com pacientes cadastrados antes das mudanças recentes.
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

function FormSection({ title, description, children, className = "" }) {
  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      <h3 className="text-base font-black text-slate-950 sm:text-lg">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      )}

      {children}
    </section>
  )
}

function RelationshipSection({
  relationships,
  relationshipDraft,
  onChangeRelationshipDraft,
  onAddRelationship,
  onRemoveRelationship,
  onRelationshipKeyDown,
}) {
  return (
    <section className="mt-4 rounded-3xl border border-violet-100 bg-violet-50/40 p-4 shadow-sm sm:mt-5 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-black text-slate-950 sm:text-lg">
            Relacionamentos do paciente
          </h3>

          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            Esses vínculos aparecerão como opções em Relações ao criar blocos na
            timeline.
          </p>
        </div>

        <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
          {relationships.length} relacionamento
          {relationships.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={relationshipDraft}
          onChange={(event) => onChangeRelationshipDraft(event.target.value)}
          onKeyDown={onRelationshipKeyDown}
          placeholder="Ex: Mãe, Pai, Marido, Chefe"
          className="min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        />

        <button
          type="button"
          onClick={onAddRelationship}
          className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-900"
        >
          Adicionar
        </button>
      </div>

      {relationships.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {relationships.map((relationship) => (
            <button
              key={relationship}
              type="button"
              onClick={() => onRemoveRelationship(relationship)}
              className="max-w-full truncate rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-violet-800 shadow-sm transition hover:bg-violet-100"
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
  )
}

/**
 * Modal de criação e edição de paciente.
 *
 * Os relacionamentos cadastrados aqui alimentam as opções de Relações
 * ao criar ou editar blocos clínicos na timeline do paciente.
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-0 py-0 sm:items-center sm:px-4 sm:py-4"
      onClick={onClose}
    >
      <section
        className="flex h-[96vh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-slate-50 shadow-2xl sm:max-h-[92vh] sm:max-w-5xl sm:rounded-[2rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
                {isEditing ? "Editar paciente" : "Novo paciente"}
              </p>

              <h2 className="mt-1 line-clamp-2 text-xl font-black tracking-tight text-slate-950 sm:mt-2 sm:text-2xl">
                {isEditing ? "Atualizar cadastro" : "Cadastrar paciente"}
              </h2>

              <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">
                Registre os dados principais, agenda clínica e vínculos
                importantes do paciente.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              aria-label="Fechar modal"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
        >
          {formError && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 sm:mb-5">
              {formError}
            </div>
          )}

          <FormSection
            title="Identificação"
            description="Dados básicos para reconhecer o paciente dentro do sistema."
          >
            <div className="mt-4 grid gap-4 md:grid-cols-2 sm:mt-5">
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
          </FormSection>

          <FormSection title="Contato" className="mt-4 sm:mt-5">
            <div className="mt-4 grid gap-4 md:grid-cols-2 sm:mt-5">
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
          </FormSection>

          <FormSection title="Agenda clínica" className="mt-4 sm:mt-5">
            <div className="mt-4 grid gap-4 md:grid-cols-3 sm:mt-5">
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
          </FormSection>

          <FormSection title="Síntese clínica inicial" className="mt-4 sm:mt-5">
            <div className="mt-4 grid gap-4 sm:mt-5">
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
                  Separe por vírgula. As tags continuam úteis para busca, mas
                  não aparecem no card do paciente.
                </span>
              </label>
            </div>
          </FormSection>

          <RelationshipSection
            relationships={formData.relationships}
            relationshipDraft={relationshipDraft}
            onChangeRelationshipDraft={setRelationshipDraft}
            onAddRelationship={handleAddRelationship}
            onRemoveRelationship={handleRemoveRelationship}
            onRelationshipKeyDown={handleRelationshipKeyDown}
          />
        </form>

        <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="grid gap-2 sm:flex sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900"
            >
              {isEditing ? "Salvar alterações" : "Criar paciente"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}