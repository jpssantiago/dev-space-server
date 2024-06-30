import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import * as TokenService from "@/services/token-service"
import * as PostService from "@/services/post-service"
import * as CloudflareService from "@/services/cloudflare-service"

const headersSchema = z.object({
    authorization: z.string()
})

const bodySchema = z.object({
    text: z.string().max(2200).nullish(),
    files: z.string().array()
})

const BASE_URL = "https://bucket.devspace.joaosantiago.com.br"

export async function addPost(request: FastifyRequest, reply: FastifyReply) {
    const { data: headers } = headersSchema.safeParse(request.headers)
    if (!headers) {
        return reply.send({ err: "no-token" })
    }

    const { data: body } = bodySchema.safeParse(request.body)
    if (!body || (!body.text && body.files.length == 0)) {
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

    const files: string[] = []
    for (let file of body.files) {
        const key = await CloudflareService.uploadImageToBucket(id, file)
        files.push(`${BASE_URL}/${key}`)
    }

    const post = await PostService.addPost(id, body.text ?? undefined, files)
    reply.send({ post })
}