FROM node:16-alpine

WORKDIR /app

COPY . /app

COPY package.json package-lock.json ./

RUN npm install 

COPY . .

EXPOSE 8080

CMD npm start