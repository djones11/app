
const S3 = require("./node_modules/aws-sdk/clients/s3"),
  AWS = require('./node_modules/aws-sdk'),
  uniqid = require("uniqid"),
  mime = require("mime"),
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

const getUserId = async (token) => {
  let jwtSecret = await getSecret("jwt_secret");
  let decodedToken = await JWT.verify(token, jwtSecret["secret"]);

  return decodedToken["userId"];
}

const create = async (name, token) => {  
  userId = await getUserId(token)

  const contentType = mime.getType(name),
    s3 = new S3(),
    key = `${uniqid()}_${userId}_${name}`,
    params = {
      Expires: 60,
      Bucket: "app-dcj-images",
      Conditions: [["content-length-range", 100, 10000000]],
      Fields: {
        "Content-Type": contentType,
        key
      }
    };

  return new Promise(async (resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

module.exports = {
  create
}