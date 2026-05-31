import { getSessionsFromMonth, monthLabels } from "./timelineUtils"

/**
 * Normaliza datas para o padrão brasileiro usado na interface.
 * Aceita datas em "yyyy-mm-dd" e mantém "dd/mm/yyyy" quando já estiver formatada.
 */
function formatDateToBrazilian(dateString) {
  if (!dateString) return ""

  if (dateString.includes("/")) {
    return dateString
  }

  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

/**
 * Converte datas brasileiras para o formato de input/comparação.
 * Isso permite extrair ano e mês sem depender do formato original.
 */
function formatDateToInput(dateString) {
  if (!dateString) return ""

  if (dateString.includes("-")) {
    return dateString
  }

  const [day, month, year] = dateString.split("/")
  return `${year}-${month}-${day}`
}

function getYearFromDate(dateString) {
  const inputDate = formatDateToInput(dateString)
  const [year] = inputDate.split("-")

  return year
}

function getMonthLabelFromDate(dateString) {
  const inputDate = formatDateToInput(dateString)
  const [, month] = inputDate.split("-")

  return monthLabels[Number(month) - 1]
}

function sortTimelineByYearDesc(timelineData) {
  return [...timelineData].sort((a, b) => Number(b.year) - Number(a.year))
}

/**
 * Cria uma sessão simples a partir de um único bloco.
 * Usado quando o usuário cria ou edita um bloco individualmente.
 */
export function createSessionFromBlock(newBlock) {
  const formattedSessionDate = formatDateToBrazilian(
    newBlock.sessionDate || newBlock.date
  )

  const formattedEventDate = formatDateToBrazilian(
    newBlock.eventDate || newBlock.date
  )

  const formattedBlock = {
    ...newBlock,
    sessionDate: formattedSessionDate,
    eventDate: formattedEventDate,
    date: formattedEventDate,
  }

  return {
    id: `session-${Date.now()}`,
    date: formattedSessionDate,
    title: `Sessão em ${formattedSessionDate}`,
    summary: formattedBlock.text,
    blocks: [formattedBlock],
  }
}

/**
 * Cria uma sessão completa com múltiplos blocos.
 * Mantém a data da sessão separada da data real de cada acontecimento.
 */
export function createSessionFromBlocks(sessionData) {
  const formattedSessionDate = formatDateToBrazilian(sessionData.date)

  return {
    ...sessionData,
    date: formattedSessionDate,
    blocks: sessionData.blocks.map((block) => {
      const formattedEventDate = formatDateToBrazilian(
        block.eventDate || block.date
      )

      return {
        ...block,
        sessionDate: formattedSessionDate,
        eventDate: formattedEventDate,
        date: formattedEventDate,
      }
    }),
  }
}

/**
 * Prepara um novo bloco para ser inserido dentro de uma sessão existente.
 */
function formatBlockForSession(blockData, sessionDate) {
  const formattedSessionDate = formatDateToBrazilian(sessionDate)
  const formattedEventDate = formatDateToBrazilian(
    blockData.eventDate || blockData.date
  )

  return {
    ...blockData,
    sessionDate: formattedSessionDate,
    eventDate: formattedEventDate,
    date: formattedEventDate,
  }
}

/**
 * Insere uma sessão na timeline, criando ano ou mês quando necessário.
 */
export function addSessionToTimeline(currentTimeline, newSession) {
  const year = getYearFromDate(newSession.date)
  const month = getMonthLabelFromDate(newSession.date)

  const yearExists = currentTimeline.some((yearGroup) => yearGroup.year === year)

  if (!yearExists) {
    return sortTimelineByYearDesc([
      {
        year,
        months: [
          {
            month,
            sessions: [newSession],
          },
        ],
      },
      ...currentTimeline,
    ])
  }

  return currentTimeline.map((yearGroup) => {
    if (yearGroup.year !== year) {
      return yearGroup
    }

    const monthExists = yearGroup.months.some(
      (monthGroup) => monthGroup.month === month
    )

    if (!monthExists) {
      return {
        ...yearGroup,
        months: [
          {
            month,
            sessions: [newSession],
          },
          ...yearGroup.months,
        ],
      }
    }

    return {
      ...yearGroup,
      months: yearGroup.months.map((monthGroup) => {
        if (monthGroup.month !== month) {
          return monthGroup
        }

        const existingSessions = getSessionsFromMonth(monthGroup)

        return {
          ...monthGroup,
          blocks: undefined,
          sessions: [newSession, ...existingSessions],
        }
      }),
    }
  })
}

/**
 * Adiciona um novo bloco dentro de uma sessão já existente.
 */
export function addBlockToExistingSession(currentTimeline, sessionId, blockData) {
  return currentTimeline.map((yearGroup) => ({
    ...yearGroup,
    months: yearGroup.months.map((monthGroup) => {
      const sessions = getSessionsFromMonth(monthGroup).map((session) => {
        if (session.id !== sessionId) {
          return session
        }

        const formattedBlock = formatBlockForSession(blockData, session.date)

        return {
          ...session,
          blocks: [...(session.blocks || []), formattedBlock],
        }
      })

      return {
        ...monthGroup,
        blocks: undefined,
        sessions,
      }
    }),
  }))
}

/**
 * Atualiza apenas os metadados da sessão.
 * A data não é alterada aqui para evitar mover sessão entre meses/anos sem controle.
 */
export function updateSessionInTimeline(
  currentTimeline,
  sessionId,
  updatedSessionData
) {
  return currentTimeline.map((yearGroup) => ({
    ...yearGroup,
    months: yearGroup.months.map((monthGroup) => {
      const sessions = getSessionsFromMonth(monthGroup).map((session) => {
        if (session.id !== sessionId) {
          return session
        }

        return {
          ...session,
          title: updatedSessionData.title,
          summary: updatedSessionData.summary,
        }
      })

      return {
        ...monthGroup,
        blocks: undefined,
        sessions,
      }
    }),
  }))
}

/**
 * Remove um bloco e limpa conexões que apontavam para ele.
 * Também remove sessões, meses e anos vazios.
 */
export function removeBlockFromTimeline(currentTimeline, blockIdToRemove) {
  return currentTimeline
    .map((yearGroup) => {
      const months = yearGroup.months
        .map((monthGroup) => {
          const sessions = getSessionsFromMonth(monthGroup)
            .map((session) => {
              const blocks = (session.blocks || [])
                .filter((block) => block.id !== blockIdToRemove)
                .map((block) => ({
                  ...block,
                  connections: (block.connections || []).filter(
                    (connection) =>
                      connection.targetBlockId !== blockIdToRemove
                  ),
                }))

              return {
                ...session,
                blocks,
              }
            })
            .filter((session) => session.blocks.length > 0)

          return {
            ...monthGroup,
            blocks: undefined,
            sessions,
          }
        })
        .filter((monthGroup) => getSessionsFromMonth(monthGroup).length > 0)

      return {
        ...yearGroup,
        months,
      }
    })
    .filter((yearGroup) => yearGroup.months.length > 0)
}

/**
 * Remove uma sessão inteira.
 * Além dos blocos da sessão, também limpa conexões externas que apontavam para eles.
 */
export function removeSessionFromTimeline(currentTimeline, sessionIdToRemove) {
  const blockIdsToRemove = currentTimeline.flatMap((yearGroup) =>
    yearGroup.months.flatMap((monthGroup) =>
      getSessionsFromMonth(monthGroup)
        .filter((session) => session.id === sessionIdToRemove)
        .flatMap((session) => session.blocks || [])
        .map((block) => block.id)
    )
  )

  return currentTimeline
    .map((yearGroup) => {
      const months = yearGroup.months
        .map((monthGroup) => {
          const sessions = getSessionsFromMonth(monthGroup)
            .filter((session) => session.id !== sessionIdToRemove)
            .map((session) => ({
              ...session,
              blocks: (session.blocks || []).map((block) => ({
                ...block,
                connections: (block.connections || []).filter(
                  (connection) =>
                    !blockIdsToRemove.includes(connection.targetBlockId)
                ),
              })),
            }))

          return {
            ...monthGroup,
            blocks: undefined,
            sessions,
          }
        })
        .filter((monthGroup) => getSessionsFromMonth(monthGroup).length > 0)

      return {
        ...yearGroup,
        months,
      }
    })
    .filter((yearGroup) => yearGroup.months.length > 0)
}

/**
 * Atualiza um bloco removendo a versão antiga e reinserindo a nova.
 * Isso permite que o bloco seja reposicionado caso a data da sessão mude.
 */
export function updateBlockInTimeline(currentTimeline, updatedBlock) {
  const timelineWithoutOldBlock = removeBlockFromTimeline(
    currentTimeline,
    updatedBlock.id
  )

  const newSession = createSessionFromBlock(updatedBlock)

  return addSessionToTimeline(timelineWithoutOldBlock, newSession)
}