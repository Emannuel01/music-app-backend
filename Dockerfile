# backend/Dockerfile

FROM node:18

WORKDIR /usr/src/app

# CORREÇÃO: Copia AMBOS package.json e package-lock.json
COPY package*.json ./

# Agora o 'npm ci' encontrará o lockfile e funcionará corretamente
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]