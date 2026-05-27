import { useState } from "react"
import { timeline } from "../data/timeline"
import { patient } from "../data/patient"
import { PatientHeader } from "../components/PatientHeader"
import { Timeline } from "../components/Timeline"
import { RightPanel } from "../components/RightPanel"
import { AddSessionModal } from "../components/AddSessionModal"

export function PatientPage() {
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false)

  return (
    <main className="flex-1 p-8">
      <PatientHeader
        patient={patient}
        onAddSession={() => setIsAddSessionModalOpen(true)}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Timeline timelineData={timeline} />
        <RightPanel patient={patient} />
      </div>

      <AddSessionModal
        isOpen={isAddSessionModalOpen}
        onClose={() => setIsAddSessionModalOpen(false)}
      />
    </main>
  )
}