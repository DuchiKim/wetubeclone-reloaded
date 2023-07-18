import express from "express";
import {getedit , remove} from "../controllers/videocontroller"

const userRouter = express.Router();

userRouter.get ("/edit" , getedit );

export default userRouter