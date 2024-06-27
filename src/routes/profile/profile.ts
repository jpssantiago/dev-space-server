import { FastifyInstance } from "fastify"

import { getProfile } from "./get-profile"

export default async function(app: FastifyInstance) {
    app.get("/profile/:username", getProfile)
}   