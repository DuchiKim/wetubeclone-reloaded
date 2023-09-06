import express from "express"
import morgan from "morgan"
import globalRouter from "./src/routers/globalRouter"
import userRouter from "./src/routers/userRouter"
import videoRouter from "./src/routers/videoRouter"
import session from "express-session"
import { localsmiddleware } from "./src/controllers/middlewares"
import MongoStore from "connect-mongo"
const app = express();
const logger = morgan("dev")

app.set ("view engine", "pug")
app.set ("views" , process.cwd()+ "/src/views")
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads" , express.static("uploads"));

app.use (session({
    saveUninitialized : true,
    secret: process.env.COOKIE_SECRET,
    resave : true,
    store : MongoStore.create({mongoUrl:process.env.DB_URL}),
}));

app.use (localsmiddleware)
app.use ("/" , globalRouter)
app.use ("/videos" , videoRouter)
app.use ("/users" , userRouter)

export default app