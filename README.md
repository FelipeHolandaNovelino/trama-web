# Trama

**Trama** é um protótipo de sistema web para psicólogos acompanharem a história clínica e emocional de seus pacientes de forma visual, cronológica e conectada.

A proposta do projeto é ir além de um prontuário tradicional, permitindo que o profissional visualize sessões, acontecimentos, emoções, relações importantes, padrões e conexões entre eventos relatados pelo paciente.

---

## Objetivo do projeto

O objetivo do Trama é ajudar psicólogos autônomos, especialmente profissionais que atendem pacientes de forma individual, a construir uma visão mais clara da trajetória emocional de cada paciente.

O sistema organiza informações clínicas em diferentes modos de visualização:

- **Sessões**: visão em formato de calendário clínico, organizada pela data dos atendimentos.
- **Emoções**: blocos agrupados pelas emoções associadas aos acontecimentos.
- **Relações**: blocos agrupados pelas pessoas importantes na vida do paciente.
- **Espelho**: linha da vida emocional do paciente, organizada pela data real dos acontecimentos relatados.

---

## Conceito principal

No Trama, uma sessão pode conter vários blocos de eventos.

Isso permite que, em um único atendimento, o psicólogo registre diferentes acontecimentos, emoções, pessoas envolvidas, padrões e conexões clínicas.

Exemplo:

```txt
Sessão do dia 10/03/2026
├─ Bloco 1: conflito com a mãe
├─ Bloco 2: ansiedade no trabalho
├─ Bloco 3: lembrança de abandono na infância
└─ Bloco 4: insight sobre autocobrança
```

Cada bloco pode ter:

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

### Paciente

- Exibição de dados resumidos do paciente.
- Cabeçalho compacto e responsivo.
- Botão para criar nova sessão.

### Sessões

- Visualização em formato de calendário anual.
- Seletor de ano.
- Cards mensais com quantidade de sessões.
- Contadores de:
  - sessões no ano;
  - sessões totais;
  - blocos de eventos totais;
  - mês aberto.
- Abertura de sessão em modal.
- Edição dos dados da sessão.
- Exclusão de sessão inteira com modal de confirmação.
- Adição de novos blocos em sessão existente.

### Blocos de eventos

- Criação de blocos dentro de uma sessão.
- Criação de múltiplos blocos em uma única sessão.
- Edição de blocos.
- Exclusão de blocos com modal de confirmação.
- Visualização compacta dos blocos.
- Abertura de bloco em modal.
- Exibição de emoções, pessoas, tags e intensidade emocional.

### Conexões

- Criação de conexões manuais entre blocos.
- Indicação visual de blocos conectados.
- Abertura de blocos conectados dentro do modal.
- Remoção automática de conexões inválidas ao excluir blocos ou sessões.

### Confirmações

O sistema possui um modal próprio de confirmação para ações críticas:

- excluir bloco;
- excluir sessão;
- restaurar timeline inicial.

Isso substitui o `confirm()` padrão do navegador e mantém a experiência visual dentro do padrão do Trama.

---

## Modos de visualização

O sistema possui quatro modos principais:

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
│  ├─ AddSessionModal.jsx
│  ├─ ConfirmModal.jsx
│  ├─ GroupedBlocksView.jsx
│  ├─ MirrorTimeline.jsx
│  ├─ PatientHeader.jsx
│  ├─ SessionModal.jsx
│  ├─ SessionsCalendar.jsx
│  ├─ Sidebar.jsx
│  ├─ Timeline.jsx
│  ├─ TimelineBlock.jsx
│  └─ TimelineBlockModal.jsx
│
├─ data/
│  ├─ patient.js
│  └─ timeline.js
│
├─ hooks/
│  └─ useTimelineData.js
│
├─ pages/
│  └─ PatientPage.jsx
│
├─ utils/
│  ├─ timelineMutations.js
│  └─ timelineUtils.js
│
├─ App.jsx
└─ main.jsx
```

---

## Arquitetura atual

O projeto foi organizado para separar responsabilidades entre página, componentes visuais, hook de dados, funções utilitárias e funções de mutação.

```txt
PatientPage.jsx
→ controla a tela do paciente e os modais principais

useTimelineData.js
→ controla estado, persistência e ações da timeline

timelineMutations.js
→ altera a estrutura da timeline

timelineUtils.js
→ lê, agrupa, formata e calcula dados

Timeline.jsx
→ controla abas, modais de sessão/bloco e distribuição das visões

SessionsCalendar.jsx
→ renderiza a visão de sessões em calendário

GroupedBlocksView.jsx
→ renderiza agrupamentos de Emoções e Relações

MirrorTimeline.jsx
→ renderiza o Espelho conectado do paciente
```

---

## Responsabilidades dos principais arquivos

### `PatientPage.jsx`

Controla a página principal do paciente.

Responsabilidades:

- renderizar cabeçalho do paciente;
- renderizar timeline;
- abrir e fechar modal de criação de sessão/bloco;
- abrir modal de confirmação;
- conectar ações da interface com o hook `useTimelineData`.

---

### `useTimelineData.js`

Hook responsável por centralizar os dados da timeline.

Responsabilidades:

- carregar dados do `localStorage`;
- salvar dados no `localStorage`;
- fornecer blocos existentes para conexões;
- criar sessão;
- criar bloco;
- adicionar bloco em sessão existente;
- editar sessão;
- editar bloco;
- excluir sessão;
- excluir bloco;
- restaurar timeline inicial.

Esse hook prepara o projeto para uma futura troca do `localStorage` por uma API/backend.

---

### `Timeline.jsx`

Controla as abas principais da timeline.

Responsabilidades:

- alternar entre Sessões, Emoções, Relações e Espelho;
- controlar modal de bloco;
- controlar modal de sessão;
- preparar agrupamentos de blocos;
- distribuir dados para os componentes visuais.

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

- confirmar exclusão de bloco;
- confirmar exclusão de sessão;
- confirmar restauração da timeline inicial.

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

Neste momento, o projeto usa `localStorage` para persistir os dados da timeline no navegador.

Isso permite testar criação, edição e exclusão de sessões e blocos sem backend.

Futuramente, essa camada deve ser substituída por uma API com banco de dados.

---

## Estado atual do MVP

O projeto atualmente possui uma base funcional para:

- visualizar paciente;
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
- persistir dados localmente.

---

## Próximos passos planejados

### Curto prazo

- Melhorar modal de criação de sessão/bloco.
- Melhorar edição do paciente.
- Adicionar busca/filtros por emoção, pessoa e tag.
- Criar tela de listagem de pacientes.
- Melhorar o design dos modais.
- Revisar responsividade geral.

### Médio prazo

- Criar cadastro real de pacientes.
- Criar painel de padrões emocionais.
- Criar tela de tags e conexões.
- Criar relatórios clínicos.
- Adicionar autenticação.
- Integrar backend.

### Longo prazo

- Criar banco de dados.
- Implementar segurança e LGPD.
- Criar permissões por profissional.
- Criar exportação de relatórios.
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

---

## Autor

Desenvolvido por Felipe Holanda.