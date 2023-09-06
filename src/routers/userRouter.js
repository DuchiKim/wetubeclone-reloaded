import express from "express";
import {getedit , remove} from "../controllers/videocontroller"
import { finishGithubLogin, startGithubLogin,GetEditProfile , PostEditProfile ,GetEditPassword ,PostEditPassword} from "../controllers/usercontroller";
import { protectormiddleware , UploadAvatar} from "../controllers/middlewares";
import {see} from "../controllers/usercontroller"
const userRouter = express.Router();

userRouter.get ("/edit" , getedit );
userRouter.get("/github/start" , startGithubLogin);
userRouter.get("/github/finish" , finishGithubLogin);
userRouter.get("/:id", see);
userRouter.route("/edit_profile").all(protectormiddleware).get(GetEditProfile).post(UploadAvatar.single("avatar"),PostEditProfile);
userRouter.route("/edit_password").all(protectormiddleware).get(GetEditPassword).post(PostEditPassword);

export default userRouter