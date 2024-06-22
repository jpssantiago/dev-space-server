import { FastifyInstance } from "fastify"

import { getPost } from "./get-post"
import { addReply } from "./add-reply"
import { addPost } from "./add-post"
import { deletePost } from "./delete-post"

export default async function(app: FastifyInstance) {
    app.get("/post/:postId", getPost)
    app.post("/post/:postId", addReply)
    app.post("/post", addPost)
    app.delete("/post/:postId", deletePost)
}