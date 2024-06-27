import { FastifyInstance } from "fastify"

import { getActivities } from "./get-activities"

export default async function(app: FastifyInstance) {
    app.get("/activities", getActivities)
}