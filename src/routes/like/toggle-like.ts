import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import * as TokenService from "@/services/token-service"
import * as LikeService from "@/services/like-service"
import * as PostService from "@/services/post-service"
import * as ActivityService from "@/services/activity-service"

const headersSchema = z.object({
    authorization: z.string()
})

const paramsSchema = z.object({
    postId: z.string().cuid()
})

export async function toggleLike(request: FastifyRequest, reply: FastifyReply) {
    const { data: headers } = headersSchema.safeParse(request.headers)
    if (!headers) {
        return reply.send({ err: "no-token" })
    }

    const { data: params } = paramsSchema.safeParse(request.params)
    if (!params) {
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

    const post = await PostService.getPostById(params.postId)
    if (!post) {
        return reply.send({ err: "post-not-found" })
    }

    const like = await LikeService.toggleLike(id, params.postId)

    if (id != post.authorId) {
        await ActivityService.createOrDeleteActivity(
            post.authorId, 
            post.parentPostId ? "LIKE_REPLY" : "LIKE_POST",
            id,
            post.id
        )
    }

    reply.send({ like })
}