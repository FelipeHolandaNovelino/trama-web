import { useMemo, useState } from "react"

import { AddPatientModal } from "../components/AddPatientModal"
import { ConfirmModal } from "../components/ConfirmModal"

const STATUS_OPTIONS = [
  "Todos",
  "Triagem inicial",
  "Em acompanhamento",
  "Encerrado",
]

/**
 * Gera as iniciais do nome do paciente para uso no avatar textual.
 * Essa solução evita depender de imagens enquanto o cadastro real não existe.
 */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Normaliza textos para busca.
 * Remove diferença entre maiúsculas/minúsculas e evita erro com valores vazios.
 */
function normalizeSearchText(value = "") {
  return String(value).toLowerCase().trim()
}

/**
 * Converte listas e textos em uma única string pesquisável.
 * Isso permite buscar por tags, relações, queixa, descrição e contato.
 */
function buildPatientSearchText(patient) {
  return [
    patient.name,
    patient.mainComplaint,
    patient.description,
    patient.email,
    patient.phone,
    patient.status,
    ...(patient.tags || []),
    ...(patient.relationships || []),
  ]
    .filter(Boolean)
    .join(" ")
}

export function PatientsPage({
  patients = [],
  patientStats,
  onOpenPatient,
  onCreatePatient,
  onUpdatePatient,
  onDeletePatient,
}) {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [patientToDelete, setPatientToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")

  /**
   * Os contadores vêm do hook usePatientsData.
   * Caso a página seja usada isoladamente no futuro, o fallback evita erro visual.
   */
  const stats = patientStats || {
    total: patients.length,
    active: 0,
    screening: 0,
  }

  /**
   * Aplica busca textual e filtro por status.
   * A lista original permanece intacta; apenas a visualização é filtrada.
   */
  const filteredPatients = useMemo(() => {
    const normalizedSearchTerm = normalizeSearchText(searchTerm)

    return patients.filter((patient) => {
      const matchesStatus =
        statusFilter === "Todos" || patient.status === statusFilter

      const patientSearchText = normalizeSearchText(
        buildPatientSearchText(patient)
      )

      const matchesSearch =
        !normalizedSearchTerm ||
        patientSearchText.includes(normalizedSearchTerm)

      return matchesStatus && matchesSearch
    })
  }, [patients, searchTerm, statusFilter])

  const hasActiveFilters = searchTerm.trim() || statusFilter !== "Todos"

  function handleOpenCreatePatientModal() {
    setEditingPatient(null)
    setIsPatientModalOpen(true)
  }

  function handleOpenEditPatientModal(patient) {
    setEditingPatient(patient)
    setIsPatientModalOpen(true)
  }

  function handleClosePatientModal() {
    setEditingPatient(null)
    setIsPatientModalOpen(false)
  }

  /**
   * Limpa busca e status para restaurar a listagem completa.
   */
  function handleClearFilters() {
    setSearchTerm("")
    setStatusFilter("Todos")
  }

  /**
   * Abre a confirmação antes de excluir.
   * A exclusão real só acontece quando o usuário confirma no modal.
   */
  function handleOpenDeleteConfirmation(patient) {
    setPatientToDelete(patient)
  }

  function handleCancelDeleteConfirmation() {
    setPatientToDelete(null)
  }

  /**
   * Confirma a exclusão do paciente selecionado.
   * A responsabilidade de alterar os dados continua no App/hook.
   */
  function handleConfirmDeletePatient() {
    if (!patientToDelete) return

    onDeletePatient(patientToDelete.id)
    setPatientToDelete(null)
  }

  /**
   * Decide se o modal deve criar um novo paciente ou atualizar um existente.
   * A página não altera dados diretamente; ela delega essa responsabilidade ao App/hook.
   */
  function handleSavePatient(patientData) {
    if (editingPatient) {
      onUpdatePatient(editingPatient.id, patientData)
      handleClosePatientModal()
      return
    }

    onCreatePatient(patientData)
    handleClosePatientModal()
  }

  return (
    <main className="mx-auto w-full max-w-[1800px] px-8 py-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
              Pacientes
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Lista de pacientes
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Acesse os prontuários clínicos, acompanhe sessões e organize a
              linha da vida emocional de cada paciente.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreatePatientModal}
            className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900"
          >
            + Novo paciente
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total de pacientes</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">
            {stats.total}
          </strong>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Em acompanhamento</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">
            {stats.active}
          </strong>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Triagem inicial</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">
            {stats.screening}
          </strong>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px_auto] lg:items-end">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Buscar paciente
            </span>

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Busque por nome, queixa, tag, relação, e-mail ou telefone"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Status
            </span>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Limpar filtros
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>
            Exibindo{" "}
            <strong className="font-semibold text-slate-800">
              {filteredPatients.length}
            </strong>{" "}
            de{" "}
            <strong className="font-semibold text-slate-800">
              {patients.length}
            </strong>{" "}
            pacientes.
          </span>

          {hasActiveFilters && (
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
              Filtros ativos
            </span>
          )}
        </div>
      </section>

      {filteredPatients.length > 0 ? (
        <section className="mt-6 grid gap-5 xl:grid-cols-3">
          {filteredPatients.map((patient) => (
            <article
              key={patient.id}
              className="flex min-h-[400px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-sm font-black text-violet-800">
                      {getInitials(patient.name)}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950">
                        {patient.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {patient.age
                          ? `${patient.age} anos`
                          : "Idade não informada"}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {patient.status}
                  </span>
                </div>

                {patient.mainComplaint && (
                  <p className="mt-5 text-sm font-medium text-slate-700">
                    {patient.mainComplaint}
                  </p>
                )}

                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {patient.description ||
                    "Paciente sem descrição clínica inicial."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(patient.tags || []).slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">Última sessão</span>
                    <strong className="font-semibold text-slate-800">
                      {patient.lastSession}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">Próxima sessão</span>
                    <strong className="font-semibold text-slate-800">
                      {patient.nextSession}
                    </strong>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => handleOpenEditPatientModal(patient)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDeleteConfirmation(patient)}
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    Excluir
                  </button>

                  {/*
                    A navegação ainda é controlada pelo App.jsx.
                    Futuramente, esse clique pode ser substituído por uma rota real.
                  */}
                  <button
                    type="button"
                    onClick={() => onOpenPatient(patient)}
                    className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
                  >
                    Abrir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h3 className="text-xl font-black text-slate-950">
            Nenhum paciente encontrado
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
            Ajuste a busca ou limpe os filtros para visualizar novamente a lista
            completa de pacientes.
          </p>

          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-5 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
          >
            Limpar filtros
          </button>
        </section>
      )}

      <AddPatientModal
        isOpen={isPatientModalOpen}
        onClose={handleClosePatientModal}
        onSavePatient={handleSavePatient}
        initialPatient={editingPatient}
      />

      <ConfirmModal
        isOpen={Boolean(patientToDelete)}
        title="Excluir paciente?"
        description={`Você está prestes a excluir ${
          patientToDelete?.name || "este paciente"
        }. Esta ação removerá o paciente da listagem local.`}
        confirmLabel="Excluir paciente"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDeletePatient}
        onCancel={handleCancelDeleteConfirmation}
      />
    </main>
  )
}