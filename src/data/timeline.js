const baseTimeline = [
  {
    year: "2026",
    months: [
      {
        month: "MAR",
        blocks: [
          {
            id: "block-15",
            type: "Marco positivo",
            title: "Decidiu reduzir a carga de trabalho",
            date: "18/03/2026",
            text: "João decidiu negociar uma redução de carga no trabalho e reorganizar sua rotina. Relatou medo de parecer menos comprometido, mas também alívio por reconhecer seus próprios limites.",
            emotions: ["medo", "alívio", "coragem"],
            people: ["Chefe", "Marido"],
            tags: ["trabalho", "limites", "autonomia", "carreira"],
            intensity: 8,
            connections: [
              {
                targetBlockId: "block-14",
                targetTitle: "Percebeu que cuidado não precisa ser sacrifício",
                strength: "forte",
                reason:
                  "A decisão atual parece nascer da percepção de que cuidar dos outros não precisa significar abandonar a si mesmo.",
              },
              {
                targetBlockId: "block-12",
                targetTitle: "Viagem curta com o marido",
                strength: "moderada",
                reason:
                  "A experiência de descanso mostrou que João consegue existir fora da lógica de produtividade constante.",
              },
            ],
          },
        ],
      },
      {
        month: "JAN",
        blocks: [
          {
            id: "block-14",
            type: "Insight",
            title: "Percebeu que cuidado não precisa ser sacrifício",
            date: "26/01/2026",
            text: "Durante a sessão, João formulou que aprendeu a demonstrar amor por meio de esforço constante. Começou a questionar se sua presença só teria valor quando estivesse resolvendo problemas.",
            emotions: ["tristeza", "alívio", "esperança"],
            people: ["Mãe", "Pai", "Irmão"],
            tags: ["família", "cuidado", "responsabilidade", "limites"],
            intensity: 9,
            connections: [
              {
                targetBlockId: "block-4",
                targetTitle: "Assumiu cuidados após cirurgia da mãe",
                strength: "forte",
                reason:
                  "Ambos os eventos mostram a origem do papel de cuidador como forma de pertencimento familiar.",
              },
              {
                targetBlockId: "block-9",
                targetTitle: "Pai sofreu um AVC leve",
                strength: "forte",
                reason:
                  "O cuidado com o pai reativou o mesmo padrão de assumir responsabilidades quase sozinho.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    year: "2025",
    months: [
      {
        month: "NOV",
        blocks: [
          {
            id: "block-13",
            type: "Evento",
            title: "Defendeu uma colega em reunião",
            date: "11/11/2025",
            text: "João interveio durante uma reunião ao perceber que uma colega estava sendo responsabilizada injustamente por um atraso coletivo. Sentiu medo da reação do chefe, mas também orgulho por ter se posicionado.",
            emotions: ["medo", "orgulho", "coragem"],
            people: ["Chefe", "Colega de trabalho"],
            tags: ["trabalho", "exposição", "limites", "conquista"],
            intensity: 8,
          },
        ],
      },
      {
        month: "JUL",
        blocks: [
          {
            id: "block-12",
            type: "Marco positivo",
            title: "Viagem curta com o marido",
            date: "19/07/2025",
            text: "João e o marido fizeram uma viagem curta para descansar. João relatou estranhamento por não estar disponível para demandas familiares, mas conseguiu aproveitar momentos de calma e intimidade.",
            emotions: ["calma", "pertencimento", "culpa"],
            people: ["Marido", "Mãe"],
            tags: ["vínculo", "reparação", "limites"],
            intensity: 7,
          },
        ],
      },
    ],
  },
  {
    year: "2024",
    months: [
      {
        month: "OUT",
        blocks: [
          {
            id: "block-11",
            type: "Evento",
            title: "Recusou uma promoção",
            date: "03/10/2024",
            text: "João recusou uma promoção por perceber que o novo cargo aumentaria muito sua carga emocional e administrativa. Sentiu vergonha por não aceitar a oportunidade, mas também alívio por não se comprometer além do possível.",
            emotions: ["vergonha", "alívio", "ambivalência"],
            people: ["Chefe", "Marido"],
            tags: ["trabalho", "carreira", "limites", "sobrecarga"],
            intensity: 8,
            connections: [
              {
                targetBlockId: "block-6",
                targetTitle: "Esgotamento durante projeto emergencial",
                strength: "forte",
                reason:
                  "A recusa da promoção parece diretamente ligada à memória corporal de esgotamento vivida no projeto anterior.",
              },
              {
                targetBlockId: "block-8",
                targetTitle: "Apresentação rejeitada pela diretoria",
                strength: "moderada",
                reason:
                  "A possibilidade de maior exposição profissional reativou medo de julgamento e fracasso público.",
              },
            ],
          },
        ],
      },
      {
        month: "ABR",
        blocks: [
          {
            id: "block-10",
            type: "Observação clínica",
            title: "Tensão entre autonomia e lealdade familiar",
            date: "15/04/2024",
            text: "Observa-se que João começa a desejar mais autonomia, mas sente culpa quando suas escolhas não coincidem com as expectativas familiares. O conflito aparece especialmente quando precisa decidir entre descanso e disponibilidade.",
            emotions: ["culpa", "esperança", "ansiedade"],
            people: ["Mãe", "Irmão", "Marido"],
            tags: ["família", "autonomia", "limites"],
            intensity: 7,
          },
        ],
      },
    ],
  },
  {
    year: "2023",
    months: [
      {
        month: "SET",
        blocks: [
          {
            id: "block-9",
            type: "Evento traumático",
            title: "Pai sofreu um AVC leve",
            date: "21/09/2023",
            text: "O pai de João sofreu um AVC leve. João assumiu rapidamente a organização de consultas, exames e comunicação com a família. Sentiu medo de perder o pai e frustração por perceber pouca divisão de responsabilidades.",
            emotions: ["medo", "tristeza", "frustração"],
            people: ["Pai", "Mãe", "Irmão"],
            tags: ["família", "cuidado", "sobrecarga", "luto"],
            intensity: 10,
          },
        ],
      },
      {
        month: "FEV",
        blocks: [
          {
            id: "block-8",
            type: "Evento traumático",
            title: "Apresentação rejeitada pela diretoria",
            date: "08/02/2023",
            text: "João apresentou uma proposta de melhoria de processos, mas a diretoria rejeitou a ideia de forma direta. Relatou sensação de exposição, frustração e vontade de nunca mais apresentar projetos autorais.",
            emotions: ["frustração", "vergonha", "raiva"],
            people: ["Chefe", "Colega de trabalho"],
            tags: ["trabalho", "exposição", "carreira"],
            intensity: 9,
            connections: [
              {
                targetBlockId: "block-3",
                targetTitle: "Primeira apresentação pública bem-sucedida",
                strength: "moderada",
                reason:
                  "O contraste entre a apresentação bem-sucedida e a rejeição posterior parece marcar uma mudança na confiança profissional.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    year: "2022",
    months: [
      {
        month: "DEZ",
        blocks: [
          {
            id: "block-7",
            type: "Marco positivo",
            title: "Casamento civil com o marido",
            date: "02/12/2022",
            text: "João e o marido oficializaram a união em uma cerimônia pequena. João descreveu o dia como simples, tranquilo e importante por sentir que podia construir uma família escolhida.",
            emotions: ["pertencimento", "segurança", "ternura"],
            people: ["Marido", "Mãe", "Irmão"],
            tags: ["vínculo", "família", "reparação"],
            intensity: 8,
          },
        ],
      },
      {
        month: "MAR",
        blocks: [
          {
            id: "block-6",
            type: "Evento traumático",
            title: "Esgotamento durante projeto emergencial",
            date: "17/03/2022",
            text: "Durante um projeto emergencial na empresa, João trabalhou por semanas em ritmo intenso. Teve queda de energia, insônia e sensação de estar funcionando apenas por obrigação.",
            emotions: ["exaustão", "ansiedade", "raiva"],
            people: ["Chefe", "Colega de trabalho"],
            tags: ["trabalho", "sobrecarga", "responsabilidade"],
            intensity: 10,
          },
        ],
      },
    ],
  },
  {
    year: "2021",
    months: [
      {
        month: "AGO",
        blocks: [
          {
            id: "block-5",
            type: "Marco positivo",
            title: "Conheceu o futuro marido em um curso",
            date: "29/08/2021",
            text: "João conheceu o futuro marido em um curso de fotografia. Relatou surpresa por se sentir ouvido sem precisar performar competência ou resolver algo para a outra pessoa.",
            emotions: ["curiosidade", "segurança", "pertencimento"],
            people: ["Marido"],
            tags: ["vínculo", "reparação", "autonomia"],
            intensity: 7,
          },
        ],
      },
    ],
  },
  {
    year: "2020",
    months: [
      {
        month: "MAI",
        blocks: [
          {
            id: "block-4",
            type: "Evento",
            title: "Assumiu cuidados após cirurgia da mãe",
            date: "13/05/2020",
            text: "Após uma cirurgia da mãe, João reorganizou sua rotina para acompanhar recuperação, compras e consultas. Sentiu ternura, mas também irritação por perceber que a família esperava que ele coordenasse tudo.",
            emotions: ["ternura", "raiva", "culpa"],
            people: ["Mãe", "Irmão"],
            tags: ["família", "cuidado", "sobrecarga"],
            intensity: 8,
          },
        ],
      },
    ],
  },
  {
    year: "2018",
    months: [
      {
        month: "NOV",
        blocks: [
          {
            id: "block-3",
            type: "Marco positivo",
            title: "Primeira apresentação pública bem-sucedida",
            date: "06/11/2018",
            text: "João apresentou um projeto em um encontro profissional e recebeu elogios de uma colega de trabalho. Sentiu orgulho e percebeu que poderia ocupar espaços de fala com mais segurança.",
            emotions: ["orgulho", "confiança", "alívio"],
            people: ["Colega de trabalho", "Chefe"],
            tags: ["trabalho", "conquista", "exposição"],
            intensity: 7,
          },
        ],
      },
    ],
  },
  {
    year: "2016",
    months: [
      {
        month: "JUL",
        blocks: [
          {
            id: "block-2",
            type: "Evento",
            title: "Discussão com o pai sobre estabilidade",
            date: "24/07/2016",
            text: "Durante um almoço em família, o pai questionou as escolhas profissionais de João e insistiu que estabilidade deveria ser prioridade absoluta. João sentiu raiva e culpa por desejar uma carreira menos previsível.",
            emotions: ["raiva", "culpa", "ansiedade"],
            people: ["Pai", "Mãe"],
            tags: ["família", "carreira", "autonomia"],
            intensity: 7,
          },
        ],
      },
    ],
  },
  {
    year: "2015",
    months: [
      {
        month: "MAR",
        blocks: [
          {
            id: "block-1",
            type: "Evento",
            title: "Mudança para outra cidade",
            date: "15/03/2015",
            text: "João mudou-se para outra cidade para iniciar o primeiro emprego na área de planejamento urbano. Sentiu entusiasmo pela independência, mas também medo de decepcionar a família caso não conseguisse se sustentar.",
            emotions: ["esperança", "medo", "ansiedade"],
            people: ["Mãe", "Pai"],
            tags: ["mudança", "autonomia", "carreira"],
            intensity: 8,
          },
        ],
      },
    ],
  },
]

function createSessionDate(originalDate, sessionNumber) {
  const [, month, year] = originalDate.split("/")
  const daysBySession = {
    2: "08",
    3: "15",
    4: "22",
  }

  return `${daysBySession[sessionNumber]}/${month}/${year}`
}

function createMonthlySessionBlocks(block) {
  return [
    {
      ...block,
      title: `Atendimento 1 — ${block.title}`,
    },
    {
      id: `${block.id}-session-2`,
      type: "Observação clínica",
      title: `Atendimento 2 — aprofundamento do tema`,
      date: createSessionDate(block.date, 2),
      text: `O tema apresentado em "${block.title}" foi retomado em sessão. João demonstrou maior capacidade de nomear emoções associadas ao evento, embora ainda apresente ambivalência ao reconhecer suas próprias necessidades.`,
      emotions: block.emotions.slice(0, 2),
      people: block.people,
      tags: [...block.tags, "continuidade"],
      intensity: Math.max(block.intensity - 1, 1),
      connections: [
        {
          targetBlockId: block.id,
          targetTitle: block.title,
          strength: "moderada",
          reason:
            "Este atendimento aprofunda o evento principal registrado no mesmo mês.",
        },
      ],
    },
    {
      id: `${block.id}-session-3`,
      type: "Insight",
      title: `Atendimento 3 — padrão percebido`,
      date: createSessionDate(block.date, 3),
      text: `Durante a sessão, João começou a perceber como esse tema se repete em diferentes contextos. O foco clínico esteve na relação entre emoção, responsabilidade assumida e dificuldade de estabelecer limites.`,
      emotions: ["ansiedade", "culpa", "esperança"],
      people: block.people,
      tags: ["padrão recorrente", "limites", ...block.tags.slice(0, 1)],
      intensity: Math.max(block.intensity - 2, 1),
      connections: [
        {
          targetBlockId: block.id,
          targetTitle: block.title,
          strength: "forte",
          reason:
            "O insight nasce diretamente da elaboração do evento principal do mês.",
        },
      ],
    },
    {
      id: `${block.id}-session-4`,
      type: "Marco positivo",
      title: `Atendimento 4 — encaminhamento e reorganização`,
      date: createSessionDate(block.date, 4),
      text: `Ao final do ciclo mensal, João conseguiu formular uma pequena ação prática relacionada ao tema trabalhado. A sessão indicou maior clareza sobre seus limites e maior tolerância ao desconforto de não corresponder a todas as expectativas externas.`,
      emotions: ["alívio", "coragem", "esperança"],
      people: block.people,
      tags: ["reparação", "autonomia", "continuidade"],
      intensity: Math.max(block.intensity - 3, 1),
      connections: [
        {
          targetBlockId: block.id,
          targetTitle: block.title,
          strength: "moderada",
          reason:
            "Este atendimento representa uma reorganização subjetiva após o evento principal do mês.",
        },
      ],
    },
  ]
}

export const timeline = baseTimeline.map((yearGroup) => ({
  ...yearGroup,
  months: yearGroup.months.map((monthGroup) => ({
    ...monthGroup,
    blocks: monthGroup.blocks.flatMap((block) =>
      createMonthlySessionBlocks(block)
    ),
  })),
}))