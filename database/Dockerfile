FROM mysql:8.0

# Skema dan data awal dieksekusi otomatis saat volume masih kosong
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql

EXPOSE 3306