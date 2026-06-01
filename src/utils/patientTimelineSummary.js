import { getTimelineSeedForPatient } from "../data/timelineSeeds"

const STORAGE_PREFIX = "trama_timeline_data"

/**
 * Cria a chave usada para salvar a timeline individual de cada paciente.
 *
 * Esta chave precisa seguir o mesmo padrão usado em useTimelineData.js,
 * porque o resumo do card deve ler exatamente os dados reais da timeline.
 */
function getTimelineStorageKey(patientId) {
  return `${STORAGE_PREFIX}_${patientId}`
}

/**
 * Lê a timeline salva no localStorage.
 *
 * Se não existir timeline salva, retorna null para permitir que a função
 * principal tente carregar um seed demonstrativo, quando houver.
 */
function getSavedTimeline(patientId) {
  if (!patientId || typeof localStorage === "undefined") {
    return null
  }

  const storageKey = getTimelineStorageKey(patientId)
  const savedTimeline = localStorage.getItem(storageKey)

  if (!savedTimeline) {
    return null
  }

  try {
    const parsedTimeline = JSON.parse(savedTimeline)

    return Array.isArray(parsedTimeline) ? parsedTimeline : null
  } catch {
    return null
  }
}

/**
 * Conta sessões, blocos e conexões dentro da estrutura da timeline.
 *
 * A função percorre o formato padrão:
 * ano → mês → sessões → blocos.
 */
function countTimelineItems(timelineData = []) {
  return timelineData.reduce(
    (summary, yearGroup) => {
      const months = yearGroup.months || []

      months.forEach((monthGroup) => {
        const sessions = monthGroup.sessions || []

        sessions.forEach((session) => {
          const blocks = session.blocks || []

          summary.sessionsCount += 1
          summary.blocksCount += blocks.length

          blocks.forEach((block) => {
            summary.connectionsCount += block.connections?.length || 0
          })
        })
      })

      return summary
    },
    {
      sessionsCount: 0,
      blocksCount: 0,
      connectionsCount: 0,
    }
  )
}

/**
 * Retorna o resumo da timeline de um paciente.
 *
 * Prioridade:
 * 1. timeline salva no localStorage;
 * 2. seed demonstrativo, se existir;
 * 3. timeline vazia.
 */
export function getPatientTimelineSummary(patientId) {
  const savedTimeline = getSavedTimeline(patientId)
  const timelineData = savedTimeline || getTimelineSeedForPatient(patientId)
  const summary = countTimelineItems(timelineData)

  return {
    ...summary,
    hasTimeline: summary.sessionsCount > 0,
  }
}

/**
 * Cria um mapa de resumos por paciente.
 *
 * Isso evita que cada PatientCard precise conhecer localStorage, seeds
 * ou estrutura interna da timeline.
 */
export function getPatientsTimelineSummaries(patients = []) {
  return patients.reduce((summaries, patient) => {
    summaries[patient.id] = getPatientTimelineSummary(patient.id)

    return summaries
  }, {})
}