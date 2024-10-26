import { config } from 'dotenv';
import 'reflect-metadata';

config({ path: [`.env.${process.env.NODE_ENV}.local`, '.env.local', '.env'] });

import Koa from 'koa';
import jwt from 'koa-jwt';
import KoaLogger from 'koa-logger';
import { useKoaServer } from 'routing-controllers';

import {
    BaseController,
    controllers,
    mocker,
    SessionController,
    swagger
} from './controller';
import { dataSource } from './model';
import { APP_SECRET, isProduct, PORT } from './utility';

const HOST = `localhost:${PORT}`,
    app = new Koa()
        .use(KoaLogger())
        .use(swagger({ exposeSpec: true }))
        .use(jwt({ secret: APP_SECRET, passthrough: true }));

if (!isProduct) app.use(mocker());

useKoaServer(app, {
    controllers,
    cors: true,
    authorizationChecker: async (action, roles) =>
        !!(await SessionController.getSession(action, roles)),
    currentUserChecker: action => SessionController.getSession(action)
});

console.time('Server boot');

dataSource.initialize().then(() =>
    app.listen(PORT, () => {
        console.log(BaseController.entryOf(HOST));

        console.timeEnd('Server boot');
    })
);
