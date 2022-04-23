FROM node:lts-slim

COPY . /opt/api
RUN cd /opt/api && npm install

WORKDIR /opt/api

EXPOSE 5000

CMD [ "npm", "run", "start" ]