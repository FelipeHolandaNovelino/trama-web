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
  relationships: "",
}

/**
 * Calcula a idade com base na data de nascimento.
 * O cálculo considera se o aniversário já aconteceu no ano atual.
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
 * Converte uma data ISO simples para o formato visual brasileiro.
 * Exemplo: 2026-03-27 → 27/03/2026.
 */
function formatDateToBrazilian(dateValue) {
  if (!dateValue) return "—"

  const [year, month, day] = dateValue.split("-")

  if (!year || !month || !day) return "—"

  return `${day}/${month}/${year}`
}

/**
 * Converte uma data brasileira para o formato aceito pelo input date.
 * Exemplo: 27/03/2026 → 2026-03-27.
 */
function formatBrazilianDateToInput(dateValue) {
  if (!dateValue || dateValue === "—") return ""

  const [day, month, year] = dateValue.split("/")

  if (!day || !month || !year) return ""

  return `${year}-${month}-${day}`
}

/**
 * Converte arrays em texto separado por vírgulas para preencher inputs.
 * Isso permite editar dados já salvos sem perder a estrutura de lista.
 */
function formatListToText(value) {
  if (Array.isArray(value)) {
    return value.join(", ")
  }

  if (typeof value === "string") {
    return value
  }

  return ""
}

/**
 * Converte campos de texto separados por vírgula em listas limpas.
 * Usado para tags clínicas e relações importantes.
 */
function parseCommaSeparatedList(text) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

/**
 * Prepara os dados iniciais do formulário.
 *
 * Quando existe initialPatient, o modal entra em modo edição.
 * Quando não existe, o formulário começa vazio para criação.
 */
function getInitialFormData(initialPatient) {
  if (!initialPatient) {
    return initialFormData
  }

  return {
    name: initialPatient.name || "",
    birthDate: initialPatient.birthDate || "",
    age: initialPatient.age || "",
    status: initialPatient.status || "Triagem inicial",
    email: initialPatient.email || "",
    phone: initialPatient.phone || "",
    treatmentStartDate: initialPatient.treatmentStartDate || "",
    lastSessionDate:
      initialPatient.lastSessionDate ||
      formatBrazilianDateToInput(initialPatient.lastSession),
    nextSessionDate:
      initialPatient.nextSessionDate ||
      formatBrazilianDateToInput(initialPatient.nextSession),
    mainComplaint: initialPatient.mainComplaint || "",
    description: initialPatient.description || initialPatient.summary || "",
    tags: formatListToText(initialPatient.tags),
    relationships: formatListToText(initialPatient.relationships),
  }
}

/**
 * Modal responsável por criar e editar pacientes.
 *
 * A persistência fica fora do modal, no hook usePatientsData.
 * Assim, o componente permanece focado apenas na experiência do formulário.
 */
export function AddPatientModal({
  isOpen,
  onClose,
  onSavePatient,
  initialPatient = null,
}) {
  const [formData, setFormData] = useState(initialFormData)
  const [formError, setFormError] = useState("")

  const isEditing = Boolean(initialPatient)

  /**
   * Sempre que o modal abre, ele decide se deve carregar um paciente existente
   * ou iniciar um formulário limpo para novo cadastro.
   */
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(initialPatient))
      setFormError("")
    }
  }, [isOpen, initialPatient])

  const calculatedAge = useMemo(
    () => calculateAgeFromBirthDate(formData.birthDate),
    [formData.birthDate]
  )

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

  function handleSubmit(event) {
    event.preventDefault()

    /**
     * Nome é obrigatório porque identifica o paciente na listagem,
     * no cabeçalho clínico e nos futuros fluxos de prontuário.
     */
    if (!formData.name.trim()) {
      setFormError("Informe o nome do paciente para continuar.")
      return
    }

    const patientAge = calculatedAge || formData.age

    onSavePatient({
      name: formData.name,
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
      tags: parseCommaSeparatedList(formData.tags),
      relationships: parseCommaSeparatedList(formData.relationships),
      mirror: initialPatient?.mirror || {
        centralWound: "",
        mainFear: "",
      },
      emotionalPatterns: initialPatient?.emotionalPatterns || [],
      medications: initialPatient?.medications || [],
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
              {isEditing ? "Editar paciente" : "Novo paciente"}
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              {isEditing ? "Atualizar cadastro" : "Cadastrar paciente"}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              {isEditing
                ? "Atualize os dados iniciais do paciente sem alterar sua timeline clínica."
                : "Registre os dados iniciais do paciente para criar o prontuário e preparar a timeline clínica do acompanhamento."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Fechar
          </button>
        </header>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
          {formError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {formError}
            </div>
          )}

          <section className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <div>
              <h3 className="text-base font-black text-slate-950">
                Identificação
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Dados básicos para reconhecer o paciente dentro do sistema.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  Nome do paciente *
                </span>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Ana Luiza"
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
            </div>

            <div className="grid gap-5 md:grid-cols-2">
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
                  placeholder="Calculada pela data de nascimento"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />

                {calculatedAge && (
                  <span className="text-xs text-slate-500">
                    Idade calculada automaticamente.
                  </span>
                )}
              </label>
            </div>
          </section>

          <section className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <div>
              <h3 className="text-base font-black text-slate-950">Contato</h3>

              <p className="mt-1 text-sm text-slate-500">
                Informações opcionais para referência do profissional.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  E-mail
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ex: paciente@email.com"
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
                  placeholder="Ex: (11) 99999-9999"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </label>
            </div>
          </section>

          <section className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <div>
              <h3 className="text-base font-black text-slate-950">
                Agenda clínica
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Datas iniciais para organizar o acompanhamento do paciente.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
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

          <section className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
            <div>
              <h3 className="text-base font-black text-slate-950">
                Síntese clínica inicial
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Um primeiro resumo para orientar o futuro espelho do paciente.
              </p>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Queixa principal
              </span>

              <input
                name="mainComplaint"
                value={formData.mainComplaint}
                onChange={handleChange}
                placeholder="Ex: ansiedade relacionada ao trabalho e autocobrança"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Descrição inicial
              </span>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Escreva um resumo inicial do caso..."
                className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
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
                  Separe as tags por vírgula.
                </span>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Pessoas importantes
                </span>

                <input
                  name="relationships"
                  value={formData.relationships}
                  onChange={handleChange}
                  placeholder="Ex: mãe, pai, marido, chefe"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />

                <span className="text-xs text-slate-500">
                  Separe os nomes ou papéis por vírgula.
                </span>
              </label>
            </div>
          </section>

          <footer className="sticky bottom-0 -mx-6 -mb-6 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:flex-row sm:justify-end">
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