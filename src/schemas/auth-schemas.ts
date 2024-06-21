import { z } from "zod"

export const emailSchema = z.string().email()
export const usernameSchema = z.string().regex(/^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)
export const passwordSchema = z.string().min(8).max(50)