import { useEffect, useMemo, useState } from "react"

import { getTimelineSeedForPatient } from "../data/timelineSeeds"
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

const STORAGE_PREFIX = "trama_timeline_data"
const DEFAULT_PATIENT_ID = "joao-luiz"

/**
 * Cria a chave de persistência da timeline para um paciente específico.
 *
 * Cada paciente possui sua própria timeline no localStorage.
 * Isso impede que sessões, blocos e conexões sejam compartilhados entre pacientes.
 */
function getTimelineStorageKey(patientId) {
  return `${STORAGE_PREFIX}_${patientId || DEFAULT_PATIENT_ID}`
}

/**
 * Retorna a timeline inicial de um paciente.
 *
 * Pacientes com seed demonstrativo recebem uma base inicial.
 * Pacientes sem seed começam com timeline vazia e serão preenchidos manualmente.
 */
function getDefaultTimelineForPatient(patientId) {
  return getTimelineSeedForPatient(patientId)
}

/**
 * Carrega a timeline salva de um paciente.
 *
 * Se não existir dado salvo, o sistema usa a timeline inicial daquele paciente.
 * Para pacientes sem seed, essa timeline inicial será vazia.
 */
function getInitialTimeline(patientId) {
  const storageKey = getTimelineStorageKey(patientId)
  const savedTimeline = localStorage.getItem(storageKey)

  if (!savedTimeline) {
    return getDefaultTimelineForPatient(patientId)
  }

  try {
    const parsedTimeline = JSON.parse(savedTimeline)

    return Array.isArray(parsedTimeline)
      ? parsedTimeline
      : getDefaultTimelineForPatient(patientId)
  } catch {
    return getDefaultTimelineForPatient(patientId)
  }
}

/**
 * Centraliza estado, persistência e ações da timeline.
 *
 * O hook recebe um patientId para garantir que cada paciente tenha sua própria
 * linha clínica, independente dos demais pacientes cadastrados.
 */
export function useTimelineData(patientId = DEFAULT_PATIENT_ID) {
  const safePatientId = patientId || DEFAULT_PATIENT_ID

  const [timelineState, setTimelineState] = useState(() => ({
    patientId: safePatientId,
    data: getInitialTimeline(safePatientId),
  }))

  /**
   * Quando o paciente aberto muda, carregamos a timeline específica dele.
   * Isso separa completamente os prontuários clínicos no estado local.
   */
  useEffect(() => {
    setTimelineState({
      patientId: safePatientId,
      data: getInitialTimeline(safePatientId),
    })
  }, [safePatientId])

  const timelineData =
    timelineState.patientId === safePatientId ? timelineState.data : []

  /**
   * Blocos existentes usados pelos modais e pelas conexões manuais.
   */
  const existingBlocks = useMemo(() => {
    return getAllBlocks(timelineData)
  }, [timelineData])

  /**
   * Persiste somente a timeline do paciente atualmente aberto.
   * Cada paciente salva seus dados em uma chave própria no localStorage.
   *
   * Quando um paciente com seed é aberto pela primeira vez, o seed passa a ser
   * salvo na mesma chave usada por sessões criadas manualmente.
   */
  useEffect(() => {
    if (timelineState.patientId !== safePatientId) {
      return
    }

    const storageKey = getTimelineStorageKey(safePatientId)

    localStorage.setItem(storageKey, JSON.stringify(timelineState.data))
  }, [safePatientId, timelineState])

  /**
   * Aplica alterações na timeline do paciente atual.
   *
   * Centralizar essa atualização evita repetição nas ações de criação,
   * edição e exclusão.
   */
  function updateCurrentTimeline(updater) {
    setTimelineState((currentState) => {
      const currentData =
        currentState.patientId === safePatientId
          ? currentState.data
          : getInitialTimeline(safePatientId)

      return {
        patientId: safePatientId,
        data: updater(currentData),
      }
    })
  }

  function saveBlock(blockData, editingBlock = null) {
    if (editingBlock) {
      updateCurrentTimeline((currentTimeline) =>
        updateBlockInTimeline(currentTimeline, blockData)
      )

      return
    }

    const newSession = createSessionFromBlock(blockData)

    updateCurrentTimeline((currentTimeline) =>
      addSessionToTimeline(currentTimeline, newSession)
    )
  }

  function saveSession(sessionData) {
    const newSession = createSessionFromBlocks(sessionData)

    updateCurrentTimeline((currentTimeline) =>
      addSessionToTimeline(currentTimeline, newSession)
    )
  }

  function saveBlockToExistingSession(sessionId, blockData) {
    updateCurrentTimeline((currentTimeline) =>
      addBlockToExistingSession(currentTimeline, sessionId, blockData)
    )
  }

  function updateSession(sessionId, updatedSessionData) {
    updateCurrentTimeline((currentTimeline) =>
      updateSessionInTimeline(currentTimeline, sessionId, updatedSessionData)
    )
  }

  function deleteBlock(blockId) {
    updateCurrentTimeline((currentTimeline) =>
      removeBlockFromTimeline(currentTimeline, blockId)
    )
  }

  function deleteSession(sessionId) {
    updateCurrentTimeline((currentTimeline) =>
      removeSessionFromTimeline(currentTimeline, sessionId)
    )
  }

  /**
   * Restaura a timeline apenas do paciente atual.
   *
   * Pacientes com seed voltam para sua base demonstrativa.
   * Pacientes sem seed voltam para uma timeline vazia.
   */
  function resetTimeline() {
    const storageKey = getTimelineStorageKey(safePatientId)
    const defaultTimeline = getDefaultTimelineForPatient(safePatientId)

    localStorage.removeItem(storageKey)

    setTimelineState({
      patientId: safePatientId,
      data: defaultTimeline,
    })
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