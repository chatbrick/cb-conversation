FROM alpine:3.4

LABEL authors="KYEWON SEO <k@bluehack.net>"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk add --update nodejs bash git

COPY package.json /usr/src/app/
RUN npm install
#RUN npm install cb-conversation -g

COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "run", "start" ]
