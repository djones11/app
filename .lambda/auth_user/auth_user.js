const mysql = require("mysql"),
  JWT = require("jsonwebtoken"),
  AWS = require("aws-sdk"),
  Redis = require("ioredis"),
  region = process.env.AWS_REGION;

let pool;

const cache = new Redis({
  port: "6379",
  host: "cache-redis-001.qchuzv.0001.euw2.cache.amazonaws.com",
  db: 0
});
const parameterStore = new AWS.SSM();
const client = new AWS.SecretsManager({
  region: region
});

const getParam = param => {
  return new Promise((res, rej) => {
    parameterStore.getParameter({
      Name: param
    }, (err, data) => {
      if (err) return rej(err);
      return res(data["Parameter"]["Value"])
    })
  })
}

const makeQuery = (sql, params) => {
  return new Promise((resolve, reject) =>
    pool.getConnection((err, connection) => {
      if (err) reject(err);

      connection.query(sql, params, (error, results) => {
        connection.release();
        if (error) reject(error);

        resolve(results);
      });
    })
  );
}

const checkCredentials = async (username, password) => {
  let sql = `
    SELECT pk_id AS 'id'
    FROM users 
    WHERE username = ? AND password = PASSWORD(?)
  `;

  let results = await makeQuery(sql, [username, password]);

  return results.length > 0 && results[0]["id"]
}

const getSecret = (secretId) => {
  return new Promise((resolve, reject) =>
    client.getSecretValue({ SecretId: secretId }, (err, data) => {
      let secret, decodedBinarySecret;

      if (err) {
        reject(err);
      } else {
        if ('SecretString' in data) {
          secret = data.SecretString;
        } else {
          let buff = new Buffer(data.SecretBinary, 'base64');
          decodedBinarySecret = buff.toString('ascii');
        }
      }

      resolve(secret
        ? JSON.parse(secret)
        : JSON.parse(decodedBinarySecret));
    })
  );
}

const auth = async (username, password) => {

  // Get RDS access credentials

  return new Promise(async (resolve, reject) => {
    let jsonSecret = await getSecret("rds_details");

    // Establish connection to RDS

    pool = mysql.createPool({
      host: await getParam("rds_host_name"),
      user: jsonSecret["username"],
      password: jsonSecret["password"],
      database: await getParam("rds_table_name")
    });

    // Check if credentials match

    let userId = await checkCredentials(username, password)

    if (userId) {
      let jwtSecret = await getSecret("jwt_secret");

      // Create session and add to cache

      let token = JWT.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        userId
      }, jwtSecret["secret"]);

      await cache.set(userId, token, "EX", 60);

      resolve({
        status: "success",
        token
      })
    }
  });
}

module.exports = {
  auth
}