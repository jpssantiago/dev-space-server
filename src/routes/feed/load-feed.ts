import { FastifyReply, FastifyRequest } from "fastify"

import * as PostService from "../../services/post-service"

export async function loadFeed(_: FastifyRequest, reply: FastifyReply) {
    const posts = await PostService.getAllPosts()
    reply.send({ feed: posts })
}