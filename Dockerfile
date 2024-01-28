FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base as client-build
RUN mkdir -p /temp/client
COPY client /temp/client
RUN cd /temp/client && bun install --frozen-lockfile
RUN cd /temp/client && bun run build

FROM base as server-install
RUN mkdir -p /temp/server
COPY package.json bun.lockb /temp/server/
RUN cd /temp/server && bun install --frozen-lockfile --production

FROM base as release
COPY --from=client-build /temp/client/build public
COPY --from=server-install /temp/server/node_modules node_modules
COPY backend .

EXPOSE 3000/tcp
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENTRYPOINT ["bun", "run", "./index.ts"]
