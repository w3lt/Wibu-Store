const mysql = require('mysql');
const configs = require('./configs');
const fs = require('fs');
const { createClient } = require('redis');

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

// async function getDataFromCache(key) {
//     try {
//         const client = await createClient({
//             url: "redis://redis:6379"
//         })
//             .on('error', err => {
//             console.error('Redis Client Error', err);
//             client.quit(); // Close the client on error
//         })
//             .connect();

//         const data = await client.lRange(key, 0, -1);
//         await client.quit(); // Properly disconnect the client after getting the data

//         return data;
//     } catch (error) {
//         throw error; // Re-throw the error for further handling
//     }
// }
// exports.getDataFromCache = getDataFromCache;

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

function strToJSON(str) {
    return JSON.parse(str.replace(/'/g, '"'));
}
exports.strToJSON = strToJSON;

// function to encode file data to base64 encoded string
function base64Encode(file) {
    try {
        // read binary data
        var bitmap = fs.readFileSync(file);

        // convert binary data to base64 encoded string
        return new Buffer.from(bitmap).toString('base64');
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        } else {
            throw error;
        }
    }
}

function fetchRealIMGPath(tmpPath) {
    const ImgPath = `${__dirname}/assets/${tmpPath}`;
    return ImgPath;
}

function convertPath2IMG(path) {
    return base64Encode(fetchRealIMGPath(path));
}
exports.convertPath2IMG = convertPath2IMG;