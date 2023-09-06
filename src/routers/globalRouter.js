import express from "express";
import {getjoin,postjoin,getLogin,postLogin,getlogout, GetEditProfile, PostEditProfile} from "../controllers/usercontroller"
import {videos } from "../controllers/globalcontroller"
import {handleHome , searchVideo} from "../controllers/videocontroller"
import { protectormiddleware } from "../controllers/middlewares";
const globalRouter = express.Router();

globalRouter.get ("/" , handleHome)
globalRouter.get ("/videos" , videos)
globalRouter.route ("/join").get(getjoin).post(postjoin);
globalRouter.route ("/login").get(getLogin).post(postLogin);
globalRouter.get( "/logout", getlogout)
globalRouter.get ("/search" , searchVideo);
export default globalRouter