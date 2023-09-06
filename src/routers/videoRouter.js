import express from "express";
import {
  watch,
  getedit,
  getupload,
  postedit,
  postupload,
  getdelete
} from "../controllers/videocontroller";
import { protectormiddleware , UploadVideo } from "../controllers/middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectormiddleware).get(getedit).post(postedit);
videoRouter.route("/upload").all(protectormiddleware).get(getupload).post(UploadVideo.single("video") , postupload); 
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectormiddleware).get(getdelete);

export default videoRouter;
