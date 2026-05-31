import { useState } from "react"

import { Sidebar } from "./components/Sidebar"
import { PatientPage } from "./pages/PatientPage"
import { PatientsPage } from "./pages/PatientsPage"

/**
 * Página temporária para abas que ainda não possuem uma tela própria.
 * Mantém a navegação funcional sem quebrar o fluxo principal do projeto.
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
   * Guarda o paciente selecionado na listagem.
   * Por enquanto, todos ainda compartilham a mesma timeline local.
   */
  const [selectedPatient, setSelectedPatient] = useState(null)

  /**
   * Ao abrir um paciente pela listagem, o usuário é levado para a tela clínica.
   * Isso evita que a lista de pacientes apareça dentro da timeline.
   */
  function handleOpenPatient(patient) {
    setSelectedPatient(patient)
    setActivePage("Timeline")
  }

  /**
   * Define qual conteúdo deve aparecer abaixo da navegação.
   * Apenas a aba "Pacientes" renderiza a lista de pacientes.
   */
  function renderActivePage() {
    if (activePage === "Pacientes") {
      return <PatientsPage onOpenPatient={handleOpenPatient} />
    }

    if (activePage === "Timeline") {
      return <PatientPage selectedPatient={selectedPatient} />
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