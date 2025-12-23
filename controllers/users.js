const User = require("../models/user");


module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.createUser = async(req,res)=>{
    try{
    let {username,email,password} = req.body
    const newUser = new User({username,email})
    const registeredUser = await User.register(newUser,password) // ** to save 
    console.log(registeredUser)
    req.login(registeredUser, (err)=>{
        if(err){
            return next()
        }
          req.flash("success", "Welcome to Wanderlust"); // this is used in redirected page
          res.redirect("/listings")
    })
  
    } 
    catch(error){
        req.flash("error",error.message);
        res.redirect("/signup")
    }

}


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}


module.exports.login = async(req,res)=>{  // p.a humara ek middleware hai, joh humare post route me login se phele authentication ke liye use hoga 
    req.flash("success", "Welcome to Wonderlust!")  
    let redirectUrl =   res.locals.redirectUrl || "/listings"                            // user hai ki nahi (authenticate ka kaam passport karega) 
    res.redirect(redirectUrl) // first save hoga url 2nd wala middleware dabba me fir redirect method execute hoga
}



module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(req.isAuthenticated()){
            req.flash("success", "you are logged out now!")
         res.redirect("/listings")

            
        }
        
           return res.redirect("/listings") // error aaya tho next ko call karo
    }) //logout apne aap me call back lega, aur ye callback is to implement immediate action after logging out user
}

module.exports.delUser = (req,res)=>{
     
}