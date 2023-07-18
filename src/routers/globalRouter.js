import express from "express";
import {join,login} from "../controllers/usercontroller"
import {videos } from "../controllers/globalcontroller"
import {handleHome} from "../controllers/videocontroller"
const globalRouter = express.Router();

globalRouter.get ("/" , handleHome)
globalRouter.get ("/videos" , videos)
globalRouter.get ("/join" , join);
globalRouter.get ("/login" , login);

export default globalRouter