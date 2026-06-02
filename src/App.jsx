import { useState } from "react"

import { Sidebar } from "./components/Sidebar"
import { HomePage } from "./pages/HomePage"
import { PatientPage } from "./pages/PatientPage"
import { PatientsPage } from "./pages/PatientsPage"
import { usePatientsData } from "./hooks/usePatientsData"

export default function App() {
  /**
   * Controla a tela ativa da navegação principal.
   *
   * A timeline não aparece mais no menu lateral.
   * Ela é aberta ao selecionar um paciente.
   */
  const [activePage, setActivePage] = useState("Home")

  /**
   * Guarda o paciente aberto a partir da listagem ou da Home.
   */
  const [selectedPatient, setSelectedPatient] = useState(null)

  /**
   * Centraliza os dados de pacientes.
   */
  const {
    patients,
    patientStats,
    createPatient,
    updatePatient,
    deletePatient,
  } = usePatientsData()

  function handleOpenPatient(patient) {
    setSelectedPatient(patient)
    setActivePage("Timeline")
  }

  function handleBackToPatients() {
    setActivePage("Pacientes")
  }

  function handleGoToPatients() {
    setActivePage("Pacientes")
  }

  /**
   * Atualiza o paciente na lista e sincroniza o paciente aberto,
   * caso ele seja o mesmo que acabou de ser editado.
   */
  function handleUpdatePatient(patientId, updatedPatientData) {
    updatePatient(patientId, updatedPatientData)

    setSelectedPatient((currentPatient) => {
      if (!currentPatient || currentPatient.id !== patientId) {
        return currentPatient
      }

      return {
        ...currentPatient,
        ...updatedPatientData,
        id: currentPatient.id,
      }
    })
  }

  /**
   * Exclui o paciente e limpa a seleção se ele estiver aberto.
   */
  function handleDeletePatient(patientId) {
    deletePatient(patientId)

    setSelectedPatient((currentPatient) => {
      if (!currentPatient || currentPatient.id !== patientId) {
        return currentPatient
      }

      return null
    })
  }

  function renderActivePage() {
    if (activePage === "Home") {
      return (
        <HomePage
          patients={patients}
          patientStats={patientStats}
          onGoToPatients={handleGoToPatients}
          onOpenPatient={handleOpenPatient}
        />
      )
    }

    if (activePage === "Pacientes") {
      return (
        <PatientsPage
          patients={patients}
          patientStats={patientStats}
          onOpenPatient={handleOpenPatient}
          onCreatePatient={createPatient}
          onUpdatePatient={handleUpdatePatient}
          onDeletePatient={handleDeletePatient}
        />
      )
    }

    if (activePage === "Timeline") {
      return (
        <PatientPage
          selectedPatient={selectedPatient}
          onBackToPatients={handleBackToPatients}
        />
      )
    }

    return (
      <HomePage
        patients={patients}
        patientStats={patientStats}
        onGoToPatients={handleGoToPatients}
        onOpenPatient={handleOpenPatient}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 xl:pl-72">
      <Sidebar activePage={activePage} onChangePage={setActivePage} />

      {renderActivePage()}
    </div>
  )
}