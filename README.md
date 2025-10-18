# velox frontend

aplicação frontend do velox - planejador de rotas de bike com next.js 15.

## 🚀 tecnologias

- next.js 15
- react 19
- typescript
- tailwindcss 4
- google maps api
- strava api integration
- pwa support

## 📦 desenvolvimento local

### pré-requisitos

- node.js 20+
- pnpm 9+

### instalação

```bash
pnpm install
```

### variáveis de ambiente

crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_VELOX_API=http://localhost:8080
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_api_key
NEXT_PUBLIC_STRAVA_CLIENT_ID=seu_client_id
```

### executar

```bash
pnpm dev
```

acesse [http://localhost:3000](http://localhost:3000)

### build local

```bash
pnpm build
pnpm start
```

## 🤝 integração com backend

este frontend se conecta com o backend em [api-velox](https://github.com/htamagnus/api-velox):
- backend: elastic beanstalk (node.js/nestjs)
- frontend: amplify hosting (next.js)

