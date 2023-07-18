import express from "express";
import {watch, getedit ,getupload, postedit , postupload} from "../controllers/videocontroller"

const videoRouter = express.Router();

videoRouter.get ("/:id([0-9a-f]{24})" , watch);
videoRouter.route ("/:id([0-9a-f]{24})/edit").get(getedit).post(postedit);
videoRouter.route ("/upload").get(getupload).post(postupload);


export default videoRouter