const authToken = require("./auth_token");

exports.handler = async (event, context, callback) => {
  let token = event["authorizationToken"]

  try {
    await (authToken.auth(token));
    callback(null, authToken.generatePolicy("me", 'Allow', event.methodArn));
  } catch (error) {
    callback(null, authToken.generatePolicy("me", 'Deny', event.methodArn));
  }
}

