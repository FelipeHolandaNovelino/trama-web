import { timeline } from "./data/timeline"
import { Sidebar } from "./components/Sidebar"
import { PatientHeader } from "./components/PatientHeader"
import { Timeline } from "./components/Timeline"
import { RightPanel } from "./components/RightPanel"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <PatientHeader />

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            <Timeline timelineData={timeline} />
            <RightPanel />
          </div>
        </main>
      </div>
    </div>
  )
}