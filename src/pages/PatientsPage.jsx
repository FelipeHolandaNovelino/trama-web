import { useMemo, useState } from "react"

import { AddPatientModal } from "../components/AddPatientModal"
import { ConfirmModal } from "../components/ConfirmModal"
import { PatientCard } from "../components/PatientCard"
import { PatientsFilters } from "../components/PatientsFilters"
import { filterPatients, hasPatientsFilters } from "../utils/patientsUtils"
import { getPatientsTimelineSummaries } from "../utils/patientTimelineSummary"

function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function PlusIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
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

function PatientsEmptyState({ hasActiveFilters, onClearFilters, onCreatePatient }) {
  return (
    <section className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
      <h3 className="text-base font-black text-slate-950">
        {hasActiveFilters ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
      </h3>

      <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
        {hasActiveFilters
          ? "Ajuste a busca ou limpe os filtros para visualizar novamente a lista completa."
          : "Crie o primeiro paciente para começar a organizar sessões, timeline e acontecimentos clínicos."}
      </p>

      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Limpar filtros
          </button>
        )}

        <button
          type="button"
          onClick={onCreatePatient}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900"
        >
          <PlusIcon />
          Novo paciente
        </button>
      </div>
    </section>
  )
}

/**
 * Página principal de pacientes.
 *
 * Controla listagem, busca, filtro, criação, edição, exclusão e abertura
 * de prontuários individuais. O visual segue o padrão atual da Home e Timeline.
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

  const timelineSummariesByPatientId = useMemo(() => {
    return getPatientsTimelineSummaries(patients)
  }, [patients])

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
    <main className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-700">
              Pacientes
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Lista de pacientes
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
              Acesse prontuários, acompanhe sessões e visualize a evolução clínica de cada paciente.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreatePatientModal}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900 sm:w-auto"
          >
            <PlusIcon />
            Novo paciente
          </button>
        </div>

        <div className="mt-4">
          <PatientsFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onClearFilters={handleClearFilters}
          />
        </div>
      </section>

      <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-black text-slate-950 sm:text-lg">
              Prontuários
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredPatients.length} de {patients.length} paciente
              {patients.length !== 1 ? "s" : ""} exibido
              {filteredPatients.length !== 1 ? "s" : ""}.
            </p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {filteredPatients.length > 0 ? (
          <>
            <div className="mt-4 grid gap-3">
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

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold text-slate-400">
                Mostrando{" "}
                <strong className="text-slate-700">
                  {filteredPatients.length}
                </strong>{" "}
                de <strong className="text-slate-700">{patients.length}</strong>{" "}
                pacientes.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-300"
                  aria-label="Página anterior"
                >
                  ‹
                </button>

                <span className="flex h-9 min-w-9 items-center justify-center rounded-2xl bg-violet-800 px-3 text-xs font-black text-white">
                  1
                </span>

                <button
                  type="button"
                  disabled
                  className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-300"
                  aria-label="Próxima página"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <PatientsEmptyState
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
              onCreatePatient={handleOpenCreatePatientModal}
            />
          </div>
        )}
      </section>

      <AddPatientModal
        isOpen={isPatientModalOpen}
        onClose={handleClosePatientModal}
        onCreatePatient={handleSavePatient}
        onSavePatient={handleSavePatient}
        initialPatient={editingPatient}
      />

      <ConfirmModal
        isOpen={Boolean(patientToDelete)}
        title="Excluir paciente"
        description={
          patientToDelete
            ? `Tem certeza que deseja excluir ${patientToDelete.name}? Essa ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir paciente"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDeletePatient}
        onCancel={handleCancelDeleteConfirmation}
      />
    </main>
  )
}