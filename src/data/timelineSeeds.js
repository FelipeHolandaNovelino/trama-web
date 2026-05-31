const MONTH_LABELS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
]

const ANA_PATIENT_ID = "ana-luiza"

/**
 * Sessões demonstrativas da paciente Ana Luiza.
 *
 * Este array representa apenas a base de demonstração.
 * No uso real do sistema, novas sessões continuam sendo criadas manualmente
 * pelo fluxo normal da timeline.
 */
const anaSessionTopics = [
  {
    date: "02/04/2026",
    title: "Triagem e ansiedade no trabalho",
    summary:
      "Primeira sessão focada em ansiedade profissional, autocobrança e medo de falhar.",
    focus: "ansiedade no trabalho",
    people: ["Chefe", "Equipe"],
    tags: ["trabalho", "ansiedade", "autocobrança"],
  },
  {
    date: "09/04/2026",
    title: "Sobrecarga e dificuldade de dizer não",
    summary:
      "Ana relata assumir tarefas além do limite e sentir culpa ao tentar se posicionar.",
    focus: "limites profissionais",
    people: ["Chefe", "Colega"],
    tags: ["limites", "sobrecarga", "culpa"],
  },
  {
    date: "16/04/2026",
    title: "Relação com a mãe e disponibilidade emocional",
    summary:
      "A sessão aprofunda a sensação de responsabilidade pelo estado emocional da mãe.",
    focus: "culpa familiar",
    people: ["Mãe"],
    tags: ["família", "culpa", "responsabilidade"],
  },
  {
    date: "23/04/2026",
    title: "Conflito conjugal e medo de decepcionar",
    summary:
      "Ana explora a dificuldade de expressar cansaço sem sentir que está falhando com a parceira.",
    focus: "vínculo conjugal",
    people: ["Parceira"],
    tags: ["relacionamento", "presença", "culpa"],
  },
  {
    date: "30/04/2026",
    title: "Memória escolar e medo de errar",
    summary:
      "A paciente associa cobranças atuais a experiências antigas de exposição e vergonha.",
    focus: "vergonha e erro",
    people: ["Professora", "Chefe"],
    tags: ["vergonha", "erro", "perfeccionismo"],
  },
  {
    date: "07/05/2026",
    title: "Pai, desempenho e reconhecimento",
    summary:
      "A sessão trabalha a relação entre performance, reconhecimento paterno e valor pessoal.",
    focus: "reconhecimento condicionado",
    people: ["Pai", "Chefe"],
    tags: ["desempenho", "reconhecimento", "família"],
  },
  {
    date: "14/05/2026",
    title: "Crise de ansiedade em reunião",
    summary:
      "Ana relata sintomas físicos intensos antes de uma apresentação profissional.",
    focus: "exposição profissional",
    people: ["Chefe", "Equipe"],
    tags: ["ansiedade", "exposição", "corpo"],
  },
  {
    date: "21/05/2026",
    title: "Descanso, culpa e produtividade",
    summary:
      "A paciente percebe dificuldade de descansar sem sentir que está desperdiçando tempo.",
    focus: "culpa ao descansar",
    people: ["Parceira", "Pai"],
    tags: ["descanso", "produtividade", "culpa"],
  },
  {
    date: "28/05/2026",
    title: "Relação com colega e comparação",
    summary:
      "Ana relata comparação com uma colega e medo de estar ficando para trás.",
    focus: "comparação profissional",
    people: ["Colega", "Chefe"],
    tags: ["comparação", "trabalho", "autoimagem"],
  },
  {
    date: "04/06/2026",
    title: "Autonomia e medo de conflito",
    summary:
      "A sessão explora o medo de se posicionar e produzir desconforto nos vínculos.",
    focus: "autonomia",
    people: ["Mãe", "Parceira"],
    tags: ["autonomia", "conflito", "limites"],
  },
  {
    date: "11/06/2026",
    title: "Fadiga emocional e sensação de vazio",
    summary:
      "Ana descreve cansaço persistente e dificuldade de reconhecer desejos próprios.",
    focus: "fadiga emocional",
    people: ["Parceira"],
    tags: ["exaustão", "vazio", "desejo"],
  },
  {
    date: "18/06/2026",
    title: "Infância e papel de filha responsável",
    summary:
      "A paciente retoma memórias de ser vista como madura e responsável desde cedo.",
    focus: "parentificação",
    people: ["Mãe", "Pai"],
    tags: ["infância", "responsabilidade", "família"],
  },
  {
    date: "25/06/2026",
    title: "Comunicação afetiva e pedido de espaço",
    summary:
      "Ana tenta comunicar necessidade de tempo sozinha sem transformar isso em rejeição.",
    focus: "comunicação afetiva",
    people: ["Parceira"],
    tags: ["comunicação", "espaço", "vínculo"],
  },
  {
    date: "02/07/2026",
    title: "Promoção no trabalho e ambivalência",
    summary:
      "A possibilidade de promoção desperta orgulho, medo e expectativa de sobrecarga.",
    focus: "promoção e medo",
    people: ["Chefe"],
    tags: ["carreira", "promoção", "ambivalência"],
  },
  {
    date: "09/07/2026",
    title: "Raiva reprimida e culpa posterior",
    summary:
      "A sessão explora situações em que Ana sente raiva, mas logo transforma a emoção em culpa.",
    focus: "raiva e culpa",
    people: ["Mãe", "Colega"],
    tags: ["raiva", "culpa", "limites"],
  },
  {
    date: "16/07/2026",
    title: "Medo de abandono e necessidade de controle",
    summary:
      "Ana percebe que tenta controlar respostas e disponibilidade para evitar abandono.",
    focus: "medo de abandono",
    people: ["Parceira", "Mãe"],
    tags: ["abandono", "controle", "vínculo"],
  },
  {
    date: "23/07/2026",
    title: "Primeiro experimento de limite",
    summary:
      "Ana relata ter recusado uma demanda pequena e observado culpa sem recuar imediatamente.",
    focus: "experimento de limite",
    people: ["Colega", "Chefe"],
    tags: ["limites", "autonomia", "experimento"],
  },
  {
    date: "30/07/2026",
    title: "Reorganização da rotina",
    summary:
      "A paciente começa a pensar em rotina menos orientada por urgência e aprovação externa.",
    focus: "rotina e autonomia",
    people: ["Parceira"],
    tags: ["rotina", "autonomia", "cuidado"],
  },
  {
    date: "06/08/2026",
    title: "Integração dos padrões recorrentes",
    summary:
      "A sessão reúne padrões de culpa, desempenho, medo de decepcionar e dificuldade de descanso.",
    focus: "integração clínica",
    people: ["Mãe", "Pai", "Parceira", "Chefe"],
    tags: ["padrões", "integração", "espelho"],
  },
  {
    date: "13/08/2026",
    title: "Plano clínico de continuidade",
    summary:
      "Ana identifica avanços iniciais e pontos que ainda precisam de elaboração nas próximas sessões.",
    focus: "continuidade do acompanhamento",
    people: ["Terapeuta", "Parceira"],
    tags: ["continuidade", "avanços", "processo"],
  },
]

function cloneTimeline(timelineData) {
  return JSON.parse(JSON.stringify(timelineData))
}

function formatSessionNumber(index) {
  return String(index + 1).padStart(2, "0")
}

function getYearFromDate(date) {
  const [, , year] = date.split("/")

  return year
}

function getMonthFromDate(date) {
  const [, month] = date.split("/")

  return MONTH_LABELS[Number(month) - 1]
}

/**
 * Cria os cinco blocos de uma sessão.
 *
 * Em cada sessão:
 * - bloco 2 se conecta ao bloco 1;
 * - bloco 4 se conecta ao bloco 3.
 *
 * Assim, cada sessão possui 5 blocos e 2 blocos com conexões clínicas.
 */
function createSessionBlocks(sessionTopic, sessionIndex) {
  const sessionNumber = formatSessionNumber(sessionIndex)
  const baseId = `ana-s${sessionNumber}`

  return [
    {
      id: `${baseId}-b01`,
      type: "Evento",
      title: `Evento principal — ${sessionTopic.focus}`,
      date: sessionTopic.date,
      eventDate: sessionTopic.date,
      sessionDate: sessionTopic.date,
      text: `Ana trouxe como tema central a experiência de ${sessionTopic.focus}. O relato apareceu acompanhado de tensão, tentativa de controle e preocupação com a reação das pessoas envolvidas.`,
      emotions: ["ansiedade", "tensão", "medo"],
      people: sessionTopic.people,
      tags: [...sessionTopic.tags, "evento principal"],
      intensity: 8,
      connections: [],
    },
    {
      id: `${baseId}-b02`,
      type: "Observação clínica",
      title: "Observação clínica — padrão associado",
      date: sessionTopic.date,
      eventDate: sessionTopic.date,
      sessionDate: sessionTopic.date,
      text: `A escuta clínica indicou que o tema de ${sessionTopic.focus} se conecta a padrões recorrentes de autocobrança, culpa e dificuldade de reconhecer limites pessoais.`,
      emotions: ["culpa", "insegurança", "tristeza"],
      people: sessionTopic.people,
      tags: [...sessionTopic.tags, "padrão recorrente"],
      intensity: 7,
      connections: [
        {
          targetBlockId: `${baseId}-b01`,
          targetTitle: `Evento principal — ${sessionTopic.focus}`,
          strength: "forte",
          reason:
            "A observação clínica aprofunda o evento principal relatado na mesma sessão.",
        },
      ],
    },
    {
      id: `${baseId}-b03`,
      type: "Memória",
      title: "Memória associada — origem subjetiva",
      date: sessionTopic.date,
      eventDate: sessionTopic.date,
      sessionDate: sessionTopic.date,
      text: `Durante a sessão, Ana associou o tema atual a experiências anteriores em que precisou corresponder, cuidar ou evitar conflito para preservar vínculos importantes.`,
      emotions: ["tristeza", "saudade", "vulnerabilidade"],
      people: sessionTopic.people,
      tags: [...sessionTopic.tags, "memória", "história pessoal"],
      intensity: 8,
      connections: [],
    },
    {
      id: `${baseId}-b04`,
      type: "Insight",
      title: "Insight — nova leitura do padrão",
      date: sessionTopic.date,
      eventDate: sessionTopic.date,
      sessionDate: sessionTopic.date,
      text: `Ana começou a perceber que sua reação atual não se limita ao acontecimento presente. Ela parece carregar uma tentativa antiga de evitar rejeição, julgamento ou perda de reconhecimento.`,
      emotions: ["clareza", "alívio", "receio"],
      people: sessionTopic.people,
      tags: [...sessionTopic.tags, "insight", "elaboração"],
      intensity: 7,
      connections: [
        {
          targetBlockId: `${baseId}-b03`,
          targetTitle: "Memória associada — origem subjetiva",
          strength: "moderada",
          reason:
            "O insight nasce da associação entre a memória relatada e o padrão atual.",
        },
      ],
    },
    {
      id: `${baseId}-b05`,
      type: "Encaminhamento",
      title: `Encaminhamento — observar ${sessionTopic.focus}`,
      date: sessionTopic.date,
      eventDate: sessionTopic.date,
      sessionDate: sessionTopic.date,
      text: `Foi combinado que Ana observará durante a semana como o tema de ${sessionTopic.focus} aparece no corpo, nos pensamentos automáticos e nas relações importantes.`,
      emotions: ["curiosidade", "esperança", "cautela"],
      people: ["Terapeuta", ...sessionTopic.people],
      tags: [...sessionTopic.tags, "encaminhamento", "observação"],
      intensity: 5,
      connections: [],
    },
  ]
}

function createSession(sessionTopic, sessionIndex) {
  const sessionNumber = formatSessionNumber(sessionIndex)

  return {
    id: `ana-session-${sessionNumber}`,
    date: sessionTopic.date,
    title: `Sessão ${sessionNumber} — ${sessionTopic.title}`,
    summary: sessionTopic.summary,
    blocks: createSessionBlocks(sessionTopic, sessionIndex),
  }
}

/**
 * Organiza sessões no mesmo formato usado pela timeline do sistema:
 * ano → mês → sessões → blocos.
 */
function groupSessionsIntoTimeline(sessions) {
  return sessions.reduce((timelineData, session) => {
    const year = getYearFromDate(session.date)
    const month = getMonthFromDate(session.date)

    let yearGroup = timelineData.find((group) => group.year === year)

    if (!yearGroup) {
      yearGroup = {
        year,
        months: [],
      }

      timelineData.push(yearGroup)
    }

    let monthGroup = yearGroup.months.find((group) => group.month === month)

    if (!monthGroup) {
      monthGroup = {
        month,
        sessions: [],
      }

      yearGroup.months.push(monthGroup)
    }

    monthGroup.sessions.push(session)

    return timelineData
  }, [])
}

const anaTimelineSeed = groupSessionsIntoTimeline(
  anaSessionTopics.map(createSession)
)

/**
 * Mapa único de timelines demonstrativas.
 *
 * Para adicionar outro paciente demonstrativo no futuro, adicione uma nova
 * entrada aqui. Pacientes sem entrada neste mapa começam com timeline vazia.
 */
const timelineSeedsByPatientId = {
  [ANA_PATIENT_ID]: anaTimelineSeed,
}

/**
 * Retorna a timeline inicial demonstrativa de um paciente.
 *
 * O clone evita que alterações feitas pela interface modifiquem diretamente
 * o objeto base do seed.
 */
export function getTimelineSeedForPatient(patientId) {
  const timelineSeed = timelineSeedsByPatientId[patientId]

  return timelineSeed ? cloneTimeline(timelineSeed) : []
}