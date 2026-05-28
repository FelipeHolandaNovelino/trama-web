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
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

function getYearFromDate(dateString) {
  const [year] = dateString.split("-")
  return year
}

function getMonthLabelFromDate(dateString) {
  const [, month] = dateString.split("-")
  return monthLabels[Number(month) - 1]
}

function sortTimelineByYearDesc(timelineData) {
  return [...timelineData].sort((a, b) => Number(b.year) - Number(a.year))
}

function addBlockToTimeline(currentTimeline, newBlock) {
  const year = getYearFromDate(newBlock.date)
  const month = getMonthLabelFromDate(newBlock.date)

  const formattedBlock = {
    ...newBlock,
    date: formatDateToBrazilian(newBlock.date),
  }

  const yearExists = currentTimeline.some((yearGroup) => yearGroup.year === year)

  if (!yearExists) {
    return sortTimelineByYearDesc([
      {
        year,
        months: [
          {
            month,
            blocks: [formattedBlock],
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
            blocks: [formattedBlock],
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

        return {
          ...monthGroup,
          blocks: [formattedBlock, ...monthGroup.blocks],
        }
      }),
    }
  })
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
  const [timelineData, setTimelineData] = useState(getInitialTimeline)

  const existingBlocks = useMemo(() => {
    return timelineData.flatMap((yearGroup) =>
      yearGroup.months.flatMap((monthGroup) => monthGroup.blocks)
    )
  }, [timelineData])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timelineData))
  }, [timelineData])

  function handleSaveBlock(newBlock) {
    setTimelineData((currentTimeline) =>
      addBlockToTimeline(currentTimeline, newBlock)
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
      <PatientHeader
        patient={patient}
        onAddSession={() => setIsAddSessionModalOpen(true)}
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleResetTimeline}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Restaurar timeline inicial
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Timeline timelineData={timelineData} />
        <RightPanel patient={patient} />
      </div>

      <AddSessionModal
        isOpen={isAddSessionModalOpen}
        onClose={() => setIsAddSessionModalOpen(false)}
        onSaveBlock={handleSaveBlock}
        existingBlocks={existingBlocks}
      />
    </main>
  )
}