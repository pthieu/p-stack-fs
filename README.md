# TODO

- [ ] Add CircleCI config
- [ ] Look into Chakra UI Ark
  - [ ] Panda is their upcoming replacement of Chakra
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

# Debugging

## VSCode
Debug with this `launch.json`
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "request": "launch",
      "type": "node-terminal"
      "command": "pnpm dev",
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
docker build -t ts-next-pg . && docker-compose up -d
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
