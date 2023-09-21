# Build Stage
FROM mysql

COPY provision.sql /docker-entrypoint-initdb.d/
COPY normal-db-setup.sql.sql /docker-entrypoint-initdb.d/
COPY analysis-db-setup.sql /docker-entrypoint-initdb.d/