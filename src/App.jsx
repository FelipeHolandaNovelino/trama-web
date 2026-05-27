import { Sidebar } from "./components/Sidebar"
import { PatientPage } from "./pages/PatientPage"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar />
        <PatientPage />
      </div>
    </div>
  )
}