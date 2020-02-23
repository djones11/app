const mysql = require('mysql'),
  AWS = require('aws-sdk'),
  region = process.env.AWS_REGION;

let secret, decodedBinarySecret;
let pool;

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

const create = async (username, password) => {  
  let secretName = await getParam("rds_access_key_name");

  // Get RDS access credentials

  return new Promise((resolve, reject) => 
    client.getSecretValue({ SecretId: secretName }, async (err, data) => {
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

      let jsonSecret = secret 
        ? JSON.parse(secret)
        : JSON.parse(decodedBinarySecret)

      // Establish connection to RDS

      pool = mysql.createPool({
        host: await getParam("rds_host_name"),
        user: jsonSecret["username"],
        password: jsonSecret["password"],
        database: await getParam("rds_table_name")
      });

      // Check if username is taken

      if(await checkUsername(username)) {
        console.log(username, password)
        
        resolve(await createNewUser(username, password));        
      } else {
        resolve({
          status: "failed",
          error: 100,
          description: "USERNAME TAKEN"
        })
      }
    })
  )
}

module.exports = {
  create
}