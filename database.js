import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube")

const database = mongoose.connection;

const handleOpen = () => console.log("👌Connected to DB ")
database.on("error" , (error) => console.log("DB error", error));
database.once ("open" , handleOpen)