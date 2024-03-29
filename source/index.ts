import 'dotenv/config';
import 'reflect-metadata';

import Koa from 'koa';
import jwt from 'koa-jwt';
import KoaLogger from 'koa-logger';
import { useKoaServer } from 'routing-controllers';

import { mocker, router, SessionController, swagger } from './controller';
import { dataSource } from './model';
import { AUTHING_APP_SECRET, isProduct, PORT } from './utility';

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
        !!(await SessionController.getSession(action, roles)),
    currentUserChecker: action => SessionController.getSession(action)
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
