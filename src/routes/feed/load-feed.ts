import { FastifyReply, FastifyRequest } from "fastify"

import * as PostService from "../../services/post-service"

export async function loadFeed(_: FastifyRequest, reply: FastifyReply) {
    const posts = await PostService.getAllPosts()
    reply.send({
        feed: posts?.map(post => {
            return {
                ...post,
                likes: post.likes.map(l => l.user),
                author: {
                    ...post.author,
                    followers: post.author.followers.map(f => {
                        return {
                            id: f.followingId
                        }
                    })
                }
            }
        })
    })
}