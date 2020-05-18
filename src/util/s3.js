export const config = (process.env.NODE_ENV === "production" ?
  ({
    bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
    region: 'us-east-2',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }) :
  ({
    bucketName: process.env.REACT_APP_S3_BUCKET_NAME_DEV,
    region: 'us-east-2',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  })
)