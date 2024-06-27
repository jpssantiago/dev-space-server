import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { emailSchema, usernameSchema, passwordSchema, } from "../../schemas/auth-schemas"
import * as HashService from "../../services/hash-service"
import * as UserService from "../../services/user-service"
import * as TokenService from "../../services/token-service"

const bodySchema = z.object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    name: z.string().min(1).max(50)
})

export async function signUp(request: FastifyRequest, reply: FastifyReply) {
    const { data: body } = bodySchema.safeParse(request.body)
    if (!body) {
        return reply.send({ err: "bad-request" })
    }

    const hash = await HashService.createHash(body.password)
    if (!hash) {
        return reply.send({ err: "password-not-hashed" })
    }

    const user = await UserService.createUser(body.email, body.username, hash, body.name)
    if (!user) {
        return reply.send({ err: "unique-error" })
    }

    const token = TokenService.createToken(user.id)

    reply.send({ token })
}