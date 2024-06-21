import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import * as TokenService from "../../services/token-service"
import * as PostService from "../../services/post-service"

const headersSchema = z.object({
    authorization: z.string()
})

const paramsSchema = z.object({
    postId: z.string().cuid()
})

export async function deletePost(request: FastifyRequest, reply: FastifyReply) {
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

    const post = await PostService.getPostById(params.postId)
    if (!post) {
        return reply.send({ err: "post-not-found" })
    }

    if (post.authorId != id) {
        return reply.send({ err: "unauthorized" })
    }

    const deleted = await PostService.deletePost(post.id)
    reply.send({ deleted: !!deleted })
}