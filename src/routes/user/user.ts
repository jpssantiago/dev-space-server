import { FastifyInstance } from "fastify"

import { loadUser } from "./load-user"

export default async function(app: FastifyInstance) {
    app.get("/user", loadUser)
}