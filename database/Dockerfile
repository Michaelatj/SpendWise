FROM alpine:3.19

RUN apk add --no-cache mariadb mariadb-client

# Allow remote container network connections
RUN sed -i 's/skip-networking/#skip-networking/g' /etc/my.cnf.d/mariadb-server.cnf 2>/dev/null || true && \
    sed -i 's/127.0.0.1/0.0.0.0/g' /etc/my.cnf.d/mariadb-server.cnf 2>/dev/null || true

WORKDIR /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3306

ENTRYPOINT ["/entrypoint.sh"]
