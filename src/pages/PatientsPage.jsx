import { useMemo, useState } from "react"

import { AddPatientModal } from "../components/AddPatientModal"
import { ConfirmModal } from "../components/ConfirmModal"
import { PatientCard } from "../components/PatientCard"
import { PatientsFilters } from "../components/PatientsFilters"
import { filterPatients, hasPatientsFilters } from "../utils/patientsUtils"
import { getPatientsTimelineSummaries } from "../utils/patientTimelineSummary"

/**
 * Página principal de pacientes.
 *
 * O layout foi ajustado para uma tela mais horizontal, discreta e clínica:
 * título à esquerda, filtros à direita e pacientes em linhas amplas.
 */
export function PatientsPage({
  patients = [],
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
   * Resumos das timelines exibidos diretamente nas linhas dos pacientes.
   * A leitura considera localStorage e seeds demonstrativos.
   */
  const timelineSummariesByPatientId = useMemo(() => {
    return getPatientsTimelineSummaries(patients)
  }, [patients])

  /**
   * Filtra a lista visual sem alterar os dados originais.
   */
  const filteredPatients = useMemo(() => {
    return filterPatients(patients, searchTerm, statusFilter)
  }, [patients, searchTerm, statusFilter])

  const hasActiveFilters = hasPatientsFilters(searchTerm, statusFilter)

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

  function handleClearFilters() {
    setSearchTerm("")
    setStatusFilter("Todos")
  }

  function handleOpenDeleteConfirmation(patient) {
    setPatientToDelete(patient)
  }

  function handleCancelDeleteConfirmation() {
    setPatientToDelete(null)
  }

  function handleConfirmDeletePatient() {
    if (!patientToDelete) return

    onDeletePatient(patientToDelete.id)
    setPatientToDelete(null)
  }

  /**
   * Usa o mesmo modal para criação e edição.
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
    <main className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-violet-700">
            Pacientes
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Lista de pacientes
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Acesse prontuários, acompanhe sessões e visualize a evolução clínica
            de cada paciente.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <PatientsFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onClearFilters={handleClearFilters}
          />

          <button
            type="button"
            onClick={handleOpenCreatePatientModal}
            className="h-14 rounded-2xl border border-violet-300 bg-white px-7 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            + Novo paciente
          </button>
        </div>
      </section>

      {filteredPatients.length > 0 ? (
        <section className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-200">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                timelineSummary={timelineSummariesByPatientId[patient.id]}
                onEdit={handleOpenEditPatientModal}
                onDelete={handleOpenDeleteConfirmation}
                onOpen={onOpenPatient}
              />
            ))}
          </div>

          <footer className="flex flex-col gap-4 border-t border-slate-200 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Mostrando{" "}
              <strong className="font-semibold text-slate-700">
                {filteredPatients.length}
              </strong>{" "}
              de{" "}
              <strong className="font-semibold text-slate-700">
                {patients.length}
              </strong>{" "}
              pacientes
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                aria-label="Página anterior"
              >
                ‹
              </button>

              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-sm font-bold text-violet-700">
                1
              </span>

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                aria-label="Próxima página"
              >
                ›
              </button>
            </div>
          </footer>
        </section>
      ) : (
        <section className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
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