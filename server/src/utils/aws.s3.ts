import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID || ""
  }
});

interface CloudImageUploadFile {
  filename: string;
  toBuffer: () => Promise<Buffer>;
  mimetype: string;
}


export default async function cloudImageUpload(file: CloudImageUploadFile) {
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.filename,
    Body: await file.toBuffer(),
    ContentType: file.mimetype,
  });

  const result = await s3.send(putObjectCommand);

  if (result) {
    return { ok: true}
  }

  return { ok: false}
}