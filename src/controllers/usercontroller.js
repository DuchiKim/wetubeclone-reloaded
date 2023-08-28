import "dotenv/config"
import User from "../models/User";
import bcrypt from "bcrypt"
import fetch from "node-fetch";

export const login = (req, res ) => res.send("login page");
export const getlogout = (req,res) => {
    req.session.destroy();
    return res.redirect("/");
}

export const getjoin = (req , res ) => {
    res.render("join",  {pageTitle:"Join page" } )    
}

export const postjoin = async (req,res) => {
    const {username,email,password,password1,location} = req.body;
    const userCheck = await User.exists({
        $or:[{username} , {email}]
    })
    if(userCheck){
        return res.status(400).render("join" , {pageTitle:"Join", errorMessage:"this username/email already exists"})
    }
    if(password !== password1){
        return res.status(400).render ("join" , {pageTitle:"join" , errorMessage:"password is not the same"})
    }
    try {
        await User.create({
        username,
        email,
        password,
        location,
    })
} catch (error) {
    res.status(400).render("404error" , {pageTitle:"Error!!" })
}
    return res.redirect("/login");
}
export const getLogin = (req,res) =>{
    res.render("login" , {pageTitle:"login page~"})
}
export const postLogin = async (req, res) => {
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(!user) {
        return res.status(400).render("login" , {pageTitle:"login page", errorMessage:"no exists user"});
    }
    const ok = await bcrypt.compare(password , user.password)
    if(!ok){
        return res.status(400).render("login" , {pageTitle:"login page", errorMessage:"wrong password"});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    
    return res.redirect("/");
}


export const startGithubLogin = (req,res) => {
    const baseurl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id :process.env.CLIENT_ID,
        allow_signup:"false",
        scope:"read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalurl = `${baseurl}?${params}`;
    return res.redirect(finalurl);
}

export const finishGithubLogin = async (req,res) => {
    const baseurl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id :process.env.CLIENT_ID,
        client_secret : process.env.CLIENT_SECRET,
        code : req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalurl = `${baseurl}?${params}`;
    const data = await fetch(finalurl , {
        method:"POST",
        headers : {
            Accept : "application/json",
    },
})

    const json = await data.json(); //await 을 왜 붙이는지?? 이미 data에서 await이 사용되었는데 (json은 promise객체를 반환하므로 await를 붙인다~)
    if("access_token" in json){
        const {access_token} = json;
        const apiurl = "https://api.github.com";
        const userRequest = await fetch(`${apiurl}/user` , {
            headers: {
                Authorization: `bearer ${access_token}`,
            },
        })
        const acceptUser = await userRequest.json();
        const emailData = await (await fetch(`${apiurl}/user/emails`, {
            headers:{
                Authorization: `Bearer ${access_token}`,
            }
        })).json();

        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
   
        const existingUser = await User.findOne({email: emailObj.email});
        if(existingUser) {
            req.session.loggedIn = true;
            req.session.user = existingUser;
            return res.redirect("/");
            
        }
        else{
            const user = await User.create({
                username : acceptUser.login,
                email : emailObj.email,
                password: "",
                location: acceptUser.location,
                socialOnly: true,
                GithubId: acceptUser.id,
                }
            );
            req.session.loggedIn = true;
            req.session.user = user;
            
            return res.redirect("/");
        }
    } else{
        return res.redirect("login");
        
    }
}


export const GetEditProfile = (req,res) => {
    return res.render("users/edit_profile"); //Error: Failed to lookup view "/users/edit_profile" in views directory "D:\VSClearn\wetube-clone/src/views" 에러가 생기는 이유? /users 를 해야 views/users/edit~ 이 되는것 아닌가?
}

export const PostEditProfile = async (req,res) => {
    const {session:{
        user:{_id , username , email , location},
      },
        body: {EditName , EditEmail , EditLocation},
    } = req;
    const CheckDuplicateUser = await User.findOne(
        {
            $or : [{username : EditName}, {email : EditEmail}]
        });
    console.log("username is : " , username);
    console.log("EditName is :" , EditName);
    console.log("CDU is : " , CheckDuplicateUser);
   
    if(CheckDuplicateUser){
        return res.status(400).render("users/edit_profile" , {errorMessage:"Already name or email Exists!"});
    }
    else{
        const UpdatedUser = await User.findByIdAndUpdate(_id,{
            username:EditName,
            email:EditEmail,
            location:EditLocation,
        },
        {new: true},
        );
        req.session.user = UpdatedUser;
        return res.redirect("edit_profile");
    }


    /*
    if(email !== EditEmail){
        const CheckEmail = await User.exists({email : EditEmail})
        try{if(CheckEmail){
            res.status(400).render("users/edit_profile" , {pageTitle:"Editprofile" , errorMessage:"This email already exists"});
        }else{
            req.session.user = UpdatedUser;
            return res.redirect("/");
        }
    }catch{
            res.redirect("/")
        }
       
    } */


        
        
    }
    