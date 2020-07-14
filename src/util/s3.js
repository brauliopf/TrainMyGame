export const s3Config = ({
  bucketName: process.env.NODE_ENV === "production" ? process.env.REACT_APP_S3_BUCKET : process.env.REACT_APP_NICK_S3_BUCKET_DEV,
  bucketURL: `https://${process.env.NODE_ENV === "production" ? process.env.REACT_APP_S3_BUCKET : process.env.REACT_APP_NICK_S3_BUCKET_DEV}.s3.us-east-1.amazonaws.com`,
  region: 'us-east-1',
  accessKeyId: process.env.REACT_APP_NICK_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_NICK_AWS_SECRET_ACCESS_KEY
})