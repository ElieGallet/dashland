FROM node:8

ENV TZ=Europe/Paris
ENV PRODUCTION_MODE=true

RUN apt-get update \
  && apt-get install -y libelf1 apt-transport-https \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json /app/
RUN npm install --silent

COPY . /app

CMD npm start

EXPOSE 3000
