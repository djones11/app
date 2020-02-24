
const AWS = require('aws-sdk'),
  JWT = require("jsonwebtoken"),
  secretsClient = new AWS.SecretsManager({
    region: process.env.AWS_REGION
  });

AWS.config.update({ region: process.env.AWS_REGION });

const getSecret = (secretId) => {
  return new Promise((resolve, reject) =>
    secretsClient.getSecretValue({ SecretId: secretId }, (err, data) => {
      let secret, decodedBinarySecret;

      if (err || data == null) {
        reject(err);
      } else {
        if ('SecretString' in data) {
          secret = data.SecretString;
        } else {
          let buff = new Buffer(data.SecretBinary, 'base64');
          decodedBinarySecret = buff.toString('ascii');
        }

        resolve(secret
          ? JSON.parse(secret)
          : JSON.parse(decodedBinarySecret));
      }
    })
  );
}

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const getUserId = async (token) => {
  let jwtSecret = await getSecret("jwt_secret");
  let decodedToken = await JWT.verify(token, jwtSecret["secret"]);

  return decodedToken["userId"];
}

const get = (token) => {
  return new Promise(async (resolve, reject) => {
    let userId = await getUserId(token);

    var params = {
      TableName: 'images',
      IndexName: 'user_id-id-index',
      KeyConditionExpression: "user_id = :userid",
      ExpressionAttributeValues: {
        ':userid': { N: userId.toString() }
      },
      ExpressionAttributeNames: {
        "#location": "location"
      },
      ProjectionExpression: "#location, id, uploaded"
    };

    ddb.query(params, function (err, data) {
      if (err) {
        reject(err)
      } else {

        // Formatting returned rows

        let results = data["Items"];

        for (let i = 0, len = results.length; i < len; i++) {
          let row = results[i];

          for (let property in row) {
            let value = row[property][Object.keys(row[property])[0]];

            row[property] = property == "location"
              ? `https://s3.eu-west-2.amazonaws.com/${value}`
              : value;
          }
        }

        resolve(results);
      }
    });
  });
};

module.exports = {
  get
}