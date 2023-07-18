import Video from "../models/Video";


const taehoon = {
    username: "Taehoon",
    loggedin: true,
  };

export const handleHome = async (req, res) => {
    const videos =await Video.find({});
    return res.render("home", { pageTitle: "Home", fakeuser: taehoon, videos })
};

export const getedit = (req , res ) => {
    const {id} =req.params;
    return res.render("edit" , {pageTitle: `Edit videos`})
};
export const postedit = (req,res) => {
    const {id} = req.params;
    const {title} = req.body;
    return res.redirect(`/videos/${id}`);
};
export const watch = async( req, res ) => {
    const id = req.params.id;
    const video = await Video.findById(id);
    return res.render("watch" , { pageTitle: `Watching video.id` , video : video });
};
export const getupload = (req,res) => {
    return res.render("upload" , {pageTitle: "upload video"} )
};

export const postupload = async (req,res) => {
const { title , description , hashtags } = req.body;
try {
    await Video.create ({
    title,
    description,
    hashtags: hashtags.split(",").map((word) => `#${word}`),
});
return res.redirect("/");
}catch (error){ 
    return res.render("upload", {
        pageTitle:"Upload Video", 
        errorMessage: error._message,});
    }
};
const Video.