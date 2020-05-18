export const config = ({
  bucketName: process.env.NODE_ENV === "production" ? process.env.REACT_APP_S3_BUCKET : process.env.REACT_APP_S3_BUCKET_DEV,
  region: 'us-east-2',
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
})