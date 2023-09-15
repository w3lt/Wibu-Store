// database configs
const MYSQL_HOST = process.env.MYSQL_HOST;
exports.MYSQL_HOST = MYSQL_HOST;

const MYSQL_USER = process.env.MYSQL_USER;
exports.MYSQL_USER = MYSQL_USER;

const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
exports.MYSQL_PASSWORD = MYSQL_PASSWORD;

const db = process.env.MYSQL_DATABASE;
exports.db = db;

// const salt = "Be Giang ngok ngech dang iu";
const salt = "$2b$12$0tnZV/lCVvxWYv6KTYrVJe";
exports.salt = salt;

// port
const PORT = 12345;
exports.PORT = PORT;