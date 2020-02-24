const getPresignedUrl = require("./get_presigned_url");

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  let token = event.headers.hasOwnProperty("authorization")
    ? event.headers["authorization"]
    : event.headers["Authorization"];
  let body = JSON.parse(event.body);
  
  const results = await getPresignedUrl.create(body["filename"], token);
  const response = {
    statusCode: !results.hasOwnProperty("error") ? 200 : 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(results)
  };
  
  callback(null, response);
};
