import { useEffect, useMemo, useState } from "react"

import { patients as initialPatients } from "../data/patients"

const STORAGE_KEY = "trama_patients_data"

/**
 * Gera um identificador simples para pacientes criados localmente.
 *
 * No futuro, essa responsabilidade deve sair do front-end e passar para
 * o backend/banco de dados.
 */
function createPatientId(name = "paciente") {
  const normalizedName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  return `${normalizedName || "paciente"}-${Date.now()}`
}

/**
 * Carrega os pacientes salvos no navegador.
 *
 * Caso não exista dado salvo ou o JSON esteja inválido, o sistema usa
 * a lista inicial definida em src/data/patients.js.
 */
function getInitialPatients() {
  const savedPatients = localStorage.getItem(STORAGE_KEY)

  if (!savedPatients) {
    return initialPatients
  }

  try {
    const parsedPatients = JSON.parse(savedPatients)

    return Array.isArray(parsedPatients) ? parsedPatients : initialPatients
  } catch {
    return initialPatients
  }
}

/**
 * Garante que um paciente criado pelo formulário tenha todos os campos
 * mínimos usados pela interface atual.
 */
function normalizePatientData(patientData) {
  return {
    id: patientData.id || createPatientId(patientData.name),
    name: patientData.name?.trim() || "Paciente sem nome",
    age: patientData.age || "",
    status: patientData.status || "Triagem inicial",
    mainComplaint: patientData.mainComplaint || "",
    lastSession: patientData.lastSession || "—",
    nextSession: patientData.nextSession || "—",
    description: patientData.description || "",
    tags: patientData.tags || [],
    mirror: patientData.mirror || {
      centralWound: "",
      mainFear: "",
    },
    emotionalPatterns: patientData.emotionalPatterns || [],
    medications: patientData.medications || [],
    relationships: patientData.relationships || [],
  }
}

/**
 * Centraliza estado, persistência e ações relacionadas aos pacientes.
 *
 * Este hook prepara a tela de pacientes para cadastro real sem colocar
 * regras de dados dentro da página visual.
 */
export function usePatientsData() {
  const [patientsData, setPatientsData] = useState(getInitialPatients)

  /**
   * Contadores derivados usados pela tela de pacientes.
   * Mantê-los aqui evita duplicar cálculos quando outras telas precisarem deles.
   */
  const patientStats = useMemo(() => {
    const activePatients = patientsData.filter(
      (patient) => patient.status === "Em acompanhamento"
    )

    const screeningPatients = patientsData.filter(
      (patient) => patient.status === "Triagem inicial"
    )

    return {
      total: patientsData.length,
      active: activePatients.length,
      screening: screeningPatients.length,
    }
  }, [patientsData])

  /**
   * Persistência temporária do MVP.
   * Futuramente, essa camada pode ser substituída por chamadas para uma API.
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patientsData))
  }, [patientsData])

  function createPatient(patientData) {
    const newPatient = normalizePatientData(patientData)

    setPatientsData((currentPatients) => [...currentPatients, newPatient])
  }

  function updatePatient(patientId, updatedPatientData) {
    setPatientsData((currentPatients) =>
      currentPatients.map((patient) => {
        if (patient.id !== patientId) {
          return patient
        }

        return normalizePatientData({
          ...patient,
          ...updatedPatientData,
          id: patient.id,
        })
      })
    )
  }

  function deletePatient(patientId) {
    setPatientsData((currentPatients) =>
      currentPatients.filter((patient) => patient.id !== patientId)
    )
  }

  function resetPatients() {
    setPatientsData(initialPatients)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    patients: patientsData,
    patientStats,
    createPatient,
    updatePatient,
    deletePatient,
    resetPatients,
  }
}