# Trama

**Trama** é um protótipo de sistema web para psicólogos acompanharem pacientes, sessões e acontecimentos clínicos de forma visual, cronológica e conectada.

A proposta do projeto é ir além de uma listagem simples de atendimentos, permitindo que o profissional construa uma visão contínua da história emocional do paciente por meio de sessões, blocos narrativos, emoções, relações, padrões e conexões clínicas.

---

## Objetivo

O objetivo do Trama é ajudar psicólogos autônomos a organizar o acompanhamento clínico individual de seus pacientes.

O sistema permite:

- cadastrar e gerenciar pacientes;
- registrar sessões clínicas;
- dividir sessões em múltiplos blocos narrativos;
- associar emoções, pessoas e tags aos acontecimentos;
- criar conexões entre blocos;
- visualizar a história do paciente por diferentes modos;
- manter uma timeline individual para cada paciente.

---

## Conceito principal

Cada paciente possui sua própria timeline clínica.

Essa timeline é formada por sessões. Cada sessão pode conter vários blocos de eventos, permitindo registrar diferentes acontecimentos, emoções, relações e observações clínicas em um único atendimento.

Exemplo:

```txt
Paciente: Ana Luiza
└─ Sessão do dia 10/03/2026
   ├─ Bloco 1: conflito com a mãe
   ├─ Bloco 2: ansiedade no trabalho
   ├─ Bloco 3: lembrança de abandono na infância
   └─ Bloco 4: insight sobre autocobrança
```

---

## Funcionalidades atuais

### Home

A Home é a tela inicial do profissional.

Atualmente ela exibe:

- visão geral simples;
- indicadores pequenos:
  - pacientes;
  - em acompanhamento;
  - triagem inicial;
- bloco **Para acompanhar**:
  - retornos a definir;
  - primeira sessão pendente;
  - triagens em andamento;
- próximas sessões;
- pacientes recentes;
- acesso rápido à lista de pacientes.

A Home foi pensada para ser uma tela útil no início do trabalho, sem excesso de botões ou informações explicativas.

---

### Pacientes

A área de pacientes possui:

- listagem de pacientes;
- layout horizontal no desktop;
- layout responsivo em tablet e mobile;
- cadastro de novo paciente;
- edição de paciente;
- exclusão com confirmação;
- busca;
- filtro por status;
- abertura do paciente ao clicar no card inteiro;
- ações internas de editar, excluir e abrir;
- resumo da timeline diretamente no card.

O card de paciente mostra:

- nome;
- idade;
- queixa principal;
- descrição curta;
- status;
- quantidade de sessões;
- quantidade de blocos;
- quantidade de conexões clínicas;
- última sessão;
- próxima sessão.

As tags continuam existindo nos dados e podem ser usadas na busca, mas não aparecem mais no card para manter a interface mais limpa.

---

### Timeline individual por paciente

Cada paciente possui sua própria timeline salva separadamente no `localStorage`.

Exemplo:

```txt
Ana Luiza
└─ localStorage: trama_timeline_data_ana-luiza

João Luiz
└─ localStorage: trama_timeline_data_joao-luiz

Marcos Vieira
└─ localStorage: trama_timeline_data_marcos-vieira
```

Isso garante que:

- sessões de um paciente não apareçam em outro;
- blocos fiquem restritos ao prontuário correto;
- conexões clínicas não sejam compartilhadas entre pacientes;
- cada paciente tenha evolução própria.

---

### Sessões

A timeline permite:

- criar sessões;
- criar múltiplos blocos por sessão;
- adicionar blocos em sessão existente;
- editar sessões;
- excluir sessões;
- visualizar sessões em calendário anual;
- abrir sessão em modal;
- visualizar blocos compactos dentro da sessão.

O calendário de sessões foi compactado para ocupar menos espaço e permitir acesso mais rápido ao conteúdo clínico.

---

### Blocos clínicos

Cada bloco pode conter:

- título;
- texto narrativo;
- tipo de evento;
- data do acontecimento;
- data da sessão;
- emoções;
- pessoas envolvidas;
- tags;
- intensidade emocional;
- conexões com outros blocos.

Os blocos podem ser:

- criados;
- editados;
- excluídos;
- abertos em modal;
- conectados manualmente a outros blocos.

---

### Modos de visualização

A timeline do paciente possui quatro modos:

```txt
Sessões | Emoções | Relações | Espelho
```

#### Sessões

Organiza os registros pela data do atendimento clínico.

#### Emoções

Agrupa os blocos pelas emoções associadas.

#### Relações

Agrupa os blocos pelas pessoas envolvidas.

#### Espelho

Mostra a linha da vida emocional do paciente organizada pela data real dos acontecimentos, não apenas pela data em que foram relatados.

---

### Estado vazio da timeline

Pacientes sem sessões possuem um estado vazio compacto, com orientação para criar a primeira sessão.

Isso evita que a tela pareça quebrada quando um paciente ainda não possui histórico clínico registrado.

---

### Dados demonstrativos

O projeto possui um arquivo central de seeds:

```txt
src/data/timelineSeeds.js
```

Atualmente, a paciente **Ana Luiza** possui uma timeline demonstrativa com:

- 20 sessões;
- 5 blocos por sessão;
- 100 blocos no total;
- 2 blocos conectados por sessão.

Pacientes sem seed começam com timeline vazia e podem receber sessões manualmente pela interface.

Para recarregar o seed da Ana durante desenvolvimento:

```js
localStorage.removeItem("trama_timeline_data_ana-luiza")
```

Depois, basta atualizar a página e abrir a paciente Ana Luiza novamente.

---

## Navegação atual

O menu lateral possui apenas:

```txt
Home
Pacientes
```

A timeline não é mais uma aba global. Ela é acessada ao abrir um paciente.

Fluxo principal:

```txt
Home
→ Pacientes
→ Abrir paciente
→ Timeline clínica individual
```

---

## Estrutura do projeto

```txt
src/
├─ components/
│  ├─ AddPatientModal.jsx
│  ├─ AddSessionModal.jsx
│  ├─ ConfirmModal.jsx
│  ├─ GroupedBlocksView.jsx
│  ├─ MirrorTimeline.jsx
│  ├─ PatientCard.jsx
│  ├─ PatientHeader.jsx
│  ├─ PatientsFilters.jsx
│  ├─ PatientsStats.jsx
│  ├─ SessionModal.jsx
│  ├─ SessionsCalendar.jsx
│  ├─ Sidebar.jsx
│  ├─ Timeline.jsx
│  ├─ TimelineBlock.jsx
│  ├─ TimelineBlockModal.jsx
│  └─ TimelineEmptyState.jsx
│
├─ data/
│  ├─ patient.js
│  ├─ patients.js
│  ├─ sessionOptions.js
│  ├─ timeline.js
│  └─ timelineSeeds.js
│
├─ hooks/
│  ├─ usePatientsData.js
│  └─ useTimelineData.js
│
├─ pages/
│  ├─ HomePage.jsx
│  ├─ PatientPage.jsx
│  └─ PatientsPage.jsx
│
├─ utils/
│  ├─ patientTimelineSummary.js
│  ├─ patientsUtils.js
│  ├─ timelineMutations.js
│  └─ timelineUtils.js
│
├─ App.jsx
└─ main.jsx
```

---

## Arquitetura

O projeto separa responsabilidades entre páginas, componentes, hooks, utils e dados demonstrativos.

```txt
App.jsx
→ controla navegação principal e paciente selecionado

Sidebar.jsx
→ renderiza menu lateral com Home e Pacientes

HomePage.jsx
→ mostra visão geral do profissional

PatientsPage.jsx
→ controla listagem, busca, filtros e modais de pacientes

PatientCard.jsx
→ renderiza a linha responsiva do paciente

AddPatientModal.jsx
→ cria e edita pacientes

usePatientsData.js
→ controla estado, persistência e mutações de pacientes

patientsUtils.js
→ centraliza busca, normalização e filtros

patientTimelineSummary.js
→ calcula resumo da timeline para exibir no card e na Home

PatientPage.jsx
→ renderiza o prontuário individual do paciente

PatientHeader.jsx
→ mostra informações compactas do paciente aberto

useTimelineData.js
→ controla timeline individual por paciente

Timeline.jsx
→ controla modos Sessões, Emoções, Relações e Espelho

SessionsCalendar.jsx
→ renderiza o calendário clínico compacto

GroupedBlocksView.jsx
→ renderiza agrupamentos por emoção e relação

MirrorTimeline.jsx
→ renderiza o Espelho do paciente

timelineUtils.js
→ lê, agrupa e calcula dados da timeline

timelineMutations.js
→ altera a estrutura da timeline

timelineSeeds.js
→ centraliza timelines demonstrativas opcionais
```

---

## Persistência

Atualmente, o projeto usa `localStorage`.

Dados persistidos:

- pacientes;
- timelines individuais;
- sessões;
- blocos;
- conexões.

As timelines são salvas por paciente:

```txt
trama_timeline_data_ana-luiza
trama_timeline_data_joao-luiz
trama_timeline_data_marcos-vieira
```

Essa persistência é temporária para o MVP. Em uma versão real, a camada local deve ser substituída por backend, autenticação e banco de dados.

---

## Tecnologias

- React
- Vite
- JavaScript
- Tailwind CSS
- LocalStorage
- Git
- GitHub

---

## Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar em desenvolvimento

```bash
npm run dev
```

### 3. Acessar no navegador

```txt
http://localhost:5173
```

---

## Estado atual do MVP

O projeto já possui:

- navegação com Home e Pacientes;
- Home com visão geral do profissional;
- bloco Para acompanhar;
- próximas sessões;
- pacientes recentes;
- CRUD local de pacientes;
- busca e filtros;
- lista de pacientes responsiva;
- abertura do paciente pelo card inteiro;
- timeline individual por paciente;
- estado vazio para pacientes sem sessões;
- criação de sessões;
- criação de múltiplos blocos por sessão;
- edição de sessões;
- edição de blocos;
- exclusão com confirmação;
- conexões entre blocos;
- modos Sessões, Emoções, Relações e Espelho;
- seed demonstrativo para Ana Luiza;
- persistência local.

---

## Próximos passos

### Curto prazo

- Revisar modal de criação de sessão/bloco.
- Melhorar design dos modais.
- Adicionar busca dentro da timeline.
- Adicionar filtros por emoção, pessoa, tag e tipo de evento.
- Melhorar edição do paciente dentro do prontuário.
- Avaliar remoção ou reaproveitamento de `PatientsStats.jsx`.

### Médio prazo

- Criar prontuário individual mais completo.
- Criar painel de padrões emocionais.
- Criar visão geral de sessões.
- Criar relatórios clínicos.
- Adicionar autenticação.
- Integrar backend.

### Longo prazo

- Criar banco de dados.
- Implementar segurança e LGPD.
- Criar permissões por profissional.
- Criar exportação de relatórios.
- Criar backup seguro.
- Avaliar recursos com IA de apoio clínico, mantendo o psicólogo no controle.

---

## Observações sobre LGPD

Este projeto ainda é um protótipo local.

Antes de uso real com dados sensíveis, será necessário implementar:

- autenticação segura;
- criptografia;
- controle de acesso;
- política de privacidade;
- consentimento adequado;
- logs de acesso;
- backup seguro;
- regras claras de retenção e exclusão de dados.

Dados clínicos são altamente sensíveis e exigem cuidado técnico, ético e legal.

---

## Status

Projeto em desenvolvimento.

O foco atual é construir um MVP funcional, organizado e apresentável como projeto de portfólio.

---

## Autor

Desenvolvido por Felipe Holanda.