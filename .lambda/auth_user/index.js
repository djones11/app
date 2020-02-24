const authUser = require("./auth_user");

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  let body = event["body"]
  let results = await authUser.auth(body["username"], body["password"]);

  const response = {
    statusCode: results.hasOwnProperty("error") ? 200 : 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(results)
  };

  callback(null, response);
};
