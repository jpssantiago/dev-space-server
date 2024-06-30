import jwt, { JwtPayload } from "jsonwebtoken"

import { env } from "@/env/env"

export function createToken(id: string): string {
    return jwt.sign({ id }, env.JWT_SECRET_KEY, { expiresIn: "7d" })
}

export function validateToken(token: string): string | undefined {
    const { id } = jwt.verify(token, env.JWT_SECRET_KEY) as JwtPayload
    return id
}