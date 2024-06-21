import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { usernameSchema, passwordSchema } from "../../schemas/auth-schemas"
import * as UserService from "../../services/user-service"
import * as HashService from "../../services/hash-service"
import * as TokenService from "../../services/token-service"
import { omit } from "../../lib/utils"

const bodySchema = z.object({
    username: usernameSchema,
    password: passwordSchema
})

export async function signIn(request: FastifyRequest, reply: FastifyReply) {
    const { data: body } = bodySchema.safeParse(request.body)
    if (!body) {
        return reply.send({ err: "bad-request" })
    }

    const user = await UserService.getUserByUsername(body.username)
    if (!user) {
        return reply.send({ err: "user-not-found" })
    }

    const match = await HashService.compare(body.password, user.password)
    if (!match) {
        return reply.send({ err: "unauthorized" })
    }

    const token = TokenService.createToken(user.id)
    reply.send({ token, user: omit(user, ["password"]) })
}