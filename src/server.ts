import fastify from "fastify"
import cors from "@fastify/cors"
import "dotenv/config"

import { env } from "./env/env"

const app = fastify()
app.register(cors, {})
app.register(import("./routes/auth/auth"))
app.register(import("./routes/user/user"))
app.register(import("./routes/feed/feed"))
app.register(import("./routes/notification/notification"))
app.register(import("./routes/like/like"))
app.register(import("./routes/post/post"))
app.register(import("./routes/follow/follow"))

app.listen({
    port: env.PORT,
    host: "0.0.0.0"
}, () => console.log(`Server running on port ${env.PORT} 🔥`))