
const AWS = require('aws-sdk'),
  uniqid = require("uniqid");

AWS.config.update({ region: process.env.AWS_REGION });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const transfer = (bucket, key, time) => {
  let userId = key.split("_")[1];
  var params = {
    TableName: 'images',
    Item: {
      id: { S: uniqid() },
      user_id: { N: parseInt(userId).toString() },
      location: { S: `${bucket}/${key}` },
      uploaded: { N: new Date(time).getTime().toString() }
    }
  };

  ddb.putItem(params, (err, data) => {
    if (err) {
      console.log("Error", err);
      throw err
    } else {
      console.log("Success", data);
      return data;
    }
  });
};

module.exports = {
  transfer
}