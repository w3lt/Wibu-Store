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

function toBuffer(arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength); // Use byteLength instead of length
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }

    return buffer;
}

function saveImage(arrayBuffer, path) {
    try {
        fs.writeFileSync(path, toBuffer(arrayBuffer));
        return true;
    } catch (error) {
        throw error;
    }
}
exports.saveImage = saveImage;

function fetchRealIMGPath(tmpPath) {
    const ImgPath = `${__dirname}/assets/${tmpPath}`;
    return ImgPath;
}

function convertPath2IMG(path) {
    return base64Encode(fetchRealIMGPath(path));
}
exports.convertPath2IMG = convertPath2IMG;