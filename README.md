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
NEXT_PUBLIC_STRAVA_REDIRECT_URI=http://localhost:3000/strava/callback
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

este frontend se conecta com o backend em [api-velox](https://github.com/htamagnus/api-velox), hospedado no render. detalhes do deploy do back, do banco e dos limites do google maps estão no readme de lá.

## 🚢 deploy

- vercel (hobby), domínio `https://web-velox.vercel.app`, deploy automático a cada push na `main`.
- as variáveis `NEXT_PUBLIC_*` são do tipo **config**, não secret: elas vão para o navegador de qualquer jeito, e a vercel não aceita secret com prefixo público.
- essas variáveis entram no build. mudar alguma exige **redeploy**.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` é a chave `velox-app`, protegida por restrição de site e de api no gcp, não por sigilo.
- o domínio também precisa estar no `ALLOWED_ORIGINS` do back, no callback domain do strava e na restrição de sites da chave `velox-app`.

