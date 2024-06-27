import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { usernameSchema } from "../../schemas/auth-schemas"
import * as UserService from "../../services/user-service"

const paramsSchema = z.object({
    username: usernameSchema
})

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
    const { data: params } = paramsSchema.safeParse(request.params)
    if (!params) {
        return reply.send({ err: "bad-request" })
    }

    const profile = await UserService.getUserProfile(params.username)
    if (!profile) {
        return reply.send({ err: "user-not-found" })
    }

    reply.send({ profile: {
        ...profile,
        followers: profile.followers.map(f => f.following),
        posts: profile.posts.map(post => {
            return {
                ...post,
                likes: post.likes.map(l => l.user)
            }
        })
    } })
}