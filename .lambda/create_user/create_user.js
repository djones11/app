const mysql = require('mysql'),
  AWS   = require('aws-sdk'),
  region = process.env.AWS_REGION,
  secretName = process.env.RDS_SECRET_NAME;
  
let secret, decodedBinarySecret;

const client = new AWS.SecretsManager({
    region: region
});

const database = {
  open: () => {
    const params = {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASS,
      database: process.env.TABL,
      multipleStatements: true,
      port: 3306,
    };

    return new Promise((resolve, reject) => {
      database.connection = mysql.createConnection(params);

      console.log('Creating connection with database');

      database.connection.connect((err) => {
        if (err) {
          console.log('Connection with database failed', err.stack);

          reject(err.stack);
          return;
        }

        console.log('Connection with database was successful');

        resolve(database.connection);
      });
    });
  },
  close: (connection) => {
    return new Promise((resolve, reject) => {
      console.log('Terminating connection with database');

      connection.end((err) => {
        if (err) {
          console.log(
            'Failed to terminate connection with database',
            err.stack
          );

          reject(err.stack);
          return;
        }

        console.log('Connection with database is terminated');
        resolve('Connection with database is terminated');
      });
    });
  }
};

const create = () => {
  console.log(process);
  console.log(secretName)
  client.getSecretValue({SecretId: secretName}, (err, data) => {
    if (err) {
        console.log(err);
        if (err.code === 'DecryptionFailureException')
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            throw err;
        else if (err.code === 'InvalidParameterException')
            throw err;
        else if (err.code === 'InvalidRequestException')
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            throw err;
    }
    else {
      console.log(data)
        if ('SecretString' in data) {
            secret = data.SecretString;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }
  
    console.log(client);
    console.log(secret);
    console.log(decodedBinarySecret);
  });
}

module.exports = {
  create
}