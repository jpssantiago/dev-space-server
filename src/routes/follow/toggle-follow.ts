import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import * as TokenService from "../../services/token-service"
import * as FollowService from "../../services/follow-service"

const headersSchema = z.object({
    authorization: z.string()
})

const paramsSchema = z.object({
    followedId: z.string().cuid()
})

export async function toggleFollow(request: FastifyRequest, reply: FastifyReply) {
    const { data: headers } = headersSchema.safeParse(request.headers)
    if (!headers) {
        return reply.send({ err: "no-token" })
    }

    const { data: params } = paramsSchema.safeParse(request.params)
    if (!params) {
        return reply.send({ err: "bad-request" })
    }

    const token = headers.authorization.split(" ")[1]
    const id = TokenService.validateToken(token)
    if (!id) {
        return reply.send({ err: "unauthorized" })
    }

    const follow = await FollowService.toggleFollow(id, params.followedId)
    reply.send({ follow })
}