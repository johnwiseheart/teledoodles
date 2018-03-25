export const HTTP_PROTOCOL = process.env.NODE_ENV === "production" ? "https://" : "http://";

export const WS_PROTOCOL = process.env.NODE_ENV === "production" ? "wss://" : "ws://";

export const SERVER_URL =
  process.env.NODE_ENV === "production" ? "teledoodles.dynamic.jcaw.me" : "localhost:5000";

export namespace S3 {
  export const identityPoolId = "us-west-2:b3de8aaa-e4be-4f9c-b16a-bb5954f442ad";
  export const region = "us-west-2";
  export const bucket = "teledoodles";
}
