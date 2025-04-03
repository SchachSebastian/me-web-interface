FROM node:20-alpine AS fbuilder

WORKDIR /server
COPY server/package*.json ./
COPY server/frontend/package*.json frontend/.
COPY server/shared/diff-store/. shared/diff-store/.
RUN npm install

COPY server/frontend/src/. frontend/src/.
COPY server/frontend/public/. frontend/public/.
COPY server/frontend/index.html frontend/.
COPY server/frontend/vite.config.ts frontend/.
COPY server/frontend/tailwind.config.js frontend/.
COPY server/frontend/postcss.config.js frontend/.

WORKDIR /server/frontend
RUN npm run build

FROM node:20-alpine AS bbuilder

WORKDIR /server
COPY server/package*.json ./
COPY server/backend/package*.json backend/.
COPY server/backend/tsconfig.json backend/.
COPY server/shared/diff-store/. shared/diff-store/.
COPY server/backend/src/. backend/src/.

RUN npm install

WORKDIR /server/shared/diff-store
RUN npm run build

WORKDIR /server/backend
RUN npm install
RUN npm run build

FROM node:20-alpine

WORKDIR /server/backend
COPY --from=fbuilder /server/frontend/dist/. ./public/.
COPY --from=bbuilder /server/backend/dist/. ./dist/.
COPY --from=bbuilder /server/backend/package.json ./

WORKDIR /server
COPY --from=bbuilder /server/shared/diff-store/dist/. ./shared/diff-store/src/.
COPY --from=bbuilder /server/package*.json ./

RUN npm install

WORKDIR /server/backend

ENV NODE_ENV=production

EXPOSE 80

CMD ["node", "dist/index.js"]
