import { FastifyInstance } from "fastify"

import { getNotifications } from "./get-notifications"

export default async function(app: FastifyInstance) {
    app.get("/notifications", getNotifications)
}