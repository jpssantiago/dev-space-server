import { FastifyInstance } from "fastify"

import { signIn } from "./sign-in"
import { signUp } from "./sign-up"

export default async function(app: FastifyInstance) {
    app.post("/signin", signIn)
    app.post("/signup", signUp)
}