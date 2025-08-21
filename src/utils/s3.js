const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  }
});

async function getPresignedUpload(key, contentType) {
  const cmd = new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: contentType });
  return await getSignedUrl(s3, cmd, { expiresIn: 60 * 15 });
}

async function getPresignedDownload(key) {
  const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key });
  return await getSignedUrl(s3, cmd, { expiresIn: 60 * 60 });
}

async function deleteObject(key) {
  const cmd = new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key });
  return await s3.send(cmd);
}

module.exports = { s3, getPresignedUpload, getPresignedDownload, deleteObject };
