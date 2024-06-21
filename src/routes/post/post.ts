import { FastifyInstance } from "fastify"

import { addReply } from "./add-reply"
import { addPost } from "./add-post"
import { deletePost } from "./delete-post"

export default async function(app: FastifyInstance) {
    app.post("/post/:postId", addReply)
    app.post("/post", addPost)
    app.delete("/post/:postId", deletePost)
}