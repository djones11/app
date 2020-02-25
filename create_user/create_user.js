const mysql = require('mysql'),
  AWS = require('aws-sdk'),
  parameterStore = new AWS.SSM(),
  secretsClient = new AWS.SecretsManager({
    region: process.env.AWS_REGION
  });

let pool;

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

const checkUsername = async (username) => {
  let sql = `
    SELECT COUNT(*) AS "users"
    FROM users 
    WHERE username = ?
  `;

  let results = await makeQuery(sql, [username]);

  return results[0]["users"] == 0
}

const createNewUser = async (username, password) => {
  let sql = `
    INSERT INTO users
      (username, password)
    VALUES
      (?, PASSWORD(?))
  `;

  let results = await makeQuery(sql, [username, password]);

  return results.insertId
    ? {
      status: "success",
    }
    : {
      status: "failed"
    }
}

const getSecret = (secretId) => {
  return new Promise((resolve, reject) =>
    secretsClient.getSecretValue({ SecretId: secretId }, (err, data) => {
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

const create = (username, password) => {

  // Get RDS access credentials

  return new Promise(async (resolve, reject) => {
    let jsonSecret = await getSecret("rds_details")

    // Establish connection to RDS

    pool = mysql.createPool({
      host: await getParam("rds_host_name"),
      user: jsonSecret["username"],
      password: jsonSecret["password"],
      database: await getParam("rds_table_name")
    });

    // Check if username is taken

    if (await checkUsername(username)) {
      resolve(await createNewUser(username, password));
    } else {
      resolve({
        status: "failed",
        error: 100,
        description: "USERNAME TAKEN"
      })
    }
  });
}

module.exports = {
  create
}