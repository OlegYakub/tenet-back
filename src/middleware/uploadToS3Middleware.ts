import { NextFunction, Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as uuid from 'uuid';


const awsRegion = 'eu-central-1'

const client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: 'AKIAUJWP27RWICZC2N5R',
    secretAccessKey: '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'
  }
});

interface File {
  data: string,
  name: string,
  size: number,
  mimetype: string,
}

const generateRandomFileName = (originalName: string) => {
  const extension = originalName.split('.').pop();
  return uuid.v4() + '.' + extension;
}

export const uploadToS3Middleware = async (req: Request, res: Response, next: NextFunction) => {
  const image = req.files.image as unknown as File;

  const fileName = generateRandomFileName(image.name)

  const fileToUpload = new PutObjectCommand({
    Key: `test-image/${fileName}`,
    Body: Buffer.from(image.data, 'binary'),
    // ContentType: 'application/pdf',
    Bucket: 'images-test-2'
  });
  try {
    const data = await client.send(fileToUpload);
    console.log('@@@data uploadToS3Middleware', data);
    req.body.uploadedFilePath = `https://images-test-2.s3.eu-central-1.amazonaws.com/test-image/${fileName}`
    // process data.
  } catch (error) {
    console.log('@@@error uploadToS3Middleware', error)
    // error handling.
  } finally {
    next();
  }
  // next();

}