/**
 * Normaliza textos para busca.
 *
 * A função remove diferenças de maiúsculas/minúsculas, espaços extras
 * e acentos, deixando a busca mais tolerante para o usuário.
 */
export function normalizeSearchText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

/**
 * Converte listas e textos do paciente em uma única string pesquisável.
 *
 * Isso permite buscar por nome, queixa, descrição, contato, status,
 * tags clínicas e pessoas importantes.
 */
export function buildPatientSearchText(patient = {}) {
  return [
    patient.name,
    patient.mainComplaint,
    patient.description,
    patient.email,
    patient.phone,
    patient.status,
    ...(patient.tags || []),
    ...(patient.relationships || []),
  ]
    .filter(Boolean)
    .join(" ")
}

/**
 * Filtra pacientes por termo de busca e status.
 *
 * A lista original não é alterada. A função apenas retorna uma nova lista
 * com os pacientes que correspondem aos filtros ativos.
 */
export function filterPatients(patients = [], searchTerm = "", statusFilter = "Todos") {
  const normalizedSearchTerm = normalizeSearchText(searchTerm)

  return patients.filter((patient) => {
    const matchesStatus =
      statusFilter === "Todos" || patient.status === statusFilter

    const patientSearchText = normalizeSearchText(buildPatientSearchText(patient))

    const matchesSearch =
      !normalizedSearchTerm || patientSearchText.includes(normalizedSearchTerm)

    return matchesStatus && matchesSearch
  })
}

/**
 * Verifica se existe algum filtro ativo na listagem.
 *
 * Essa função centraliza a regra usada para habilitar/desabilitar o botão
 * de limpar filtros e exibir o indicador visual de filtros ativos.
 */
export function hasPatientsFilters(searchTerm = "", statusFilter = "Todos") {
  return Boolean(searchTerm.trim() || statusFilter !== "Todos")
}