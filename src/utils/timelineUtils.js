export const monthLabels = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
]

export const monthNames = {
  JAN: "Janeiro",
  FEV: "Fevereiro",
  MAR: "Março",
  ABR: "Abril",
  MAI: "Maio",
  JUN: "Junho",
  JUL: "Julho",
  AGO: "Agosto",
  SET: "Setembro",
  OUT: "Outubro",
  NOV: "Novembro",
  DEZ: "Dezembro",
}

/**
 * Mantém compatibilidade entre dados antigos e novos.
 * Meses antigos podem ter blocos soltos; meses novos possuem sessões.
 */
export function getSessionsFromMonth(monthGroup) {
  if (!monthGroup) return []

  if (monthGroup.sessions) {
    return monthGroup.sessions
  }

  const blocks = monthGroup.blocks || []

  const sessionsByDate = blocks.reduce((sessions, block) => {
    const date = block.sessionDate || block.date

    if (!sessions[date]) {
      sessions[date] = []
    }

    sessions[date].push(block)

    return sessions
  }, {})

  return Object.entries(sessionsByDate).map(([date, sessionBlocks], index) => ({
    id: `session-${date}-${index}`,
    date,
    title: `Sessão ${index + 1}`,
    summary: sessionBlocks[0]?.text || "",
    blocks: sessionBlocks,
  }))
}

/**
 * Centraliza todos os blocos da timeline em uma lista única.
 * Essa lista alimenta Emoções, Relações, Espelho e navegação por conexões.
 */
export function getAllBlocks(timelineData) {
  return timelineData
    .flatMap((yearGroup) =>
      yearGroup.months.flatMap((monthGroup) =>
        getSessionsFromMonth(monthGroup).flatMap((session) =>
          (session.blocks || []).map((block) => ({
            ...block,
            sessionDate: block.sessionDate || session.date || block.date,
            eventDate: block.eventDate || block.date,
          }))
        )
      )
    )
    .filter(Boolean)
}

export function getAllSessions(timelineData) {
  return timelineData.flatMap((yearGroup) =>
    yearGroup.months.flatMap((monthGroup) => getSessionsFromMonth(monthGroup))
  )
}

/**
 * Agrupa blocos por campos que são listas, como emoções, pessoas ou tags.
 */
export function groupBlocksByArrayField(blocks, fieldName) {
  return blocks.reduce((groups, block) => {
    const values = block[fieldName] || []

    values.forEach((value) => {
      if (!groups[value]) {
        groups[value] = []
      }

      groups[value].push(block)
    })

    return groups
  }, {})
}

export function getAvailableYears(timelineData) {
  return timelineData.map((yearGroup) => yearGroup.year)
}

export function getYearGroup(timelineData, selectedYear) {
  return timelineData.find((yearGroup) => yearGroup.year === selectedYear)
}

export function getMonthGroup(yearGroup, selectedMonth) {
  if (!yearGroup) return null

  return yearGroup.months.find((monthGroup) => monthGroup.month === selectedMonth)
}

export function getMonthSessions(yearGroup, month) {
  const monthGroup = getMonthGroup(yearGroup, month)
  return getSessionsFromMonth(monthGroup)
}

export function getDayFromDate(date) {
  if (!date) return "--"

  if (date.includes("/")) {
    return date.split("/")[0]
  }

  if (date.includes("-")) {
    return date.split("-")[2]
  }

  return "--"
}

export function getMonthNumberFromDate(date) {
  if (!date) return ""

  if (date.includes("/")) {
    return date.split("/")[1]
  }

  if (date.includes("-")) {
    return date.split("-")[1]
  }

  return ""
}

/**
 * Converte datas brasileiras para um formato comparável.
 * Aceita "dd/mm/yyyy" e "yyyy-mm-dd".
 */
export function formatDateToComparable(dateString) {
  if (!dateString) return ""

  if (dateString.includes("-")) {
    return dateString
  }

  const [day, month, year] = dateString.split("/")
  return `${year}-${month}-${day}`
}

export function getYearFromEventDate(dateString) {
  const comparableDate = formatDateToComparable(dateString)
  return comparableDate.split("-")[0]
}

export function getMonthFromEventDate(dateString) {
  const comparableDate = formatDateToComparable(dateString)
  const [, month] = comparableDate.split("-")

  return monthLabels[Number(month) - 1] || ""
}

export function sortBlocksByEventDate(blocks) {
  return [...blocks].sort((firstBlock, secondBlock) => {
    const firstDate = formatDateToComparable(firstBlock.eventDate)
    const secondDate = formatDateToComparable(secondBlock.eventDate)

    return firstDate.localeCompare(secondDate)
  })
}

export function getTotalBlocksFromSessions(sessions) {
  return sessions.reduce((total, session) => {
    return total + (session.blocks || []).length
  }, 0)
}

export function getMostCommonBlockTypesFromSessions(sessions) {
  const blocks = sessions.flatMap((session) => session.blocks || [])

  return blocks.slice(0, 5).map((block) => block.type)
}

/**
 * Cria um índice por ID para localizar blocos conectados rapidamente.
 */
export function getBlocksById(blocks) {
  return blocks.reduce((accumulator, block) => {
    if (!block?.id) return accumulator

    accumulator[block.id] = block
    return accumulator
  }, {})
}

/**
 * Define quais blocos aparecem como eventos principais no Espelho.
 * Blocos que são alvo de conexão aparecem como desdobramentos.
 */
export function getMirrorMainBlocks(blocks) {
  const targetIds = new Set(
    blocks.flatMap((block) =>
      (block.connections || []).map((connection) => connection.targetBlockId)
    )
  )

  return sortBlocksByEventDate(blocks).filter((block) => !targetIds.has(block.id))
}

export function getMirrorConnectedBlocks(block, blocksById) {
  return (block.connections || [])
    .map((connection) => {
      const connectedBlock = blocksById[connection.targetBlockId]

      if (!connectedBlock) return null

      return {
        ...connectedBlock,
        connectionReason: connection.reason,
        connectionStrength: connection.strength,
      }
    })
    .filter(Boolean)
}

export function getUniquePeopleCount(blocks) {
  const people = new Set()

  blocks.forEach((block) => {
    ;(block.people || []).forEach((person) => people.add(person))
  })

  return people.size
}

export function getConnectionsCount(blocks) {
  return blocks.reduce((total, block) => {
    return total + (block.connections || []).length
  }, 0)
}