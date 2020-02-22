const createUser = require("./create_user");

exports.handler = async (event, context, callback) => {
    console.log(event);
    await createUser.create();
    
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", 
      },
      body: JSON.stringify({ "message": "Hello World!" })
    };

    callback(null, response);
};
