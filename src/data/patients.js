import { patient as joaoLuiz } from "./patient"

/**
 * Lista inicial de pacientes exibida na tela de pacientes.
 *
 * Neste momento, os dados ainda são mockados/localizados no front-end.
 * Futuramente, este arquivo pode ser substituído por uma chamada de API.
 */
export const patients = [
  {
    ...joaoLuiz,
    id: "joao-luiz",
    name: "João Luiz",
    status: "Em acompanhamento",
    nextSession: "25/03/2026",
    description:
      joaoLuiz.summary ||
      "Paciente em acompanhamento clínico com registros organizados no Trama.",
  },
  {
    id: "ana-luiza",
    name: "Ana Luiza",
    age: 34,
    status: "Em acompanhamento",
    mainComplaint: "ansiedade relacionada ao trabalho e autocobrança",
    lastSession: "20/03/2026",
    nextSession: "27/03/2026",
    description:
      "Paciente fictícia criada para testar a futura navegação entre múltiplos prontuários clínicos.",
    tags: ["ansiedade", "trabalho", "autocobrança", "limites"],
    mirror: {
      centralWound:
        "Sensação recorrente de precisar entregar mais do que consegue sustentar.",
      mainFear:
        "Medo de decepcionar pessoas importantes e ser vista como insuficiente.",
    },
    emotionalPatterns: [
      "Dificuldade em encerrar ciclos de cobrança",
      "Associa descanso com culpa",
      "Busca validação por desempenho",
    ],
    medications: [],
    relationships: ["Mãe", "Pai", "Parceira", "Chefe"],
  },
  {
    id: "marcos-vieira",
    name: "Marcos Vieira",
    age: 41,
    status: "Triagem inicial",
    mainComplaint: "conflitos familiares e dificuldade de expressar necessidades",
    lastSession: "—",
    nextSession: "28/03/2026",
    description:
      "Paciente fictício em triagem inicial, usado para preparar a tela de listagem antes do cadastro real.",
    tags: ["família", "culpa", "vínculos", "comunicação"],
    mirror: {
      centralWound:
        "Dificuldade em reconhecer necessidades próprias sem sentir culpa.",
      mainFear:
        "Medo de romper vínculos ao se posicionar de forma mais clara.",
    },
    emotionalPatterns: [
      "Evita conversas difíceis",
      "Assume responsabilidade por conflitos familiares",
      "Minimiza incômodos pessoais",
    ],
    medications: [],
    relationships: ["Mãe", "Irmã", "Ex-companheira", "Filho"],
  },
]