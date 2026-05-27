export const timeline = [
  {
    year: "2026",
    months: [
      {
        month: "JAN",
        blocks: [
          {
            id: "block-1",
            type: "Marco positivo",
            title: "Conseguiu se posicionar",
            date: "12/01/2026",
            text: "João conseguiu dizer não sem sentir culpa intensa.",
            emotions: ["orgulho", "alívio"],
            people: ["Marido"],
            tags: ["autonomia", "limite", "evolução"],
            intensity: 6,
          },
        ],
      },
      {
        month: "FEV",
        blocks: [
          {
            id: "block-2",
            type: "Evento traumático",
            title: "Discussão com o chefe",
            date: "04/02/2026",
            text: "Relatou vergonha intensa após se sentir desrespeitado publicamente.",
            emotions: ["vergonha", "medo", "raiva"],
            people: ["Chefe"],
            tags: ["trabalho", "invalidação", "exposição"],
            intensity: 9,
            connections: [
              {
                targetBlockId: "block-5",
                targetTitle: "Aprovação na faculdade",
                strength: "forte",
                reason:
                  "Repetição da sensação de invalidação diante de uma figura de autoridade.",
              },
            ],
          },
          {
            id: "block-3",
            type: "Insight",
            title: "Percebeu padrão de invalidação",
            date: "18/02/2026",
            text: "Associou críticas atuais à sensação antiga de não ser validado.",
            emotions: ["tristeza", "consciência"],
            people: ["Mãe"],
            tags: ["invalidação", "infância", "padrão recorrente"],
            intensity: 7,
            connections: [
              {
                targetBlockId: "block-2",
                targetTitle: "Discussão com o chefe",
                strength: "moderada",
                reason:
                  "O evento atual ajudou o paciente a reconhecer um padrão antigo.",
              },
              {
                targetBlockId: "block-5",
                targetTitle: "Aprovação na faculdade",
                strength: "forte",
                reason:
                  "Ambos os eventos envolvem conquista, exposição e medo de invalidação.",
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
        month: "MAI",
        blocks: [
          {
            id: "block-4",
            type: "Marco positivo",
            title: "Show da Lady Gaga",
            date: "03/05/2025",
            text: "Experiência de realização pessoal ao lado do marido.",
            emotions: ["felicidade", "realização", "pertencimento"],
            people: ["Marido"],
            tags: ["sonho", "vínculo", "reparação"],
            intensity: 8,
          },
        ],
      },
    ],
  },
  {
    year: "2016",
    months: [
      {
        month: "ABR",
        blocks: [
          {
            id: "block-5",
            type: "Evento",
            title: "Aprovação na faculdade",
            date: "22/04/2016",
            text: "Conquista importante foi invalidada pela preocupação da mãe.",
            emotions: ["felicidade", "culpa", "abandono"],
            people: ["Mãe"],
            tags: ["impostor", "conquista", "invalidação"],
            intensity: 8,
          },
        ],
      },
    ],
  },
]