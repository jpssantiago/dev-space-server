import { z } from "zod"

const envSchema = z.object({
    PORT: z.coerce.number(),
    JWT_SECRET_KEY: z.string(),
    BCRYPT_SALT_OR_ROUNDS: z.coerce.number(),
    CLOUDFLARE_R2_ENDPOINT: z.string(),
    CLOUDFLARE_R2_ACCESS_KEY_ID: z.string(),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string()
})

export const env = envSchema.parse(process.env)