# Trama

**Trama** é um protótipo de sistema web para psicólogos acompanharem a história clínica e emocional de seus pacientes de forma visual, cronológica e conectada.

A proposta do projeto é ir além de um prontuário tradicional, permitindo que o profissional visualize pacientes, sessões, acontecimentos, emoções, relações importantes, padrões e conexões entre eventos relatados durante o acompanhamento clínico.

---

## Objetivo do projeto

O objetivo do Trama é ajudar psicólogos autônomos, especialmente profissionais que atendem pacientes de forma individual, a construir uma visão mais clara da trajetória emocional de cada paciente.

O sistema organiza informações clínicas em diferentes áreas e modos de visualização:

- **Pacientes**: listagem, cadastro, edição, exclusão, busca, filtros e resumo da timeline.
- **Sessões**: visão em calendário clínico, organizada pela data dos atendimentos.
- **Emoções**: blocos agrupados pelas emoções associadas aos acontecimentos.
- **Relações**: blocos agrupados pelas pessoas importantes na vida do paciente.
- **Espelho**: linha da vida emocional do paciente, organizada pela data real dos acontecimentos relatados.

---

## Conceito principal

No Trama, cada paciente possui sua própria linha clínica.

Essa linha clínica é composta por sessões, e cada sessão pode conter vários blocos de eventos. Isso permite que, em um único atendimento, o psicólogo registre diferentes acontecimentos, emoções, pessoas envolvidas, padrões e conexões clínicas.

Exemplo:

```txt
Paciente: Ana Luiza
└─ Sessão do dia 10/03/2026
   ├─ Bloco 1: conflito com a mãe
   ├─ Bloco 2: ansiedade no trabalho
   ├─ Bloco 3: lembrança de abandono na infância
   └─ Bloco 4: insight sobre autocobrança
```

Cada paciente pode ter:

- nome;
- idade;
- data de nascimento;
- status;
- contato;
- início do acompanhamento;
- última sessão;
- próxima sessão;
- queixa principal;
- descrição inicial;
- tags clínicas;
- pessoas importantes.

Cada bloco de evento pode ter:

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

---

## Funcionalidades atuais

### Pacientes

- Listagem de pacientes em layout horizontal.
- Layout responsivo para desktop, tablet e mobile.
- Cadastro de novo paciente.
- Modal robusto de criação de paciente.
- Edição de paciente usando o mesmo modal de cadastro.
- Exclusão de paciente com modal de confirmação.
- Card inteiro clicável para abrir o prontuário do paciente.
- Ações internas de editar, excluir e abrir sem disparar clique acidental no card.
- Busca por:
  - nome;
  - queixa principal;
  - descrição;
  - tags;
  - relações importantes;
  - e-mail;
  - telefone;
  - status.
- Filtro por status:
  - Todos;
  - Triagem inicial;
  - Em acompanhamento;
  - Encerrado.
- Estado vazio quando nenhum paciente é encontrado.
- Persistência dos pacientes no `localStorage`.

### Lista de pacientes

A lista de pacientes foi refinada para uma experiência mais discreta e clínica.

Atualmente ela possui:

- topo mais limpo;
- título e subtítulo mais discretos;
- busca e filtro compactos;
- botão de novo paciente no topo;
- remoção dos cards de estatística da interface principal;
- pacientes exibidos em linhas horizontais no desktop;
- cards verticais compactos em telas menores;
- tags removidas visualmente do card;
- resumo da timeline no card;
- última e próxima sessão no card;
- ações discretas no final da linha.

As tags continuam existindo nos dados e ainda podem ser usadas em busca, mas não aparecem mais no card para reduzir poluição visual.

### Resumo da timeline no card do paciente

Cada linha de paciente mostra um resumo da timeline individual:

- quantidade de sessões;
- quantidade de blocos;
- quantidade de conexões clínicas;
- indicação de paciente sem sessões registradas.

Exemplo:

```txt
20 sessões · 100 blocos
40 conexões clínicas
```

ou:

```txt
Nenhuma sessão
Sem blocos registrados
```

### Paciente selecionado

- Exibição de dados resumidos do paciente.
- Cabeçalho compacto e responsivo.
- Botão para criar nova sessão.
- Botão para voltar à lista de pacientes.
- Dados do paciente selecionado refletidos no cabeçalho da timeline.
- Timeline individual carregada pelo identificador do paciente.

### Timeline individual por paciente

Cada paciente possui sua própria timeline persistida separadamente no `localStorage`.

Exemplo:

```txt
Ana Luiza
└─ localStorage: trama_timeline_data_ana-luiza

João Luiz
└─ localStorage: trama_timeline_data_joao-luiz

Marcos Vieira
└─ localStorage: trama_timeline_data_marcos-vieira
```

Isso permite que:

- sessões de um paciente não apareçam em outro;
- blocos de um paciente não sejam compartilhados com outro;
- conexões clínicas fiquem restritas ao prontuário do paciente correto;
- cada paciente tenha evolução própria.

### Seeds demonstrativos

O projeto possui um arquivo central para timelines demonstrativas:

```txt
src/data/timelineSeeds.js
```

Esse arquivo permite definir dados iniciais para pacientes específicos.

Atualmente:

- **Ana Luiza** possui uma timeline demonstrativa com 20 sessões;
- cada sessão da Ana possui 5 blocos;
- em cada sessão, 2 blocos possuem conexões clínicas;
- os demais pacientes começam com timeline vazia.

Pacientes sem seed continuam funcionando normalmente: suas sessões são adicionadas manualmente pela interface do sistema.

### Sessões

- Visualização em formato de calendário anual.
- Seletor de ano.
- Cards mensais com quantidade de sessões.
- Contadores de:
  - sessões no ano;
  - sessões totais;
  - blocos de eventos totais;
  - mês aberto.
- Estado vazio para pacientes sem sessões.
- Botão para criar a primeira sessão a partir do estado vazio.
- Abertura de sessão em modal.
- Edição dos dados da sessão.
- Exclusão de sessão inteira com modal de confirmação.
- Adição de novos blocos em sessão existente.
- Sessões separadas por paciente.

### Blocos de eventos

- Criação de blocos dentro de uma sessão.
- Criação de múltiplos blocos em uma única sessão.
- Edição de blocos.
- Exclusão de blocos com modal de confirmação.
- Visualização compacta dos blocos.
- Abertura de bloco em modal.
- Exibição de emoções, pessoas, tags e intensidade emocional.
- Blocos pertencem à timeline individual do paciente aberto.

### Conexões

- Criação de conexões manuais entre blocos.
- Indicação visual de blocos conectados.
- Abertura de blocos conectados dentro do modal.
- Remoção automática de conexões inválidas ao excluir blocos ou sessões.
- Conexões restritas à timeline do paciente atual.

### Confirmações

O sistema possui um modal próprio de confirmação para ações críticas:

- excluir paciente;
- excluir bloco;
- excluir sessão;
- restaurar timeline do paciente atual.

Isso substitui o `confirm()` padrão do navegador e mantém a experiência visual dentro do padrão do Trama.

---

## Modos de visualização da timeline

O sistema possui quatro modos principais dentro da timeline do paciente:

```txt
Sessões | Emoções | Relações | Espelho
```

### Sessões

Organiza os registros pela data do atendimento clínico.

### Emoções

Agrupa os blocos pelas emoções associadas.

### Relações

Agrupa os blocos pelas pessoas envolvidas.

### Espelho

Mostra a linha da vida emocional do paciente, organizada pela data real dos acontecimentos, não pela data em que foram relatados.

O Espelho também exibe:

- eventos principais;
- blocos conectados;
- pessoas envolvidas;
- conexões identificadas;
- período coberto;
- filtro para mostrar apenas acontecimentos conectados.

---

## Estrutura atual do projeto

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

> Observação: `PatientsStats.jsx` existe no projeto, mas os cards de estatística não são renderizados na versão atual da listagem de pacientes.

---

## Arquitetura atual

O projeto foi organizado para separar responsabilidades entre páginas, componentes visuais, hooks de dados, funções utilitárias, seeds demonstrativos e funções de mutação.

```txt
App.jsx
→ controla a navegação principal entre abas e mantém o paciente selecionado

Sidebar.jsx
→ renderiza a navegação principal do sistema

PatientsPage.jsx
→ controla a página de pacientes, busca, filtros, modais e confirmação

usePatientsData.js
→ controla estado, persistência e ações de pacientes

patientsUtils.js
→ centraliza busca, normalização e filtros de pacientes

patientTimelineSummary.js
→ lê resumos de timeline por paciente para exibir na listagem

PatientPage.jsx
→ controla a tela clínica do paciente e envia o patientId para a timeline

useTimelineData.js
→ controla estado, persistência e ações da timeline individual por paciente

timelineSeeds.js
→ centraliza timelines demonstrativas opcionais por paciente

timelineMutations.js
→ altera a estrutura da timeline

timelineUtils.js
→ lê, agrupa, formata e calcula dados da timeline

Timeline.jsx
→ controla modos, modais de sessão/bloco e distribuição das visões

TimelineEmptyState.jsx
→ orienta o usuário quando o paciente ainda não possui sessões

SessionsCalendar.jsx
→ renderiza a visão de sessões em calendário

GroupedBlocksView.jsx
→ renderiza agrupamentos de Emoções e Relações

MirrorTimeline.jsx
→ renderiza o Espelho conectado do paciente
```

---

## Responsabilidades dos principais arquivos

### `App.jsx`

Controla a estrutura principal do sistema.

Responsabilidades:

- manter a aba ativa da navegação;
- renderizar a página correta conforme a aba selecionada;
- manter o paciente selecionado;
- conectar ações de pacientes com `usePatientsData`;
- sincronizar alterações do paciente selecionado com a timeline;
- enviar o paciente selecionado para `PatientPage`.

---

### `Sidebar.jsx`

Renderiza a navegação principal.

Responsabilidades:

- exibir abas principais do sistema;
- indicar a aba ativa;
- permitir troca entre Pacientes, Timeline e demais áreas futuras.

---

### `PatientsPage.jsx`

Controla a página de pacientes.

Responsabilidades:

- renderizar o topo da listagem;
- controlar busca e filtro;
- controlar abertura e fechamento do modal de paciente;
- controlar paciente em edição;
- controlar paciente em exclusão;
- renderizar lista filtrada;
- exibir estado vazio;
- conectar criação, edição e exclusão com o hook de pacientes;
- enviar resumos de timeline para cada card.

---

### `usePatientsData.js`

Hook responsável por centralizar os dados dos pacientes.

Responsabilidades:

- carregar pacientes do `localStorage`;
- salvar pacientes no `localStorage`;
- criar paciente;
- editar paciente;
- excluir paciente;
- restaurar lista inicial;
- calcular estatísticas internas da listagem;
- normalizar dados para manter compatibilidade entre pacientes antigos e novos.

Esse hook prepara o projeto para uma futura troca do `localStorage` por uma API/backend.

---

### `patientsUtils.js`

Centraliza funções utilitárias da área de pacientes.

Inclui funções para:

- normalizar texto de busca;
- remover diferenças de acento e caixa;
- montar texto pesquisável do paciente;
- filtrar pacientes por busca e status;
- identificar se há filtros ativos.

---

### `patientTimelineSummary.js`

Centraliza a leitura dos resumos de timeline para a lista de pacientes.

Responsabilidades:

- ler timeline salva no `localStorage`;
- carregar seed demonstrativo quando não houver timeline salva;
- contar sessões;
- contar blocos;
- contar conexões clínicas;
- gerar resumo por paciente;
- evitar que `PatientCard.jsx` conheça detalhes de `localStorage` ou estrutura interna da timeline.

---

### `AddPatientModal.jsx`

Renderiza o modal de criação e edição de pacientes.

Responsabilidades:

- coletar dados básicos do paciente;
- calcular idade a partir da data de nascimento;
- registrar contato;
- registrar datas clínicas;
- registrar queixa principal;
- registrar descrição inicial;
- registrar tags clínicas;
- registrar pessoas importantes;
- validar nome obrigatório;
- funcionar tanto em modo criação quanto em modo edição.

---

### `PatientCard.jsx`

Renderiza a linha responsiva de paciente.

Responsabilidades:

- exibir nome, idade, queixa principal e descrição;
- exibir status;
- exibir resumo da timeline;
- exibir última e próxima sessão;
- permitir abrir o paciente clicando no card inteiro;
- permitir navegação por teclado com `Enter`;
- disparar ações de editar, excluir e abrir sem conflito com o clique do card;
- reorganizar o layout em telas menores.

---

### `PatientsFilters.jsx`

Renderiza os controles compactos de busca e filtro.

Responsabilidades:

- exibir campo de busca;
- exibir filtro por status;
- permitir limpar filtros;
- manter a interface discreta no topo da página.

---

### `PatientsStats.jsx`

Componente criado anteriormente para cards de estatísticas.

Status atual:

- permanece no projeto;
- não é usado na versão atual da listagem;
- pode ser reaproveitado futuramente em um dashboard geral.

---

### `PatientPage.jsx`

Controla a página clínica do paciente.

Responsabilidades:

- definir o paciente aberto;
- renderizar cabeçalho do paciente;
- enviar o `patientId` para `useTimelineData`;
- renderizar timeline individual;
- abrir e fechar modal de criação de sessão/bloco;
- abrir modal de confirmação;
- conectar ações da interface com o hook `useTimelineData`.

---

### `PatientHeader.jsx`

Renderiza o cabeçalho do paciente selecionado.

Responsabilidades:

- exibir dados resumidos do paciente;
- exibir tags;
- exibir queixa/contexto clínico;
- exibir botão de edição futura;
- exibir botão para criar nova sessão;
- permitir voltar para a lista de pacientes quando essa ação estiver disponível.

---

### `useTimelineData.js`

Hook responsável por centralizar os dados da timeline individual do paciente.

Responsabilidades:

- receber o `patientId` do paciente aberto;
- carregar a timeline do paciente pelo `localStorage`;
- salvar a timeline em uma chave individual por paciente;
- carregar seed demonstrativo quando existir;
- iniciar pacientes sem seed com timeline vazia;
- fornecer blocos existentes para conexões;
- criar sessão;
- criar bloco;
- adicionar bloco em sessão existente;
- editar sessão;
- editar bloco;
- excluir sessão;
- excluir bloco;
- restaurar a timeline do paciente atual.

Esse hook prepara o projeto para uma futura troca do `localStorage` por uma API/backend com prontuários separados por paciente.

---

### `timelineSeeds.js`

Centraliza timelines demonstrativas opcionais por paciente.

Responsabilidades:

- guardar seeds clínicos de demonstração;
- mapear seeds por `patientId`;
- retornar uma timeline inicial quando o paciente possuir seed;
- retornar timeline vazia quando o paciente não possuir seed;
- evitar múltiplos arquivos de seed espalhados pelo projeto.

Atualmente, o seed demonstrativo existe para:

```txt
ana-luiza
```

A paciente Ana Luiza possui:

- 20 sessões demonstrativas;
- 5 blocos por sessão;
- 2 blocos com conexões clínicas por sessão.

---

### `Timeline.jsx`

Controla os modos principais da timeline.

Responsabilidades:

- alternar entre Sessões, Emoções, Relações e Espelho;
- controlar modal de bloco;
- controlar modal de sessão;
- preparar agrupamentos de blocos;
- distribuir dados para os componentes visuais;
- lidar com timelines vazias;
- atualizar ano e mês selecionados quando novas sessões são criadas.

---

### `TimelineEmptyState.jsx`

Renderiza o estado vazio da timeline.

Responsabilidades:

- orientar o usuário quando o paciente não possui sessões;
- explicar o início da construção da linha clínica;
- oferecer botão para criar a primeira sessão;
- manter a experiência consistente para pacientes sem seed.

---

### `SessionsCalendar.jsx`

Renderiza a visão de sessões em formato de calendário.

Responsabilidades:

- exibir anos disponíveis;
- exibir meses do ano selecionado;
- mostrar sessões do mês;
- mostrar contadores clínicos;
- abrir sessão;
- abrir bloco dentro da sessão.

---

### `GroupedBlocksView.jsx`

Componente reaproveitável para visões agrupadas.

Atualmente usado por:

- Emoções;
- Relações.

Pode ser usado futuramente para:

- tags;
- padrões;
- tipos de eventos;
- intensidade emocional.

---

### `MirrorTimeline.jsx`

Renderiza o Espelho do paciente.

Responsabilidades:

- organizar acontecimentos pela data real do evento;
- exibir linha da vida emocional;
- mostrar eventos principais;
- mostrar blocos conectados;
- exibir contadores do Espelho;
- filtrar apenas acontecimentos conectados.

---

### `ConfirmModal.jsx`

Renderiza um modal de confirmação reutilizável.

Atualmente usado para:

- confirmar exclusão de paciente;
- confirmar exclusão de bloco;
- confirmar exclusão de sessão;
- confirmar restauração da timeline do paciente atual.

---

### `timelineUtils.js`

Centraliza funções de leitura e organização da timeline.

Inclui funções para:

- obter sessões de um mês;
- obter todos os blocos;
- obter todos os anos;
- agrupar blocos por emoção ou pessoa;
- formatar datas;
- ordenar blocos por data de acontecimento;
- calcular contadores;
- localizar blocos conectados.

---

### `timelineMutations.js`

Centraliza funções que alteram a timeline.

Inclui ações para:

- criar sessão;
- criar sessão com múltiplos blocos;
- adicionar bloco em sessão existente;
- editar sessão;
- editar bloco;
- excluir bloco;
- excluir sessão;
- limpar conexões inválidas;
- criar ano ou mês quando necessário.

---

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- Tailwind CSS
- LocalStorage para persistência temporária
- Git e GitHub para versionamento

---

## Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar em ambiente de desenvolvimento

```bash
npm run dev
```

### 3. Acessar no navegador

Normalmente o Vite abre em:

```txt
http://localhost:5173
```

---

## Persistência dos dados

Neste momento, o projeto usa `localStorage` para persistir dados no navegador.

Dados persistidos atualmente:

- lista de pacientes;
- timeline individual de cada paciente;
- sessões;
- blocos;
- conexões.

As timelines são salvas por paciente, usando chaves como:

```txt
trama_timeline_data_ana-luiza
trama_timeline_data_joao-luiz
trama_timeline_data_marcos-vieira
```

Isso permite testar criação, edição, exclusão, filtros, navegação e prontuários separados sem backend.

Futuramente, essa camada deve ser substituída por uma API com banco de dados.

---

## Estado atual do MVP

O projeto atualmente possui uma base funcional para:

- navegar entre abas principais;
- listar pacientes;
- cadastrar pacientes;
- editar pacientes;
- excluir pacientes com confirmação;
- buscar pacientes;
- filtrar pacientes por status;
- exibir pacientes em lista horizontal responsiva;
- abrir paciente clicando no card inteiro;
- persistir pacientes localmente;
- abrir paciente na timeline;
- visualizar paciente selecionado;
- manter timeline individual por paciente;
- carregar seed demonstrativo opcional por paciente;
- iniciar pacientes sem seed com timeline vazia;
- exibir estado vazio da timeline;
- criar sessões;
- criar múltiplos blocos por sessão;
- adicionar blocos em sessões existentes;
- editar sessões;
- editar blocos;
- excluir sessões;
- excluir blocos;
- criar conexões entre blocos;
- visualizar dados por sessão, emoção, relação e espelho;
- confirmar ações críticas com modal próprio;
- persistir dados clínicos localmente.

---

## Dados demonstrativos atuais

O projeto possui dados demonstrativos para facilitar apresentação e testes visuais.

### Paciente Ana Luiza

A paciente Ana Luiza possui uma timeline demonstrativa criada em `timelineSeeds.js`.

Essa timeline contém:

- 20 sessões;
- 5 blocos por sessão;
- 100 blocos no total;
- 2 blocos conectados por sessão;
- sessões distribuídas entre abril e agosto de 2026.

Esses dados são carregados apenas quando a Ana não possui uma timeline salva no `localStorage`.

Caso a timeline da Ana já exista no navegador, o sistema preserva os dados salvos localmente.

Para recarregar o seed demonstrativo da Ana durante desenvolvimento:

```js
localStorage.removeItem("trama_timeline_data_ana-luiza")
```

Depois, basta atualizar a página e abrir a paciente Ana Luiza novamente.

---

## Próximos passos planejados

### Curto prazo

- Atualizar visual do cabeçalho do paciente.
- Adicionar edição do paciente diretamente pelo cabeçalho clínico.
- Melhorar modal de criação de sessão/bloco.
- Adicionar busca/filtros por emoção, pessoa e tag dentro da timeline.
- Melhorar o design dos modais.
- Criar indicadores visuais melhores para pacientes com ou sem timeline.
- Avaliar remoção ou reaproveitamento de `PatientsStats.jsx`.

### Médio prazo

- Criar prontuário individual mais completo por paciente.
- Criar painel de padrões emocionais.
- Criar tela de tags e conexões.
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
- Avaliar recursos com IA de apoio clínico, sempre mantendo o psicólogo no controle.

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

## Status do projeto

Projeto em desenvolvimento.

O foco atual é construir um MVP funcional, organizado e apresentável como projeto de portfólio.

A área de pacientes já possui um CRUD local funcional com persistência em `localStorage`.

A lista de pacientes possui layout horizontal responsivo, busca, filtro, resumo de timeline e abertura do paciente pelo card inteiro.

A área de timeline já permite registrar sessões, blocos, emoções, relações, conexões e espelho clínico.

Cada paciente possui timeline individual, com seed demonstrativo opcional por paciente.

---

## Autor

Desenvolvido por Felipe Holanda.