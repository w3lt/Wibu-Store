# Build Stage
FROM mysql

COPY provision.sql /docker-entrypoint-initdb.d/
COPY dbSetup.sql /docker-entrypoint-initdb.d/