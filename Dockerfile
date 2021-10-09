FROM node:14

WORKDIR /var/node/fin-life-api

ENV TYPEORM_CONNECTION=postgres
ENV TYPEORM_DATABASE=fin_life
ENV TYPEORM_MIGRATIONS=dist/migrations/*.js
ENV TYPEORM_ENTITIES=dist/**/*.entity.js
ENV TYPEORM_MIGRATIONS_RUN=true
ENV TYPEORM_LOGGING=true

COPY . .

RUN yarn

CMD yarn start
