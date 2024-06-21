import { FastifyInstance } from "fastify"

import { loadFeed } from "./load-feed"

export default async function(app: FastifyInstance) {
    app.get("/feed", loadFeed)
}