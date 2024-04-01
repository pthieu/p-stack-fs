# TODO

- [ ] add /terms and /privacy
- [ ] move `~/lib/utils` to `~/lib/shared/utils`
- [ ] add tailwind sorter plugin
- [ ] add https://www.npmjs.com/package/eslint-plugin-tailwindcss
- [ ] move all schema's into one schema/index.ts file, change db/index.ts file to import it and use it for relational queries (easier to have one import and never change)
- [ ] add migrate:introspect command
- [ ] figure out how to implement drizzle schema+queries
- [ ] add waitlist sign up
- [ ] InferModel to InferSelectModel and InferInsertModel
- [ ] default to system theme, toggle to light theme, toggle to dark available? maybe default to system and somehow detect if toggle should go to dark or light?
- [ ] add waitlist landing and email capture in db
- [ ] standlone react app needs to install sharp:
  - Error: 'sharp' is required to be installed in standalone mode for the image optimization to function correctly. Read more at: https://nextjs.org/docs/messages/sharp-missing-in-production
- [ ] EACCES issue, prob beucase we're using a nextjs user on docker, change this:
  Failed to write image to cache fLg+7lRpUwPwjLk5SFySo+JwrcjMsgQqRw1Ro7cjuS0= [Error: EACCES: permission denied, mkdir '/app/.next/cache'] {
    errno: -13,
    code: 'EACCES',
    syscall: 'mkdir',
    path: '/app/.next/cache
  }
- [ ] add immer
- [ ] add auth middleware (copy from strandler)
- [ ] add lint and compile in dev branch only, copy to strandler to opensource
- [ ] add google analytics
- [ ] Add toaster to main thing
- [ ] Add zustand and a store?
- [ ] Look into docker layer caching to improve build speed
- [ ] Figure out how to support migrations with `pn serve` local case (or just give up and use docker)
- [x] Add Chakra UI
- [x] Add AWS SSM Params injection from docker


# Stack
- TypeScript
- ESLint + Prettier
- Absolute imports
- Chakra UI or Tamagui (soon)
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- Cloud secrets config override (AWS SSM Parameter Store)
- Docker (~50MB image size on AWS ECR)
- CircleCI
- [PNPM](https://pnpm.io/)

# Setup

## Node
Set up your `.env` based on `.env.example` then:

```
pnpm i
pnpm migrate:generate // generates the migration files
pnpm dev // starts the server (migrations run from the application)
```

## Clerk
Need to update the session token claims to work with social logins and detect if a user is creating a new account because social login sign-up/sign-in are the same.
See: [link](https://discord.com/channels/856971667393609759/1158583782891339807/1158813553160097792)

1. Go to `Clerk Dashboard > Sessions > Customize session tokens (edit)`
2. Add the following (WITHOUT IT YOU WILL GET an error `Error: Clerk: auth() was called but Clerk can't detect usage of authMiddleware().`):
```json
{
	"email": "{{user.primary_email_address}}",
	"metadata": "{{user.public_metadata}}"
}
```
3. Go to `Paths`, set Application homepage to `/home` or `/dashboard` or whatever you want otherwise it will keep redirecting the user to `/` if the user is already logged in and you click the login button.
4. Set up secret keys for dev/production in .env/SSM
5. Set up google auth project for prod (no verification needed)


# Debugging

## VSCode
Debug with this `launch.json` in the root folder.
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "request": "launch",
      "type": "node-terminal"
      "command": "pnpm dev",
      "cwd": "${workspaceFolder}/next-app"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Current file (TS)",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceRoot}/node_modules/tsx/dist/cli.js",
      "args": [
        "${file}"
      ],
    }
  ]
}
```

# Deployment

## Local Build

Running `pnpm build` then `pnpm serve` will not currently run migrations, because next.js doesn't compile the migration folder. To test local migrations, it's better to use the Docker build.

## Docker
Set up your `.env.docker` based on `.env.example`, you'll have to use `host.docker.internal` for the DB host instead of `localhost`, then:
```
docker build -t p-stack-fs . && docker-compose up -d
```

Clean up after with:
```
docker system prune -a
```

Note: to test AWS SSM params, the following are needed:
```
SSM_BASE_PATH=
AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
And you will have to create your AWS SSM Parameters at `SSM_BASE_PATH` before running the container.

## Secrets
We're using AWS SSM Parameter Store for secrets. Instead of using `aws-cli` in Docker and bloating the image size, we use [a go binary](https://github.com/pthieu/go-aws-get-parameter) to handle fetching and exporting of secrets.

This repo `wget`'s the binary from the repo above and runes it in the Dockerfile. If you don't trust this, you can fork the repo and build the binary yourself.
