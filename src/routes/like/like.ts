import { FastifyInstance } from "fastify"

import { toggleLike } from "./toggle-like"

export default async function(app: FastifyInstance) {
    app.post("/like/:postId", toggleLike)
}