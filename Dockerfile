FROM node:16-slim

ARG NPM_TOKEN
USER root

RUN npm rm yarn -g
RUN npm i pnpm -g

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml /home/node/app/
RUN cat > .npmrc <<EOF
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
@ideamall:registry=https://npm.pkg.github.com
always-auth=true
EOF
RUN pnpm i --frozen-lockfile

COPY . /home/node/app
RUN pnpm build

RUN pnpm prune --prod || true \
    pnpm store prune

EXPOSE 8080
CMD ["npm", "start"]