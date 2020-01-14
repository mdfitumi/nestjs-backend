FROM node:13-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g @nestjs/cli

RUN npm ci --only=production

COPY . .

EXPOSE 3000 8000

RUN npm run build
# CMD [ "npm", "start" ]