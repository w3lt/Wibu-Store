const PORT = 80;

const db = process.env.MYSQL_DATABASE;
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;

export { PORT, db, MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD };