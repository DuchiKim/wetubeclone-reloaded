import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL)

const database = mongoose.connection;

const handleOpen = () => console.log("👌Connected to DB ")
database.on("error" , (error) => console.log("DB error", error));
database.once ("open" , handleOpen)