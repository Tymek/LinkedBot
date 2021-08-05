# LinkedBot

Automagically publish your GitHub stars activity to LinkedIn.

Built on https://github.com/vercel/next.js/tree/canary/examples/with-mongodb template.

### Set up environment variables

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Set each variable in `.env.local`.

GitHub doesn't allow multiple callback URLs per application, so you will need one with it set to `http://localhost:3000/api/github/callback` for development.

### Run Next.js in development mode

```bash
yarn install
yarn dev
```

### Configure GitHub Actions

In order to enable automatic processing of activity, set following secrets in GitHub:

- `DEPLOYMENT_URL` - for example `https://linkedbot.vercel.app`
- `CRON_SECRET` - to the same value as in Vercel / deployment env
