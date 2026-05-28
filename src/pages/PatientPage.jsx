import { useState } from "react"
import { timeline } from "../data/timeline"
import { patient } from "../data/patient"
import { PatientHeader } from "../components/PatientHeader"
import { Timeline } from "../components/Timeline"
import { RightPanel } from "../components/RightPanel"
import { AddSessionModal } from "../components/AddSessionModal"

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

function addBlockToTimeline(currentTimeline, newBlock) {
  const year = getYearFromDate(newBlock.date)
  const month = getMonthLabelFromDate(newBlock.date)

  const formattedBlock = {
    ...newBlock,
    date: formatDateToBrazilian(newBlock.date),
  }

  const yearExists = currentTimeline.some((yearGroup) => yearGroup.year === year)

  if (!yearExists) {
    return [
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
    ]
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

export function PatientPage() {
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false)
  const [timelineData, setTimelineData] = useState(timeline)

  function handleSaveBlock(newBlock) {
    setTimelineData((currentTimeline) =>
      addBlockToTimeline(currentTimeline, newBlock)
    )
  }

  return (
    <main className="flex-1 p-8">
      <PatientHeader
        patient={patient}
        onAddSession={() => setIsAddSessionModalOpen(true)}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Timeline timelineData={timelineData} />
        <RightPanel patient={patient} />
      </div>

      <AddSessionModal
        isOpen={isAddSessionModalOpen}
        onClose={() => setIsAddSessionModalOpen(false)}
        onSaveBlock={handleSaveBlock}
      />
    </main>
  )
}