import mongoose from "mongoose";
import Video from "../models/Video";
import User from "../models/User"
const taehoon = {
  username: "Taehoon",
  loggedin: true,
};

export const handleHome = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home",  videos });
};

export const getedit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("edit", { pageTitle: `Edit:${video.title}`, video });
};
export const postedit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({_id: id});
  if (video === null) {
    return res.status(400).render("404error", { pageTitle: "error page" })};

  await Video.findByIdAndUpdate(id , {
    title: title,
    description: description,
    hashtags: Video.formatHashtags(hashtags),
  })
  return res.redirect(`/videos/${id}`);
};
export const watch = async (req, res) => {
  const {id,title,description} = req.params;
  const video = await Video.findById(id);
  const owner = await User.findById(video.owner);
  if (video === null) {
    return res.status(400).render("404error", { pageTitle: "error page" });
  } else {
    return res.render("watch", {
      pageTitle: `Watching #${video.title}`,
      video: video,
      description: description,
      owner,
    });
  }
};
export const getupload = async (req, res) => {
  return res.render("upload", { pageTitle: "upload video" });
};

export const postupload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const file = req.file;
  const {
    user: {_id}} = req.session;
  try {
    const newVideo = await Video.create({
      fileUrl:file.path,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
    
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  } 
};

export const getdelete =  async(req,res) => { 
  const {id} = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const searchVideo = async (req ,res ) => {
  const {id} = req.params;
  const {keyword} = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: keyword,
    });
  }
  res.render("search" , {pageTitle : "Search", videos});
 };