import { useState } from "react"

import { Sidebar } from "./components/Sidebar"
import { PatientPage } from "./pages/PatientPage"
import { PatientsPage } from "./pages/PatientsPage"
import { usePatientsData } from "./hooks/usePatientsData"

/**
 * Página temporária para abas que ainda não possuem uma tela própria.
 * Mantém a navegação funcional enquanto o MVP evolui por partes.
 */
function EmptyPage({ title, description }) {
  return (
    <main className="mx-auto w-full max-w-[1800px] px-8 py-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
          Trama
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          {title}
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </section>
    </main>
  )
}

export default function App() {
  /**
   * Controla a aba ativa da navegação principal.
   * A aba "Timeline" continua sendo a tela clínica principal do paciente.
   */
  const [activePage, setActivePage] = useState("Timeline")

  /**
   * Guarda o paciente aberto a partir da listagem.
   * A timeline agora é carregada individualmente pelo id desse paciente.
   */
  const [selectedPatient, setSelectedPatient] = useState(null)

  /**
   * Centraliza os dados de pacientes fora da página visual.
   * Isso mantém cadastro, edição, exclusão e estatísticas em um único hook.
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

  /**
   * Atualiza o paciente na lista e também mantém sincronizado o paciente
   * aberto na timeline, caso ele seja o mesmo que acabou de ser editado.
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
   * Exclui o paciente da lista e remove a seleção atual caso o paciente
   * excluído esteja aberto na timeline.
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

    if (activePage === "Sessões") {
      return (
        <EmptyPage
          title="Sessões"
          description="Esta área será usada futuramente para uma visão geral das sessões, separada do prontuário individual do paciente."
        />
      )
    }

    if (activePage === "Conexões") {
      return (
        <EmptyPage
          title="Conexões"
          description="Esta área poderá reunir conexões clínicas entre acontecimentos, emoções, relações e padrões observados."
        />
      )
    }

    if (activePage === "Tags") {
      return (
        <EmptyPage
          title="Tags"
          description="Esta área poderá organizar marcadores clínicos usados nos blocos da timeline."
        />
      )
    }

    if (activePage === "Relatórios") {
      return (
        <EmptyPage
          title="Relatórios"
          description="Esta área poderá concentrar relatórios, resumos clínicos e exportações futuras."
        />
      )
    }

    return (
      <EmptyPage
        title="Configurações"
        description="Esta área poderá reunir preferências do sistema, conta profissional e ajustes de segurança."
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar activePage={activePage} onChangePage={setActivePage} />

      {renderActivePage()}
    </div>
  )
}