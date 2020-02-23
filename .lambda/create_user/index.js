const createUser = require("./create_user");

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  let body = JSON.parse(event["body"])
  let results = await createUser.create(body["username"], body["password"]);

  const response = {
    statusCode: results["status"] == "success" ? 200 : 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(results)
  };

  callback(null, response);
};
