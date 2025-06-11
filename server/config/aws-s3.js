import aws from "aws-sdk";
import 'dotenv/config';

// Setting up AWS S3 Bucket
export const s3 = new aws.S3({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});