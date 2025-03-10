FROM node:18-alpine AS vite-build

RUN apk add --no-cache  git 

RUN git clone https://github.com/M2tec/graphiql-playground.git
WORKDIR /graphiql-playground

RUN npm install
RUN npm run build             

FROM nginx:stable-alpine AS server

RUN apk add --no-cache nano

RUN mkdir /scripts
COPY --from=vite-build /graphiql-playground/dist /usr/share/nginx/html

### Debugging only
# ENTRYPOINT ["tail"]
# CMD ["-f","/dev/null"]