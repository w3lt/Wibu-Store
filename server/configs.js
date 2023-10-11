// database information
const MYSQL_HOST = process.env.MYSQL_HOST;
exports.MYSQL_HOST = MYSQL_HOST;

const MYSQL_USER = process.env.MYSQL_USER;
exports.MYSQL_USER = MYSQL_USER;

const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
exports.MYSQL_PASSWORD = MYSQL_PASSWORD;

const db = process.env.MYSQL_DATABASE;
exports.db = db;

// const salt = "Be Giang ngok ngech dang iu";
const salt = "$2b$12$ecb5PVKSHjl722fe1Wsm7e";
exports.salt = salt;

// data-analysis-server information
const DATA_ANALYSIS_SERVER = process.env.DATA_ANALYSIS_SERVER || "data-analysis-server";
exports.DATA_ANALYSIS_SERVER = DATA_ANALYSIS_SERVER;

const DATA_ANALYSIS_SERVER_PORT = process.env.DATA_ANALYSIS_SERVER_PORT || 80;
exports.DATA_ANALYSIS_SERVER_PORT = DATA_ANALYSIS_SERVER_PORT;

// port
const PORT = 12345;
exports.PORT = PORT;

const cacheURL = "redis"
exports.cacheURL = cacheURL;