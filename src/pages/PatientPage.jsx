import { useState } from "react"

import { patient as basePatient } from "../data/patient"
import { PatientHeader } from "../components/PatientHeader"
import { Timeline } from "../components/Timeline"
import { AddSessionModal } from "../components/AddSessionModal"
import { ConfirmModal } from "../components/ConfirmModal"
import { useTimelineData } from "../hooks/useTimelineData"

const DEFAULT_PATIENT_ID = "joao-luiz"

export function PatientPage({ selectedPatient, onBackToPatients }) {
  /**
   * Usa o paciente selecionado pela lista ou Home.
   * Caso a timeline seja aberta sem seleção, mantém o paciente base.
   */
  const patient = selectedPatient || {
    ...basePatient,
    id: DEFAULT_PATIENT_ID,
  }

  /**
   * Cada paciente possui uma timeline própria.
   */
  const patientTimelineId = patient.id || DEFAULT_PATIENT_ID

  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState(null)
  const [targetSession, setTargetSession] = useState(null)
  const [confirmation, setConfirmation] = useState(null)

  const {
    timelineData,
    existingBlocks,
    saveBlock,
    saveSession,
    saveBlockToExistingSession,
    updateSession,
    deleteBlock,
    deleteSession,
    resetTimeline,
  } = useTimelineData(patientTimelineId)

  function handleOpenAddSession() {
    setEditingBlock(null)
    setTargetSession(null)
    setIsAddSessionModalOpen(true)
  }

  function handleEditBlock(block) {
    setTargetSession(null)
    setEditingBlock(block)
    setIsAddSessionModalOpen(true)
  }

  function handleAddBlockToSession(session) {
    setEditingBlock(null)
    setTargetSession(session)
    setIsAddSessionModalOpen(true)
  }

  function handleCloseModal() {
    setEditingBlock(null)
    setTargetSession(null)
    setIsAddSessionModalOpen(false)
  }

  function handleSaveBlock(blockData) {
    saveBlock(blockData, editingBlock)
    setEditingBlock(null)
  }

  function handleSaveSession(sessionData) {
    saveSession(sessionData)
  }

  function handleSaveBlockToExistingSession(sessionId, blockData) {
    saveBlockToExistingSession(sessionId, blockData)
    setTargetSession(null)
  }

  function handleUpdateSession(sessionId, updatedSessionData) {
    updateSession(sessionId, updatedSessionData)
  }

  /**
   * Confirma antes de remover um bloco.
   */
  function handleDeleteBlock(blockId) {
    setConfirmation({
      title: "Excluir bloco?",
      description:
        "Este bloco será removido da timeline deste paciente. Conexões que apontam para ele também serão removidas automaticamente.",
      confirmLabel: "Excluir bloco",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: () => deleteBlock(blockId),
    })
  }

  /**
   * Confirma antes de remover uma sessão inteira.
   */
  function handleDeleteSession(sessionId) {
    setConfirmation({
      title: "Excluir sessão inteira?",
      description:
        "Todos os blocos desta sessão serão apagados da timeline deste paciente. Conexões externas que apontam para esses blocos também serão removidas.",
      confirmLabel: "Excluir sessão",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: () => deleteSession(sessionId),
    })
  }

  /**
   * Confirma restauração da timeline do paciente atual.
   */
  function handleResetTimeline() {
    setConfirmation({
      title: "Restaurar timeline deste paciente?",
      description:
        "Os dados criados localmente para este paciente serão apagados. Outros pacientes não serão afetados.",
      confirmLabel: "Restaurar timeline",
      cancelLabel: "Cancelar",
      variant: "danger",
      onConfirm: resetTimeline,
    })
  }

  function handleCancelConfirmation() {
    setConfirmation(null)
  }

  function handleConfirmAction() {
    if (!confirmation?.onConfirm) return

    confirmation.onConfirm()
    setConfirmation(null)
  }

  return (
    <main className="mx-auto w-full max-w-[1800px] px-8 py-8">
      <PatientHeader
        patient={patient}
        onAddSession={handleOpenAddSession}
        onBackToPatients={onBackToPatients}
      />

      <div className="mt-4">
        <Timeline
          timelineData={timelineData}
          onCreateSession={handleOpenAddSession}
          onDeleteBlock={handleDeleteBlock}
          onEditBlock={handleEditBlock}
          onAddBlockToSession={handleAddBlockToSession}
          onUpdateSession={handleUpdateSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      <footer className="mt-8 flex justify-end border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={handleResetTimeline}
          className="rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
        >
          Restaurar timeline deste paciente
        </button>
      </footer>

      <AddSessionModal
        isOpen={isAddSessionModalOpen}
        onClose={handleCloseModal}
        onSaveBlock={handleSaveBlock}
        onSaveSession={handleSaveSession}
        onSaveBlockToExistingSession={handleSaveBlockToExistingSession}
        existingBlocks={existingBlocks}
        initialBlock={editingBlock}
        targetSession={targetSession}
        relationshipOptions={patient.relationships || []}
      />

      <ConfirmModal
        isOpen={Boolean(confirmation)}
        title={confirmation?.title}
        description={confirmation?.description}
        confirmLabel={confirmation?.confirmLabel}
        cancelLabel={confirmation?.cancelLabel}
        variant={confirmation?.variant}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelConfirmation}
      />
    </main>
  )
}