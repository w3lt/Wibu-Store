var mysql = require('mysql');
var configs = require('./configs');

var pool = mysql.createPool({
    connectionLimit: 10,
    database: configs.db,
    host: configs.MYSQL_HOST,
    user: configs.MYSQL_USER,
    password: configs.MYSQL_PASSWORD,
    port: 3306,
});
exports.sqlPool = pool;

async function execQuery(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        })
    })
}
exports.execQuery = execQuery;

async function execGetQuery(tableName, getField, condition) {
    const query = `SELECT ${getField} FROM ${tableName} WHERE ${condition}`;
    try {
        const result = await execQuery(query);
        return result;
    } catch (error) {
        throw error;
    }
}
exports.execGetQuery = execGetQuery;

async function execSetQuery(tableName, setStatement, condition) {
    const query = `UPDATE ${tableName} SET ${setStatement} WHERE ${condition}`;
    try {
        const result = await execQuery(query);
        return result;
    } catch (error) {
        throw error;
    }
};
exports.execSetQuery = execSetQuery;

async function generateNewUID() {
    try {
        const query = `SELECT MAX(uid) as last_uid FROM users`;
        const result = await execQuery(query);
        const last_uid = result[0].last_uid;
        if (last_uid === null) {
            return 100000000;
        } else {
            return last_uid + 1;
        }
    } catch (error) {
        throw error;
    }
}
exports.generateNewUID = generateNewUID;

function dateToDatetime(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}
exports.dateToDatetime = dateToDatetime;