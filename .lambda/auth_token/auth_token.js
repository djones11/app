
const AWS = require('aws-sdk'),
  JWT = require("jsonwebtoken"),
  secretsClient = new AWS.SecretsManager({
    region: process.env.AWS_REGION
  });

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

const generatePolicy = (principalId, effect, resource) => {
  let authResponse = {};

  authResponse.principalId = principalId;

  if (effect && resource) {
    let policyDocument = {};

    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];

    let statementOne = {};

    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;

    policyDocument.Statement[0] = statementOne;

    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}

const auth = async (token) => {
  return new Promise(async (resolve, reject) => {
    let jwtSecret = await getSecret("jwt_secret");

    try {
      let result = await JWT.verify(token, jwtSecret["secret"])
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  auth,
  generatePolicy
}