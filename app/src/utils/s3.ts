import * as AWS from "aws-sdk";
import { uuidv4 } from ".";
import { S3 } from '../config';

let bucket: AWS.S3;

export const initializeS3 = () => {
  AWS.config.region = S3.region;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: S3.identityPoolId,
  });

  bucket = new AWS.S3();
};

export const sendToS3 = (blob: Blob): Promise<string> => {
  if (!blob) {
    return undefined;
  }
  if (bucket === undefined) {
    initializeS3();
  }
  return new Promise((resolve, reject) => {
    const fileId = uuidv4();

    const params = {
      Body: blob,
      Bucket: S3.bucket,
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
};

export const getFromS3 = (fileId: string): Promise<string> => {
  if (!fileId) {
    return undefined;
  }
  if (bucket === undefined) {
    initializeS3();
  }
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: S3.bucket,
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
};
