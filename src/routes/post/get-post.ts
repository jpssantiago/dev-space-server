import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import * as PostService from "../../services/post-service"

const paramsSchema = z.object({
    postId: z.string().cuid()
})

export async function getPost(request: FastifyRequest, reply: FastifyReply) {
    const { data: params } = paramsSchema.safeParse(request.params)
    if (!params) {
        return reply.send({ err: "bad-request" })
    }

    const post = await PostService.getPostById(params.postId)
    if (!post) {
        return reply.send({ err: "post-not-found" })
    }

    reply.send({ post: {
        ...post,
        likes: post.likes.map(l => l.user),
        replies: post.replies.map(reply => {
            return {
                ...reply,
                likes: reply.likes.map(l => l.user)
            }
        })
    } })
}