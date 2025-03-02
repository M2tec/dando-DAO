FROM node:18-alpine AS vite-build

RUN apk add --no-cache  python3 \
                        py3-pip \
                        py3-pkgconfig \
                        pixman \
                        pixman-dev \
                        cairo \
                        cairo-dev \
                        pango-dev \
                        make \
                        g++ \
                        nginx

RUN mkdir /dando
WORKDIR /dando

COPY ./package*.json ./
COPY ./vite.config.js ./
COPY ./index.html ./
COPY ./src ./src
COPY ./public ./public
COPY ./.env.production ./

RUN npm install
RUN npm run build             

FROM nginx:stable-alpine AS server

RUN apk add --no-cache  python3 py3-requests nano

RUN mkdir /scripts
COPY --from=vite-build /dando/dist /usr/share/nginx/html
COPY ./database/install-schema.py /scripts
COPY ./database/dno-schema.graphql /scripts

# ENTRYPOINT ["tail"]
# CMD ["-f","/dev/null"]