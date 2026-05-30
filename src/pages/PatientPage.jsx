import { useEffect, useMemo, useState } from "react"
import { timeline } from "../data/timeline"
import { patient } from "../data/patient"
import { PatientHeader } from "../components/PatientHeader"
import { Timeline } from "../components/Timeline"
import { RightPanel } from "../components/RightPanel"
import { AddSessionModal } from "../components/AddSessionModal"

const STORAGE_KEY = "trama_timeline_data"

const monthLabels = [
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

function formatDateToBrazilian(dateString) {
  if (!dateString) return ""

  if (dateString.includes("/")) {
    return dateString
  }

  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

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

function getSessionsFromMonth(monthGroup) {
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

function getAllBlocksFromTimeline(timelineData) {
  return timelineData.flatMap((yearGroup) =>
    yearGroup.months.flatMap((monthGroup) =>
      getSessionsFromMonth(monthGroup).flatMap((session) => session.blocks || [])
    )
  )
}

function createSessionFromBlock(newBlock) {
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

function createSessionFromBlocks(sessionData) {
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

function addSessionToTimeline(currentTimeline, newSession) {
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

function addBlockToExistingSession(currentTimeline, sessionId, blockData) {
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

function updateSessionInTimeline(currentTimeline, sessionId, updatedSessionData) {
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

function removeBlockFromTimeline(currentTimeline, blockIdToRemove) {
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

function removeSessionFromTimeline(currentTimeline, sessionIdToRemove) {
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

function updateBlockInTimeline(currentTimeline, updatedBlock) {
  const timelineWithoutOldBlock = removeBlockFromTimeline(
    currentTimeline,
    updatedBlock.id
  )

  const newSession = createSessionFromBlock(updatedBlock)

  return addSessionToTimeline(timelineWithoutOldBlock, newSession)
}

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

  const existingBlocks = useMemo(() => {
    return getAllBlocksFromTimeline(timelineData)
  }, [timelineData])

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
    <main className="flex-1 p-8">
      <PatientHeader patient={patient} onAddSession={handleOpenAddSession} />

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleResetTimeline}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Restaurar timeline inicial
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Timeline
          timelineData={timelineData}
          onDeleteBlock={handleDeleteBlock}
          onEditBlock={handleEditBlock}
          onAddBlockToSession={handleAddBlockToSession}
          onUpdateSession={handleUpdateSession}
          onDeleteSession={handleDeleteSession}
        />

        <RightPanel patient={patient} timelineData={timelineData} />
      </div>

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