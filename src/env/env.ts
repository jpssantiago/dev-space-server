import { z } from "zod"

const envSchema = z.object({
    PORT: z.coerce.number(),
    JWT_SECRET_KEY: z.string(),
    BCRYPT_SALT_OR_ROUNDS: z.coerce.number()
})

export const env = envSchema.parse(process.env)