if(process.env.NODE_ENV != "production"){
require('dotenv').config()  // since we are in dev phase, we use it only dev phase not in production phase
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");


const dbUrl = process.env.ATLASDB_URL;

const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate") // helps to create many templates
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js"); // reqing the class to throw custom error 
const {listingSchema,reviewSchema} = require("./schema.js") // schema.js lo object petti module.exports chessam and that we are requiring now
const Review = require("./models/review.js"); 
const router = express.Router({ mergeParams: true }); 

const session = require("express-session")
const MongoStore = require('connect-mongo');

const flash = require("connect-flash")
const passport = require("passport") 
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const listingsRouter = require("./routes/listing.js") //  restructuring for ease of use
const reviewsRouter = require("./routes/review.js") // restructuring for ease of use
const userRouter = require("./routes/user.js") // '' '' 



main() .then(()=>console.log("connected to db"))
       .catch((err)=>{console.log(err)});


async function main() {
    await mongoose.connect(dbUrl);
    
}

app.set("view engine","ejs"); //setting view engine to allow templating
app.set("views",path.join(__dirname,"views")); // ye wale path se view ko loo
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate); 
app.use(express.static(path.join(__dirname,"/public")))


//  -----------mongo sessions store setup 
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 3600
});

store.on("error",(err)=>{
    console.log("Error in session store", err)
})

// ------------------------------------------------------




const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 , // this expires after 1 week. because using date.now gives milliseconds idk why ?
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true // security ke liye karte hai !! cross scripting se prevent karne ke liye 
    }   
}



app.use(session(sessionOptions))
app.use(flash()) // sessions ke neeche hi rehna, and also jo routes ku handle karre na restructuring karke usse phele hi aana ye cheeze

app.use(passport.initialize()); // shuru karo 
app.use(passport.session()); // session use karo 
passport.use(new LocalStrategy(User.authenticate()))   //localstrategy use karo and user ku authenticate karo using authenticate method

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

passport.serializeUser(User.serializeUser()); //user ka session save karna
passport.deserializeUser(User.deserializeUser()); //user ka session ko unsave karna




// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new Listing({ // ye karte hi new db create hojata, jaake mongoshell me dekh aayega !
//         title : "My new villa",  // this will not be saved when we start server but, this data will be saved only when we start the server and run it in browser, then it will be saved in the db
//         description : "by the beach",
//         price : "1200",
//         location : "goa",
//         country : "india"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing")
// })




  // you are destructing the error which was return from the listingschema obj of joi.validation 



app.use((req,res,next)=>{
    res.locals.success = req.flash("success") // locals temp storage area me we are creating new var success which stores the flash key which has name "success"
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
        res.locals.isAuthenticated = req.isAuthenticated();
    next() // dont forget to call next 
})

// app.get("/demouser",async (req,res)=>{ //1 
//     let fakeUser = new User({
//         email : "dawoodshaik@gmail.com",
//         username : "dawood"
//     })
//     let registeredUser = await User.register(fakeUser,"helloworld") // registr is a static method, jiske undar we will pass fakeuser and passoword.
//     res.send(registeredUser)
// })


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/",userRouter)






// middlewares




app.use((req, res, next) => { // automatically called when no route is responding
    next(new ExpressError(404, "Page not found")); // universal route handler error thrower "*" page not found
});



app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
     res.status(status).render("error", { err }); // Make sure you have an 'error.ejs', 
    // res.render("error.ejs",{message}) 
});




app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
