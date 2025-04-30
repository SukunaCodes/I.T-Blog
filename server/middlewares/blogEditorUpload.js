import {nanoid} from "nanoid";
import {s3} from "../config/aws-s3.js";


export const generateUploadURL = async () => {
    const date = new Date();
    const imgName = `${nanoid()}-${date.getTime()}.jpeg`; // Generate image filename with nanoid+timestamp

    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'pern-blog',
        Key: imgName,
        Expires: 1000,
        ContentType: "image/jpeg"
    })

}