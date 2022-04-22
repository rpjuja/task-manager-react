FROM postgres:alpine

COPY ./init-db.sql /docker-entrypoint-initdb.d

WORKDIR /docker-entrypoint-initdb.d
