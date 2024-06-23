import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import * as TokenService from "../../services/token-service"
import * as UserService from "../../services/user-service"
import { omit } from "../../lib/utils"

const headersSchema = z.object({
    authorization: z.string()
})

export async function loadUser(request: FastifyRequest, reply: FastifyReply) {
    const { data: headers } = headersSchema.safeParse(request.headers)
    if (!headers) {
        return reply.send({ err: "no-token" })
    }

    const token = headers.authorization.split(" ")[1]
    if (token == "undefined") {
        return reply.send({ err: "no-token" })
    }

    const id = TokenService.validateToken(token)
    if (!id) {
        return reply.send({ err: "unauthorized" })
    }

    const user = await UserService.getUserById(id)
    if (!user) {
        return reply.send({ err: "user-not-found" })
    }

    reply.send({ user: {
        ...omit(user, ["password"]),
        followers: user.followers.map(f => f.following),
        following: user.following.map(f => f.followed)
    } })
}