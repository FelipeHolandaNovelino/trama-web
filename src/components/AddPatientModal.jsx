import { useEffect, useState } from "react"

const initialFormData = {
  name: "",
  age: "",
  status: "Triagem inicial",
  mainComplaint: "",
  lastSession: "—",
  nextSession: "—",
  description: "",
  tags: "",
}

/**
 * Modal responsável pelo cadastro inicial de pacientes.
 *
 * Nesta fase do MVP, o modal coleta apenas os dados essenciais para criar
 * o card do paciente e preparar o prontuário para a timeline clínica.
 */
export function AddPatientModal({ isOpen, onClose, onCreatePatient }) {
  const [formData, setFormData] = useState(initialFormData)

  /**
   * Sempre que o modal abre, o formulário começa limpo.
   * Isso evita reaproveitar dados digitados em um cadastro anterior.
   */
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  /**
   * Converte o campo de tags em uma lista limpa.
   * O usuário digita separado por vírgulas, mas a interface usa array.
   */
  function parseTags(tagsText) {
    return tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  function handleSubmit(event) {
    event.preventDefault()

    /**
     * Nome é o único campo obrigatório nesta etapa.
     * Os demais campos podem ser preenchidos depois, quando a edição existir.
     */
    if (!formData.name.trim()) {
      return
    }

    onCreatePatient({
      name: formData.name,
      age: formData.age,
      status: formData.status,
      mainComplaint: formData.mainComplaint,
      lastSession: formData.lastSession || "—",
      nextSession: formData.nextSession || "—",
      description: formData.description,
      tags: parseTags(formData.tags),
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
              Novo paciente
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Cadastrar paciente
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Preencha os dados iniciais do paciente. Depois, o prontuário poderá
              ser enriquecido com sessões, blocos, emoções, relações e espelho.
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

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Nome do paciente *
              </span>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Ana Luiza"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Idade
              </span>

              <input
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Ex: 34"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Status
              </span>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              >
                <option>Triagem inicial</option>
                <option>Em acompanhamento</option>
                <option>Encerrado</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Última sessão
              </span>

              <input
                name="lastSession"
                value={formData.lastSession}
                onChange={handleChange}
                placeholder="Ex: 20/03/2026"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Próxima sessão
              </span>

              <input
                name="nextSession"
                value={formData.nextSession}
                onChange={handleChange}
                placeholder="Ex: 27/03/2026"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>
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
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
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
              placeholder="Escreva um resumo clínico inicial do caso..."
              className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
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
              placeholder="Ex: ansiedade, trabalho, culpa, vínculos"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />

            <span className="text-xs text-slate-500">
              Separe as tags por vírgula.
            </span>
          </label>

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
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
              Criar paciente
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}