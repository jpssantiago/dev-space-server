import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import * as TokenService from "../../services/token-service"
import * as PostService from "../../services/post-service"
import * as CloudflareService from "../../services/cloudflare-service"

const headersSchema = z.object({
    authorization: z.string()
})

const paramsSchema = z.object({
    postId: z.string().cuid()
})

const bodySchema = z.object({
    text: z.string().min(1).max(2200).nullable(),
    files: z.string().array()
})

const BASE_URL = "https://bucket.devspace.joaosantiago.com.br"

export async function addReply(request: FastifyRequest, response: FastifyReply) {
    const { data: headers } = headersSchema.safeParse(request.headers)
    if (!headers) {
        return response.send({ err: "no-token" })
    }

    const { data: params } = paramsSchema.safeParse(request.params)
    const { data: body } = bodySchema.safeParse(request.body)
    if (!params || !body || (!body.text && !body.files)) {
        return response.send({ err: "bad-request" })
    }

    const token = headers.authorization.split(" ")[1]
    if (token == "undefined") {
        return response.send({ err: "no-token" })
    }

    const id = TokenService.validateToken(token)
    if (!id) {
        return response.send({ err: "unauthorized" })
    }

    const files: string[] = []
    for (let file of body.files) {
        const key = await CloudflareService.uploadImageToBucket(id, file)
        files.push(`${BASE_URL}/${key}`)
    }

    const reply = await PostService.addReply(id, params.postId, body.text ?? undefined, files)
    response.send({ reply })
}