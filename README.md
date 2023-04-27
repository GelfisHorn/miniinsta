# Instaclone

Full-stack clone of Instagram website, with a personal touch on UI.

Visit the site on [helphistech-miniinsta.vercel.app](https://instaclone-samuelrnn.vercel.app).

## Get the project running

- install packages (delete pnpm-lock.yaml to use npm)

```bash
pnpm install
```

- replace env variables
  note that for EMAIL and PASSWORD you will need a google account with 2FA enabled and a application password, you can enable it [here](https://myaccount.google.com/security)

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
EMAIL="john.doe@gmail.com"
PASSWORD="apppassword"
JWT_SECRET="token_secret"
NODE_ENV="development" #production | development
NEXT_PUBLIC_UPLOADCARE_PUB_KEY="api_key"
NEXT_PUBLIC_DEPLOY_URL="https://instagram-clone.vercel.app"
```

- run prisma migrate on dev mode

```bash
npx prisma migrate dev --name init
```

- start project

```bash
npm run dev
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
