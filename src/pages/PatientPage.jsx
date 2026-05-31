import { useState } from "react"
import { patient } from "../data/patient"
import { PatientHeader } from "../components/PatientHeader"
import { Timeline } from "../components/Timeline"
import { AddSessionModal } from "../components/AddSessionModal"
import { useTimelineData } from "../hooks/useTimelineData"

export function PatientPage() {
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState(null)
  const [targetSession, setTargetSession] = useState(null)

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
  } = useTimelineData()

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

  function handleDeleteBlock(blockId) {
    const confirmed = confirm("Tem certeza que deseja excluir este bloco?")

    if (!confirmed) return

    deleteBlock(blockId)
  }

  function handleDeleteSession(sessionId) {
    const confirmed = confirm(
      "Tem certeza que deseja excluir esta sessão inteira? Todos os blocos desta sessão também serão apagados."
    )

    if (!confirmed) return

    deleteSession(sessionId)
  }

  function handleResetTimeline() {
    const confirmed = confirm(
      "Tem certeza que deseja restaurar a timeline inicial? Os blocos criados localmente serão apagados."
    )

    if (!confirmed) return

    resetTimeline()
  }

  return (
    <main className="mx-auto w-full max-w-[1800px] px-8 py-8">
      <PatientHeader patient={patient} onAddSession={handleOpenAddSession} />

      <div className="mt-6">
        <Timeline
          timelineData={timelineData}
          onDeleteBlock={handleDeleteBlock}
          onEditBlock={handleEditBlock}
          onAddBlockToSession={handleAddBlockToSession}
          onUpdateSession={handleUpdateSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      <footer className="mt-8 flex justify-end border-t border-slate-200 pt-6">
        <button
          onClick={handleResetTimeline}
          className="rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
        >
          Restaurar timeline inicial
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
      />
    </main>
  )
}