import multer from "multer";

export const localsmiddleware = (req,res,next) => {
    console.log(req.session);
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    next();
};

export const protectormiddleware = (req,res,next) => {
    if(req.session.user){
        return next();
    }
    else{
        return res.redirect("/");
    }
}

export const publicOnlymiddleware = (req,res,next) => {
    if(!req.session.loggedInUser){
        return next();
    } else {
        return res.redirect("/");
    }
}

export const UploadAvatar = multer({dest:"uploads/avatar", limits: {filesize:300000}});

export const UploadVideo = multer({dest: "uploads/video" , limits: {filesize:100000000,}});