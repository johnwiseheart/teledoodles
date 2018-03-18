import * as AWS from 'aws-sdk';

export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    // tslint:disable-next-line
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getPlayerInfo = () => {
  const playerInfo = localStorage.getItem("player");
  return playerInfo != null ? JSON.parse(playerInfo) : null;
};


export const sendToS3 = (blob: Blob): Promise<string> => {
  if (!blob) { return undefined; };
  return new Promise((resolve, reject) => {
    AWS.config.region = 'us-west-2';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-west-2:b3de8aaa-e4be-4f9c-b16a-bb5954f442ad'
    });

    var bucket = new AWS.S3();
    const fileId = uuidv4();

    var params = {
      Bucket: 'teledoodles',
      Key: `doodle/${fileId}.png`,
      ContentType: "img/png",
      Body: blob,
    };

    bucket.putObject(params, function (err, data) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(fileId);
      }
    });
  });
}

export const getFromS3 = (fileId: string): Promise<string> => {
  if (!fileId) { return undefined; };
  return new Promise((resolve, reject) => {
    AWS.config.region = 'us-west-2';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-west-2:b3de8aaa-e4be-4f9c-b16a-bb5954f442ad'
    });

    var bucket = new AWS.S3();

    var params = {
      Bucket: 'teledoodles',
      Key: `doodle/${fileId}.png`,
    };

    bucket.getSignedUrl("getObject", params, (err, data) => {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}