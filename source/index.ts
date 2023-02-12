import 'reflect-metadata';
import 'dotenv/config';

import Koa from 'koa';
import KoaLogger from 'koa-logger';
import jwt from 'koa-jwt';
import { useKoaServer } from 'routing-controllers';

import { swagger, mocker, router, UserController } from './controller';
import dataSource, { isProduct } from './model';

const { PORT = 8080, AUTHING_APP_SECRET } = process.env;

const HOST = `http://localhost:${PORT}`,
    app = new Koa()
        .use(KoaLogger())
        .use(swagger({ exposeSpec: true }))
        .use(jwt({ secret: AUTHING_APP_SECRET, passthrough: true }));

if (!isProduct) app.use(mocker());

useKoaServer(app, {
    ...router,
    cors: true,
    authorizationChecker: async (action, roles) =>
        !!(await UserController.getSession(action, roles)),
    currentUserChecker: UserController.getSession
});

console.time('Server boot');

dataSource.initialize().then(() =>
    app.listen(PORT, () => {
        console.log(`
HTTP served at ${HOST}
Swagger API served at ${HOST}/docs/
Swagger API exposed at ${HOST}/docs/spec`);

        if (!isProduct) console.log(`Mock API served at ${HOST}/mock/\n`);

        console.timeEnd('Server boot');
    })
);
