import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { usernameSchema } from "../../schemas/auth-schemas"
import * as TokenService from "../../services/token-service"
import * as UserService from "../../services/user-service"

const headersSchema = z.object({
    authorization: z.string()
})

const bodySchema = z.object({
    username: usernameSchema,
    name: z.string().trim().min(1).max(50),
    description: z.string().trim().max(150).nullable(),
    avatar: z.string().nullable()
})

export async function editUser(request: FastifyRequest, reply: FastifyReply) {
    const { data: headers } = headersSchema.safeParse(request.headers)
    if (!headers) {
        return reply.send({ err: "no-token" })
    }

    const { data: body } = bodySchema.safeParse(request.body)
    if (!body) {
        return reply.send({ err: "bad-request" })
    }

    const token = headers.authorization.split(" ")[1]
    if (token == "undefined") {
        return reply.send({ err: "no-token" })
    }
    
    const id = TokenService.validateToken(token)
    if (!id) {
        return reply.send({ err: "unauthorized" })
    }

    const user = await UserService.getUserProfile(body.username)
    if (user && user.id != id) {
        return reply.send({ err: "username-in-use" })
    }

    const newUser = await UserService.editUser(
        id,
        body.username,
        body.name,
        body.description, 
        body.avatar
    )

    reply.send({ user: newUser })
}