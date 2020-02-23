const mysql = require('mysql'),
  AWS = require('aws-sdk'),
  region = process.env.AWS_REGION,
  secretName = process.env.RDS_SECRET_NAME;

let secret, decodedBinarySecret;
let pool;

const client = new AWS.SecretsManager({
  region: region
});

const checkUsername = (username) => {
  let sql = `
    SELECT COUNT(*) AS "users"
    FROM users 
    WHERE username = ?
  `;

  return new Promise((_resolve, _reject) => 
    pool.getConnection((err, connection) => {
      if (err) _reject(err);

      connection.query(sql, [username], (error, results, fields) => {
        connection.release();
        if (error) _reject(error);

        _resolve(results["users"] == 0);
      });
    })
  );
}

const createNewUser = (username, password) => {
  let sql = `
    INSERT INTO users
      (username, password)
    VALUES
      (?, PASSWORD(?))
  `;

  return new Promise((_resolve, _reject) => 
    pool.getConnection((err, connection) => {
      if (err) _reject(err);

      connection.query(sql, [username, password], (error, results, fields) => {
        connection.release();
        if (error) _reject(error);

        _resolve({
          status: "success",
          id: results.insertId
        });
      });
    })
  );
}

const create = (username, password) => {

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
        host: process.env.HOST,
        user: jsonSecret["username"],
        password: jsonSecret["password"],
        database: process.env.TABLE
      });

      // Check if username is taken

      if(await checkUsername(username)) {
        resolve(await createNewUser(username, password));        
      } else {
        resolve({
          status: "taken"
        })
      }
    })
  )
}

module.exports = {
  create
}