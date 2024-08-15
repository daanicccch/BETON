FROM node:alpine as build

COPY package.json package.json
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev && \
    if [ ! -e /usr/bin/python ]; then ln -s /usr/bin/python3 /usr/bin/python; fi
RUN npm install
COPY . .

CMD ["npm", "start"]