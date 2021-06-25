# LinkedOut Bot

Automagically publish your GitHub activity to LinkedIn.

Built on https://github.com/vercel/next.js/tree/canary/examples/with-mongodb template.

### Set up environment variables

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Set each variable on `.env.local`:

- `MONGODB_URI` - Your MongoDB connection string. If you are using [MongoDB Atlas](https://mongodb.com/atlas) you can find this by clicking the "Connect" button for your cluster.
- `MONGODB_DB` - The name of the MongoDB database you want to use.

### Run Next.js in development mode

```bash
yarn install
yarn dev
```
