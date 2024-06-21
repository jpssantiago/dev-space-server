import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import * as TokenService from "../../services/token-service"
import * as NotificationService from "../../services/notification-service"

const headersSchema = z.object({
    authorization: z.string()
})

export async function getNotifications(request: FastifyRequest, reply: FastifyReply) {
    const { data: headers } = headersSchema.safeParse(request.headers)
    if (!headers) {
        return reply.send({ err: "no-token" })
    }

    const token = headers.authorization.split(" ")[1]
    const id = TokenService.validateToken(token)
    if (!id) {
        return reply.send({ err: "unauthorized" })
    }

    const notifications = await NotificationService.getNotifications(id)
    reply.send({ notifications })
}