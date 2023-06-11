# TODO

- [ ] Add Chakra UI (client only)
- [ ] Look into Chakra UI Ark
  - [ ] Panda is their upcoming replacement of Chakra
- [ ] Look into docker layer caching to improve build speed
- [ ] SSM_BATH_PATH requires a trailing slash, figure out how to handle that case
- [x] Add AWS SSM Params into secret grab


# Stack
- TypeScript
- ESLint + Prettier
- Absolute imports
- Chakra UI
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- Cloud secrets config override (AWS SSM Parameter Store)
- Docker (~24MB image size on AWS ECR)
- CircleCI
- [PNPM](https://pnpm.io/) (mostly for Docker, you can use whatever)

# Setup

## Node
Set up your `.env` based on `.env.example` then:

```
pnpm i
pnpm migrate:generate
pnpm dev
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
