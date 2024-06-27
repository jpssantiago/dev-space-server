import { FastifyInstance } from "fastify"

import { loadUser } from "./load-user"
import { editUser } from "./edit-user"

export default async function(app: FastifyInstance) {
    app.get("/user", loadUser)
    app.put("/user", editUser)
}