import { useEffect, useMemo, useState } from "react"
import { timeline } from "../data/timeline"
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

/**
 * Carrega a timeline salva localmente.
 * Caso não exista dado salvo ou o JSON esteja inválido, usa a base inicial.
 */
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

/**
 * Centraliza estado, persistência e ações da timeline.
 * Este hook mantém a página mais limpa e prepara o projeto para trocar
 * o localStorage por uma API no futuro.
 */
export function useTimelineData() {
  const [timelineData, setTimelineData] = useState(getInitialTimeline)

  /**
   * Blocos existentes usados por modais e conexões manuais.
   */
  const existingBlocks = useMemo(() => {
    return getAllBlocks(timelineData)
  }, [timelineData])

  /**
   * Persistência temporária do MVP.
   * Futuramente, essa responsabilidade pode ser movida para uma camada de API.
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timelineData))
  }, [timelineData])

  function saveBlock(blockData, editingBlock = null) {
    if (editingBlock) {
      setTimelineData((currentTimeline) =>
        updateBlockInTimeline(currentTimeline, blockData)
      )

      return
    }

    const newSession = createSessionFromBlock(blockData)

    setTimelineData((currentTimeline) =>
      addSessionToTimeline(currentTimeline, newSession)
    )
  }

  function saveSession(sessionData) {
    const newSession = createSessionFromBlocks(sessionData)

    setTimelineData((currentTimeline) =>
      addSessionToTimeline(currentTimeline, newSession)
    )
  }

  function saveBlockToExistingSession(sessionId, blockData) {
    setTimelineData((currentTimeline) =>
      addBlockToExistingSession(currentTimeline, sessionId, blockData)
    )
  }

  function updateSession(sessionId, updatedSessionData) {
    setTimelineData((currentTimeline) =>
      updateSessionInTimeline(currentTimeline, sessionId, updatedSessionData)
    )
  }

  function deleteBlock(blockId) {
    setTimelineData((currentTimeline) =>
      removeBlockFromTimeline(currentTimeline, blockId)
    )
  }

  function deleteSession(sessionId) {
    setTimelineData((currentTimeline) =>
      removeSessionFromTimeline(currentTimeline, sessionId)
    )
  }

  function resetTimeline() {
    setTimelineData(timeline)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    timelineData,
    existingBlocks,
    saveBlock,
    saveSession,
    saveBlockToExistingSession,
    updateSession,
    deleteBlock,
    deleteSession,
    resetTimeline,
  }
}