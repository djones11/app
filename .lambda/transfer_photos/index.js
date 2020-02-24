const transferPhotos = require("./transfer_photos");

exports.handler = (event) => {
  let handledRecords = [];
  for (const { messageId, body } of event.Records) {

    // Preventing duplicates being handled

    if (handledRecords.indexOf(messageId == -1)) {
      let _body = JSON.parse(body);

      for (let i = 0, len = _body["Records"].length; i < len; i++) {
        let s3 = _body["Records"][i]["s3"],
          bucket = s3["bucket"]["name"],
          key = s3["object"]["key"],
          time = _body["Records"][i]["eventTime"];

        transferPhotos.transfer(bucket, key, time);
      }
    }
  }

  return `Successfully processed ${event.Records.length} messages.`;
};
