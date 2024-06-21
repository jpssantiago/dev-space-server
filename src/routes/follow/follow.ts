import { FastifyInstance } from "fastify"

import { toggleFollow } from './toggle-follow'

export default async function(app: FastifyInstance) {
    app.post("/follow/:followedId", toggleFollow)
}