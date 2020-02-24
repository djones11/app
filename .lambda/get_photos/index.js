const getPhotos = require("./get_photos");

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  let token = event.headers.hasOwnProperty("authorization")
    ? event.headers["authorization"]
    : event.headers["Authorization"];

  const results = await getPhotos.get(token);
  const response = {
    statusCode: !results.hasOwnProperty("error") ? 200 : 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(results)
  };
  
  callback(null, response);
};
