
import { timeline } from "../data/timeline"
import { PatientHeader } from "../components/PatientHeader"
import { Timeline } from "../components/Timeline"
import { RightPanel } from "../components/RightPanel"

export function PatientPage() {
  return (
    <main className="flex-1 p-8">
      <PatientHeader />

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Timeline timelineData={timeline} />
        <RightPanel />
      </div>
    </main>
  )
}