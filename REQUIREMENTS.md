# 📋 Requisitos de Instalação - Cuida SCS

## Requisitos de Sistema

### Hardware Mínimo
- **Processador**: Dual-core 2.0 GHz ou superior
- **Memória RAM**: 4 GB (8 GB recomendado)
- **Espaço em Disco**: 500 MB livres
- **Conexão Internet**: Necessária para carregar mapas

### Software Necessário

| Software | Versão Mínima | Versão Recomendada | Download |
|----------|---------------|-------------------|----------|
| Node.js | 18.0.0 | 20.x LTS | [nodejs.org](https://nodejs.org) |
| npm | 9.0.0 | 10.x | Incluído no Node.js |
| Git | 2.30.0 | 2.40+ | [git-scm.com](https://git-scm.com) |

### Alternativa: Bun Runtime
| Software | Versão Mínima | Download |
|----------|---------------|----------|
| Bun | 1.0.0 | [bun.sh](https://bun.sh) |

---

## Navegadores Suportados

| Navegador | Versão Mínima | Suporte WebGL |
|-----------|---------------|---------------|
| Chrome | 90+ | ✅ Requerido |
| Firefox | 88+ | ✅ Requerido |
| Safari | 14+ | ✅ Requerido |
| Edge | 90+ | ✅ Requerido |

> ⚠️ **Importante**: WebGL é obrigatório para renderização do Mapbox GL JS

---

## Dependências do Projeto

### Dependências de Produção

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "typescript": "^5.0.0",
  "mapbox-gl": "^3.17.0",
  "framer-motion": "^11.18.2",
  "tailwindcss": "^3.4.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "lucide-react": "^0.462.0",
  "sonner": "^1.7.4",
  "zod": "^3.25.76",
  "date-fns": "^3.6.0",
  "uuid": "^9.0.1"
}
```

### Componentes Radix UI (shadcn/ui)

```json
{
  "@radix-ui/react-accordion": "^1.2.11",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-checkbox": "^1.3.2",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-popover": "^1.1.14",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-radio-group": "^1.3.7",
  "@radix-ui/react-scroll-area": "^1.2.9",
  "@radix-ui/react-select": "^2.2.5",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-switch": "^1.2.5",
  "@radix-ui/react-tabs": "^1.1.12",
  "@radix-ui/react-toast": "^1.2.14",
  "@radix-ui/react-tooltip": "^1.2.7"
}
```

### Dependências de Desenvolvimento

```json
{
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "@types/mapbox-gl": "^3.4.1",
  "@types/uuid": "^9.0.8",
  "vite": "^5.4.0",
  "eslint": "^9.0.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0"
}
```

---

## Configuração de Ambiente

### Variáveis de Ambiente Obrigatórias

Crie um arquivo `.env` na raiz do projeto:

```env
# Mapbox Configuration
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_public_token_here
```

### Variáveis de Ambiente Opcionais (Futuro)

```env
# Supabase (para integração backend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Analytics (opcional)
VITE_ANALYTICS_ID=your_analytics_id
```

---

## Instalação Passo a Passo

### 1. Verificar Pré-requisitos

```bash
# Verificar Node.js
node --version
# Deve retornar: v18.x.x ou superior

# Verificar npm
npm --version
# Deve retornar: 9.x.x ou superior

# Verificar Git
git --version
# Deve retornar: git version 2.x.x
```

### 2. Clonar Repositório

```bash
git clone https://github.com/seu-usuario/cuida-scs.git
cd cuida-scs
```

### 3. Instalar Dependências

**Com npm:**
```bash
npm install
```

**Com Bun (mais rápido):**
```bash
bun install
```

### 4. Configurar Token Mapbox

1. Acesse [mapbox.com](https://www.mapbox.com/)
2. Crie uma conta ou faça login
3. Navegue para **Account → Tokens**
4. Copie o token público padrão
5. Crie o arquivo `.env`:

```bash
echo "VITE_MAPBOX_ACCESS_TOKEN=pk.seu_token_aqui" > .env
```

### 5. Iniciar Aplicação

**Desenvolvimento:**
```bash
npm run dev
```

**Build de Produção:**
```bash
npm run build
npm run preview
```

---

## Verificação de Instalação

Após iniciar o servidor de desenvolvimento, verifique:

| Verificação | Resultado Esperado |
|-------------|-------------------|
| Acesso à URL | `http://localhost:5173` carrega sem erros |
| Mapa renderiza | Mapa Mapbox visível com marcadores |
| Console sem erros | Nenhum erro crítico no DevTools |
| Seletor de perfil | Troca de perfil funciona |
| Clique no mapa | Ação corresponde ao perfil ativo |

---

## Solução de Problemas

### Erro: "Mapbox token not configured"

**Causa**: Token do Mapbox não encontrado ou inválido.

**Solução**:
1. Verifique se o arquivo `.env` existe
2. Confirme que o token começa com `pk.`
3. Reinicie o servidor de desenvolvimento

### Erro: "WebGL not supported"

**Causa**: Navegador não suporta WebGL.

**Solução**:
1. Atualize o navegador para versão mais recente
2. Verifique se WebGL está habilitado nas configurações
3. Teste em: [get.webgl.org](https://get.webgl.org/)

### Erro: "Module not found"

**Causa**: Dependências não instaladas corretamente.

**Solução**:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Build falha com erro de memória

**Causa**: Node.js sem memória suficiente.

**Solução**:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## Suporte

Para problemas de instalação:
1. Verifique este documento completamente
2. Consulte o README.md
3. Abra uma issue no repositório

---

## Changelog de Requisitos

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 2024-12 | Versão inicial |
