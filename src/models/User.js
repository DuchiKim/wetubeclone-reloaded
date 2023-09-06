import mongoose from "mongoose"
import bcrypt from "bcrypt"
const Userschema = new mongoose.Schema({
    username: {type:String , trim:true , unique: true},
    email: {type:String , trim:true , unique: true},
    password: {type:String , trim:true},
    location: {type:String , trim:true},
    socialOnly:{type:Boolean , default:false},
    GithubId: {type:Number , trim:true},
    AvatarUrl:{type:String },
    videos:[{type: mongoose.Schema.Types.ObjectId, ref:"Video",}]
})

Userschema.pre("save" , async function(){
    if(this.isModified("email")){
    this.password = await bcrypt.hash(this.password , 5)
    }
});
const User = mongoose.model("User" , Userschema )

export default User;