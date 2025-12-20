FROM node:24.6-slim AS diffstore

WORKDIR /server/shared/diff-store
COPY server/shared/diff-store/. ./
RUN npm install
RUN npm run build

FROM node:24.6-slim AS frontend

WORKDIR /server
COPY server/. ./
COPY --from=diffstore /server/shared/diff-store/dist ./shared/diff-store/dist
COPY --from=diffstore /server/shared/diff-store/package.json ./shared/diff-store/package.json
RUN npm install

WORKDIR /server/frontend
RUN npm run build

FROM node:24.6-slim AS backend

WORKDIR /server
COPY server/. ./
COPY --from=diffstore /server/shared/diff-store/dist ./shared/diff-store/dist
COPY --from=diffstore /server/shared/diff-store/package.json ./shared/diff-store/package.json

RUN npm install

WORKDIR /server/backend
RUN npm install
RUN npm run build

FROM dhi.io/node:20-alpine3.22 AS runtime

WORKDIR /server/backend
COPY --from=frontend /server/frontend/dist/. ./public/.
COPY --from=backend /server/backend/dist/. ./dist/.
COPY --from=backend /server/backend/package.json ./

WORKDIR /server
COPY --from=backend /server/shared/diff-store/dist/. ./shared/diff-store/dist/.
COPY --from=backend /server/package*.json ./
COPY --from=backend /server/node_modules ./node_modules
COPY --from=diffstore /server/shared/diff-store/dist ./shared/diff-store/dist
COPY --from=diffstore /server/shared/diff-store/package.json ./shared/diff-store/package.json

WORKDIR /server/backend

ENV NODE_ENV=production
ENV SECRET=secret
ENV CRAFTING_SECRET=crafting

EXPOSE 80

CMD ["dist/index.js"]
