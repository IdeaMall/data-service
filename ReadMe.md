# IdeaMall - data service

[REST][1]ful API service of IdeaMall, which is based on [Node.js][2] & [TypeScript][3]

[![Deploy to Production environment](https://github.com/IdeaMall/data-service/actions/workflows/deploy-production.yml/badge.svg)][4]

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)][5]

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)][6]
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)][7]

## Feature

1.  HTTP server: [Koa][8]
2.  Controller framework: [Routing Controllers][9]
3.  Model framework: [Class Transformer][10] & [Class Validator][11]
4.  ORM framework: [TypeORM][12]
5.  API document: [Swagger][13]
6.  Mock API: [OpenAPI backend][14]

## API Usage

-   Entry: http://localhost:8080/
-   Document: http://localhost:8080/docs/
-   Schema: http://localhost:8080/docs/spec/

### Type package

#### Sign in GitHub packages with NPM

1.  Generate a [PAT][15] with `read:packages` authorization
2.  Run Sign-in command in your terminal, and use PAT as password:

```shell
npm login --scope=@ideamall --registry=https://npm.pkg.github.com
```

#### Installation

```shell
npm i pnpm -g

pnpm i @ideamall/data-service -D
```

## Environment variables

|         Name         |             Usage             |
| :------------------: | :---------------------------: |
|     `APP_SECRET`     |   encrypt Password & Token    |
|    `DATABASE_URL`    | PostgreSQL connection string  |
|     `APP_SECRET`     |   encrypt Password & Token    |
| `LEANCLOUD_API_HOST` | API domain of [LeanCloud][16] |
|  `LEANCLOUD_APP_ID`  |   App ID of [LeanCloud][16]   |
| `LEANCLOUD_APP_KEY`  |  App Key of [LeanCloud][16]   |

## Development

### Installation

```shell
npm i pnpm -g
pnpm i
```

### Start Development environment

```shell
pnpm dev
```

or just press <kbd>F5</kbd> key in [VS Code][17].

### Migration

```shell
pnpm upgrade:dev
```

## Deployment

### Start Production environment

```shell
npm start
```

### Migration

```shell
pnpm upgrade:pro
```

### Docker

```shell
pnpm pack-image
pnpm container
```

## Releasing

### Deploy Application

```shell
git checkout master
git tag v1.0.0  # this version tag comes from ./package.json
git push origin master --tags
```

### Publish Type Package

```shell
git checkout master
git tag type-v1.0.0  # this version tag comes from ./type/package.json
git push origin master --tags
```

[1]: https://en.wikipedia.org/wiki/Representational_state_transfer
[2]: https://nodejs.org/
[3]: https://www.typescriptlang.org/
[4]: https://github.com/IdeaMall/data-service/actions/workflows/deploy-production.yml
[5]: https://render.com/deploy
[6]: https://codespaces.new/ideaMall/data-service
[7]: https://gitpod.io/?autostart=true#https://github.com/ideaMall/data-service
[8]: https://koajs.com/
[9]: https://github.com/typestack/routing-controllers
[10]: https://github.com/typestack/class-transformer
[11]: https://github.com/typestack/class-validator
[12]: https://typeorm.io/
[13]: https://swagger.io/
[14]: https://github.com/anttiviljami/openapi-backend
[15]: https://github.com/settings/tokens
[16]: https://leancloud.cn/
[17]: https://code.visualstudio.com/
