FROM node:13-alpine

WORKDIR /usr/src/app

RUN npm i -g @nestjs/cli

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000 8000

RUN npm run build
# CMD [ "npm", "start" ]