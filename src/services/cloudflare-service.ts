import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { createId } from "@paralleldrive/cuid2"

import { env } from "../env/env"

export const cloudflareBucketClient = new S3Client({
    region: "us-east-1",
    endpoint: env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
    }
})

export async function uploadImageToBucket(userId: string, base64: string): Promise<string> {
    const data = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    const type = base64.split(';')[0].split('/')[1]

    const key = `${userId}_${createId()}`

    const putObjectCommand = new PutObjectCommand({
        Bucket: "dev-space",
        Key: key,
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
        Body: data
    })

    await cloudflareBucketClient.send(putObjectCommand)

    return key
}

export async function deleteImageFromBucket(key: string): Promise<void> {
    const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: "dev-space",
        Key: key
    })

    await cloudflareBucketClient.send(deleteObjectCommand)
}