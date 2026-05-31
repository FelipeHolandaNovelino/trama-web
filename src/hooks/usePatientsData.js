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
 * Calcula a idade a partir da data de nascimento.
 * Usado como fallback quando o modal envia birthDate, mas não envia age.
 */
function calculateAgeFromBirthDate(birthDate) {
  if (!birthDate) return ""

  const today = new Date()
  const birth = new Date(`${birthDate}T00:00:00`)

  let age = today.getFullYear() - birth.getFullYear()
  const monthDifference = today.getMonth() - birth.getMonth()
  const dayDifference = today.getDate() - birth.getDate()

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age -= 1
  }

  return age >= 0 ? String(age) : ""
}

/**
 * Converte uma data ISO simples para o formato visual brasileiro.
 * Exemplo: 2026-03-27 → 27/03/2026.
 */
function formatDateToBrazilian(dateValue) {
  if (!dateValue) return "—"

  const [year, month, day] = dateValue.split("-")

  if (!year || !month || !day) return "—"

  return `${day}/${month}/${year}`
}

/**
 * Garante que campos em formato de lista sejam sempre arrays.
 * Isso evita erro visual quando dados antigos vierem como string ou undefined.
 */
function normalizeList(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

/**
 * Garante que cada paciente tenha os campos mínimos esperados pela interface.
 * Também preserva campos extras para não descartar dados criados anteriormente.
 */
function normalizePatientData(patientData = {}) {
  const birthDate = patientData.birthDate || ""
  const lastSessionDate = patientData.lastSessionDate || ""
  const nextSessionDate = patientData.nextSessionDate || ""

  return {
    ...patientData,
    id: patientData.id || createPatientId(patientData.name),
    name: patientData.name?.trim() || "Paciente sem nome",
    birthDate,
    age: patientData.age || calculateAgeFromBirthDate(birthDate),
    status: patientData.status || "Triagem inicial",
    email: patientData.email || "",
    phone: patientData.phone || "",
    treatmentStartDate: patientData.treatmentStartDate || "",
    mainComplaint: patientData.mainComplaint || "",
    lastSessionDate,
    nextSessionDate,
    lastSession:
      patientData.lastSession || formatDateToBrazilian(lastSessionDate),
    nextSession:
      patientData.nextSession || formatDateToBrazilian(nextSessionDate),
    description:
      patientData.description ||
      patientData.summary ||
      "Paciente sem descrição clínica inicial.",
    tags: normalizeList(patientData.tags),
    mirror: patientData.mirror || {
      centralWound: "",
      mainFear: "",
    },
    emotionalPatterns: normalizeList(patientData.emotionalPatterns),
    medications: normalizeList(patientData.medications),
    relationships: normalizeList(patientData.relationships),
  }
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
    return initialPatients.map(normalizePatientData)
  }

  try {
    const parsedPatients = JSON.parse(savedPatients)

    return Array.isArray(parsedPatients)
      ? parsedPatients.map(normalizePatientData)
      : initialPatients.map(normalizePatientData)
  } catch {
    return initialPatients.map(normalizePatientData)
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

    const closedPatients = patientsData.filter(
      (patient) => patient.status === "Encerrado"
    )

    return {
      total: patientsData.length,
      active: activePatients.length,
      screening: screeningPatients.length,
      closed: closedPatients.length,
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
    setPatientsData(initialPatients.map(normalizePatientData))
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