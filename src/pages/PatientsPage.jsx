import { useState } from "react"

import { AddPatientModal } from "../components/AddPatientModal"

/**
 * Gera as iniciais do nome do paciente para uso no avatar textual.
 * Essa solução evita depender de imagens enquanto o cadastro real não existe.
 */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function PatientsPage({
  patients = [],
  patientStats,
  onOpenPatient,
  onCreatePatient,
}) {
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false)

  /**
   * Os contadores vêm do hook usePatientsData.
   * Caso a página seja usada isoladamente no futuro, o fallback evita erro visual.
   */
  const stats = patientStats || {
    total: patients.length,
    active: 0,
    screening: 0,
  }

  function handleOpenAddPatientModal() {
    setIsAddPatientModalOpen(true)
  }

  function handleCloseAddPatientModal() {
    setIsAddPatientModalOpen(false)
  }

  return (
    <main className="mx-auto w-full max-w-[1800px] px-8 py-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
              Pacientes
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Lista de pacientes
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Acesse os prontuários clínicos, acompanhe sessões e organize a
              linha da vida emocional de cada paciente.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddPatientModal}
            className="rounded-2xl bg-violet-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-900"
          >
            + Novo paciente
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total de pacientes</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">
            {stats.total}
          </strong>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Em acompanhamento</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">
            {stats.active}
          </strong>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Triagem inicial</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">
            {stats.screening}
          </strong>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-3">
        {patients.map((patient) => (
          <article
            key={patient.id}
            className="flex min-h-[360px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-sm font-black text-violet-800">
                    {getInitials(patient.name)}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-950">
                      {patient.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {patient.age
                        ? `${patient.age} anos`
                        : "Idade não informada"}
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {patient.status}
                </span>
              </div>

              {patient.mainComplaint && (
                <p className="mt-5 text-sm font-medium text-slate-700">
                  {patient.mainComplaint}
                </p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {patient.description ||
                  "Paciente sem descrição clínica inicial."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {(patient.tags || []).slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Última sessão</span>
                  <strong className="font-semibold text-slate-800">
                    {patient.lastSession}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Próxima sessão</span>
                  <strong className="font-semibold text-slate-800">
                    {patient.nextSession}
                  </strong>
                </div>
              </div>

              {/*
                A navegação ainda é controlada pelo App.jsx.
                Futuramente, esse clique pode ser substituído por uma rota real.
              */}
              <button
                type="button"
                onClick={() => onOpenPatient(patient)}
                className="mt-5 w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
              >
                Abrir paciente
              </button>
            </div>
          </article>
        ))}
      </section>

      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={handleCloseAddPatientModal}
        onCreatePatient={onCreatePatient}
      />
    </main>
  )
}