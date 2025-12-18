# 🌱 Cuida SCS - Gestão Inteligente de Resíduos Urbanos

<div align="center">

![Cuida SCS](https://img.shields.io/badge/Cuida-SCS-22c55e?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![Mapbox](https://img.shields.io/badge/Mapbox-GL-000000?style=for-the-badge&logo=mapbox)

**Plataforma de detecção, priorização e coordenação de limpeza urbana com cooperativas**

[Demo](#demonstração-rápida) • [Funcionalidades](#-funcionalidades) • [Instalação](#-instalação) • [Documentação](#-documentação)

</div>

---

## 📋 Sobre o Projeto

O **Cuida SCS** é uma plataforma MVP desenvolvida para hackathon focada em economia circular e gestão de resíduos urbanos. O sistema permite a detecção inteligente de pontos de descarte irregular, priorização transparente de hotspots através de algoritmo de scoring explicável, e coordenação eficiente de rotas de coleta com cooperativas de reciclagem.

### 🎯 Problema Abordado

- Descarte irregular de resíduos em áreas urbanas
- Falta de priorização inteligente para limpeza
- Desconexão entre cidadãos, operadores e cooperativas
- Ausência de transparência nos critérios de priorização

### 💡 Solução

Plataforma integrada que conecta cidadãos (denúncias), câmeras de monitoramento (detecção automatizada), operadores (gestão e rotas) e cooperativas (coleta e reciclagem) em um fluxo circular completo.

---

## ✨ Funcionalidades

### 🗺️ Mapa Interativo
- Visualização geolocalizada de ocorrências de resíduos
- Hotspots com cores indicando criticidade (verde → vermelho)
- Marcadores de câmeras de monitoramento
- Clique no mapa para interações contextuais por perfil

### 👥 Perfis de Usuário

#### 👤 Cidadão
- **Reportar Resíduos**: Clique no mapa para registrar ocorrência
- **Formulário Completo**: Tipo de resíduo, volume estimado, descrição
- **Confirmação de Veracidade**: Checkbox obrigatório para validação
- **Geolocalização Automática**: Coordenadas precisas do local

#### 🔧 Operador
- **Adicionar Câmeras**: Clique no mapa para posicionar câmeras
- **Remover Câmeras**: Modal com confirmação para exclusão
- **Modo Demo**: Simulação de detecções e ocorrências
- **Gerar Roteiros**: Criação de rotas otimizadas de coleta
- **Gestão de Alertas**: Visualização e atualização de status

#### ♻️ Cooperativa
- **Visualizar Hotspots**: Áreas prioritárias para coleta
- **Receber Alertas**: Notificações de áreas para atuação
- **Acompanhar Rotas**: Roteiros designados

#### 🏢 Patrocinador
- **Dashboard de Métricas**: Indicadores de impacto
- **Visualização de Dados**: Estatísticas de coleta e reciclagem

### 📊 Sistema de Scoring de Hotspots

Algoritmo transparente com 4 componentes ponderados:

| Componente | Peso | Descrição |
|------------|------|-----------|
| Recorrência | 30% | Quantidade de ocorrências abertas na célula |
| Detecções | 25% | Soma de confiança das detecções por câmera |
| Tempo | 25% | Penalidade por tempo desde última limpeza |
| Volume | 20% | Bônus por volume estimado de resíduos |

**Score normalizado**: 0-100 com categorias:
- 🟢 **Baixo** (0-25): Prioridade normal
- 🟡 **Médio** (26-50): Atenção recomendada
- 🟠 **Alto** (51-75): Prioridade alta
- 🔴 **Crítico** (76-100): Ação imediata necessária

### 🎬 Modo Demo

Funcionalidade exclusiva para operadores que simula:
- 5 detecções de câmera no entorno das câmeras existentes
- 3 novas ocorrências de resíduos
- Recálculo automático de hotspots
- Animações de atualização no mapa

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 18.3** - Biblioteca UI
- **TypeScript 5.0** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router 6** - Roteamento SPA

### UI/UX
- **Tailwind CSS** - Estilização utility-first
- **shadcn/ui** - Componentes acessíveis
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones modernos

### Mapas
- **Mapbox GL JS** - Renderização de mapas
- **GeoJSON** - Formato de dados geográficos

### Estado e Dados
- **React Context** - Gerenciamento de estado global
- **TanStack Query** - Cache e sincronização (preparado)
- **Zod** - Validação de schemas

### Qualidade
- **ESLint** - Linting de código

---

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes shadcn/ui
│   ├── Header.tsx       # Cabeçalho com navegação
│   ├── Logo.tsx         # Logo do projeto
│   ├── MapView.tsx      # Componente do mapa Mapbox
│   ├── MapSidePanel.tsx # Painel lateral do mapa
│   ├── NewOccurrenceForm.tsx    # Formulário de ocorrência
│   ├── CameraVideoModal.tsx     # Modal de câmera
│   ├── ProfileSelector.tsx      # Seletor de perfis
│   └── ...
├── contexts/
│   └── AppContext.tsx   # Estado global da aplicação
├── data/
│   └── seedData.ts      # Dados iniciais de demonstração
├── hooks/               # Hooks customizados
├── lib/
│   ├── mapbox.ts        # Configuração do Mapbox
│   ├── score.ts         # Algoritmo de scoring
│   └── utils.ts         # Utilitários
├── pages/               # Páginas da aplicação
│   ├── MapPage.tsx      # Página principal do mapa
│   ├── DashboardPage.tsx
│   ├── HotspotsPage.tsx
│   ├── RoteirosPage.tsx
│   ├── CooperativasPage.tsx
│   └── SobrePage.tsx
├── types/
│   └── index.ts         # Definições de tipos TypeScript
├── App.tsx              # Componente raiz
├── main.tsx             # Entry point
└── index.css            # Estilos globais e design system
```

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **bun** >= 1.0.0
- **Conta Mapbox** com Access Token público

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/cuida-scs.git
cd cuida-scs
```

2. **Instale as dependências**
```bash
npm install
# ou
bun install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
VITE_MAPBOX_ACCESS_TOKEN=seu_token_mapbox_aqui
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
bun dev
```

5. **Acesse a aplicação**
```
http://localhost:5173
```

> 📖 Para requisitos detalhados, consulte [REQUIREMENTS.md](REQUIREMENTS.md)

---

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Executa ESLint |

---

## 🔐 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_MAPBOX_ACCESS_TOKEN` | ✅ | Token público do Mapbox |

### Obtendo o Token Mapbox

1. Acesse [mapbox.com](https://mapbox.com)
2. Crie uma conta gratuita
3. Vá para **Account → Tokens**
4. Copie o **Default public token** ou crie um novo

---

## 🎮 Como Usar

### Fluxo Básico

1. **Selecione um Perfil** no seletor do header
2. **Navegue pelo Mapa** para visualizar ocorrências e hotspots
3. **Interaja conforme o perfil**:
   - Cidadão: Clique para reportar resíduos
   - Operador: Clique para adicionar câmeras, use Modo Demo

### Demonstração Rápida

1. Selecione perfil **Operador**
2. Clique em **Modo Demo** no painel lateral
3. Observe as detecções e ocorrências sendo geradas
4. Veja os hotspots mudando de cor conforme a criticidade
5. Gere um **Roteiro** de coleta
6. Mude para perfil **Cooperativa** e veja os alertas

---

## 🌍 Região de Foco

O MVP está configurado para a região de **Brasília/DF**, com:
- Centro do mapa: `-15.7967, -47.8870`
- Zoom inicial: 18
- Dados de seed concentrados nesta área

---

## 🔮 Roadmap

- [ ] Integração com backend real (Supabase)
- [ ] Autenticação de usuários
- [ ] Upload de fotos nas ocorrências
- [ ] Notificações push
- [ ] Integração com câmeras reais (Computer Vision)
- [ ] App mobile (React Native)
- [ ] API pública para integrações
- [ ] Relatórios exportáveis

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

Desenvolvido para o Hackathon de Economia Circular e Gestão de Resíduos.

---

<div align="center">

**Cuida SCS** - Transformando a gestão de resíduos urbanos através da tecnologia 🌱

</div>
