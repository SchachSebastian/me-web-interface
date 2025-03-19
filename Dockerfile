FROM node:20-alpine AS fbuilder

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/. ./
RUN npm run build

FROM node:20-alpine AS bbuilder
WORKDIR /backend

COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/src/. src/.

RUN npm install

RUN npm run build


FROM node:20-alpine

COPY --from=fbuilder frontend/dist ./public
COPY --from=bbuilder backend/dist ./dist
COPY --from=bbuilder /backend/node_modules ./node_modules
COPY --from=bbuilder /backend/package.json ./package.json

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
