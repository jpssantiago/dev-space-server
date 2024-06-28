import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import * as TokenService from "../../services/token-service"
import * as ActivityService from "../../services/activity-service"

const headersSchema = z.object({
    authorization: z.string()
})

export async function getActivities(request: FastifyRequest, reply: FastifyReply) {
    const { data: headers } = headersSchema.safeParse(request.headers)
    if (!headers) {
        return reply.send({ err: "no-token" })
    }

    const token = headers.authorization.split(" ")[1]
    if (token == "undefined") {
        return reply.send({ err: "no-token" })
    }
    
    const id = TokenService.validateToken(token)
    if (!id) {
        return reply.send({ err: "unauthorized" })
    }

    const activities = await ActivityService.getActivities(id)
    reply.send({ activities: activities?.map(activity => {
        return {
            ...activity,
            sender: {
                ...activity.sender,
                followers: activity.sender?.followers.map(f => f.following)
            }
        }
    }) })
}