import bcrypt from "bcrypt"

import { env } from "../env/env"

export async function createHash(password: string): Promise<string | undefined> {
    try {
        return await bcrypt.hash(password, env.BCRYPT_SALT_OR_ROUNDS)
    } catch {}
}

export async function compare(password: string, hash: string): Promise<boolean | undefined> {
    try {
        return await bcrypt.compare(password, hash)
    } catch {}
}