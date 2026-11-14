FROM oven/bun:1.4.4 AS build
WORKDIR /usr/src/app

COPY core core
COPY testbed testbed
COPY tool tool

COPY package.json bun.lock tsconfig.base.json ./
RUN bun install --frozen-lockfile --production

ENV NODE_ENV=production
RUN bun build --compile ./tool/index.ts --outfile figur

FROM eagleoutice/r-run-script:3.4.1
WORKDIR /app
COPY --from=build /usr/src/app/figur ./figur

ENTRYPOINT [ "./figur" ]