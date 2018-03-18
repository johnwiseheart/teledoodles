import * as AWS from 'aws-sdk';
import { uuidv4 } from '.';

let bucket: AWS.S3;


export const initializeS3 = () => {
    AWS.config.region = 'us-west-2';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-west-2:b3de8aaa-e4be-4f9c-b16a-bb5954f442ad'
    });

    bucket = new AWS.S3();
}

export const sendToS3 = (blob: Blob): Promise<string> => {
  if (!blob) { return undefined; };
  return new Promise((resolve, reject) => {
    const fileId = uuidv4();

    const params = {
      Body: blob,
      Bucket: 'teledoodles',
      ContentType: "img/png",
      Key: `doodle/${fileId}.png`,
    };

    bucket.putObject(params, (err, data) => {
      if (err) {
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
    const params = {
      Bucket: 'teledoodles',
      Key: `doodle/${fileId}.png`,
    };

    bucket.getSignedUrl("getObject", params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}