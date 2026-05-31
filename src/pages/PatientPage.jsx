import { useEffect, useMemo, useState } from "react"
import { timeline } from "../data/timeline"
import { patient } from "../data/patient"
import { PatientHeader } from "../components/PatientHeader"
import { Timeline } from "../components/Timeline"
import { AddSessionModal } from "../components/AddSessionModal"

import { getAllBlocks } from "../utils/timelineUtils"

import {
  addBlockToExistingSession,
  addSessionToTimeline,
  createSessionFromBlock,
  createSessionFromBlocks,
  removeBlockFromTimeline,
  removeSessionFromTimeline,
  updateBlockInTimeline,
  updateSessionInTimeline,
} from "../utils/timelineMutations"

const STORAGE_KEY = "trama_timeline_data"

function getInitialTimeline() {
  const savedTimeline = localStorage.getItem(STORAGE_KEY)

  if (!savedTimeline) {
    return timeline
  }

  try {
    return JSON.parse(savedTimeline)
  } catch {
    return timeline
  }
}

export function PatientPage() {
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState(null)
  const [targetSession, setTargetSession] = useState(null)
  const [timelineData, setTimelineData] = useState(getInitialTimeline)

  /**
   * Lista usada pelo modal para criar conexões entre blocos existentes.
   */
  const existingBlocks = useMemo(() => {
    return getAllBlocks(timelineData)
  }, [timelineData])

  /**
   * Persistência local temporária do MVP.
   * Futuramente, essa camada será substituída por API/backend.
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timelineData))
  }, [timelineData])

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
    if (editingBlock) {
      setTimelineData((currentTimeline) =>
        updateBlockInTimeline(currentTimeline, blockData)
      )

      setEditingBlock(null)
      return
    }

    const newSession = createSessionFromBlock(blockData)

    setTimelineData((currentTimeline) =>
      addSessionToTimeline(currentTimeline, newSession)
    )
  }

  function handleSaveSession(sessionData) {
    const newSession = createSessionFromBlocks(sessionData)

    setTimelineData((currentTimeline) =>
      addSessionToTimeline(currentTimeline, newSession)
    )
  }

  function handleSaveBlockToExistingSession(sessionId, blockData) {
    setTimelineData((currentTimeline) =>
      addBlockToExistingSession(currentTimeline, sessionId, blockData)
    )

    setTargetSession(null)
  }

  function handleUpdateSession(sessionId, updatedSessionData) {
    setTimelineData((currentTimeline) =>
      updateSessionInTimeline(currentTimeline, sessionId, updatedSessionData)
    )
  }

  function handleDeleteBlock(blockId) {
    const confirmed = confirm("Tem certeza que deseja excluir este bloco?")

    if (!confirmed) return

    setTimelineData((currentTimeline) =>
      removeBlockFromTimeline(currentTimeline, blockId)
    )
  }

  function handleDeleteSession(sessionId) {
    const confirmed = confirm(
      "Tem certeza que deseja excluir esta sessão inteira? Todos os blocos desta sessão também serão apagados."
    )

    if (!confirmed) return

    setTimelineData((currentTimeline) =>
      removeSessionFromTimeline(currentTimeline, sessionId)
    )
  }

  function handleResetTimeline() {
    const confirmed = confirm(
      "Tem certeza que deseja restaurar a timeline inicial? Os blocos criados localmente serão apagados."
    )

    if (!confirmed) return

    setTimelineData(timeline)
    localStorage.removeItem(STORAGE_KEY)
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