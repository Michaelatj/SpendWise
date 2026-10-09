#!/bin/sh
set -e

mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld /var/lib/mysql

if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "[SpendWise DB] Initializing MariaDB data directory..."
    mysql_install_db --user=mysql --datadir=/var/lib/mysql > /dev/null
fi

echo "[SpendWise DB] Starting MariaDB server on TCP port 3306..."
mysqld --user=mysql --datadir=/var/lib/mysql --port=3306 --bind-address=0.0.0.0 --skip-networking=0 &
PID=$!

# Wait for mysqld socket to be ready
echo "[SpendWise DB] Waiting for MariaDB socket..."
until mysqladmin ping --silent; do
    sleep 1
done

echo "[SpendWise DB] Configuring permissions and root user..."
mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS spendwise;
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'rootpassword';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

if [ -f "/docker-entrypoint-initdb.d/01-init.sql" ]; then
    echo "[SpendWise DB] Executing initialization SQL script..."
    mysql -u root spendwise < /docker-entrypoint-initdb.d/01-init.sql
fi

echo "✅ SpendWise MariaDB Database is up and running!"
wait $PID
