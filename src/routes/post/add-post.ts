import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import * as TokenService from "../../services/token-service"
import * as PostService from "../../services/post-service"

const headersSchema = z.object({
    authorization: z.string()
})

const bodySchema = z.object({
    text: z.string().min(1).max(2200).nullable(),
    files: z.string().array().nullable()
})

export async function addPost(request: FastifyRequest, reply: FastifyReply) {
    const { data: headers } = headersSchema.safeParse(request.headers)
    if (!headers) {
        return reply.send({ err: "no-token" })
    }

    const { data: body } = bodySchema.safeParse(request.body)
    if (!body || (!body.text && !body.files)) {
        return reply.send({ err: "bad-request" })
    }

    const token = headers.authorization.split(" ")[1]
    const id = TokenService.validateToken(token)
    if (!id) {
        return reply.send({ err: "unauthorized" })
    }

    const post = await PostService.addPost(id, body.text ?? undefined, body.files ?? [])
    reply.send({ post })
}