const Listing = require("./models/listing")
const ExpressError = require("./utils/ExpressError.js"); // 7
const {listingSchema,reviewSchema} = require("./schema.js")
const Review = require("./models/review.js")


module.exports.isLoggedIn = (req, res, next) => {
    console.log(req)
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // made variable
        req.flash("error", "you must login to create new listing")
        return res.redirect("/login")
    }

    next() // agar authenticated hai tho next ku call kardo 
} // making a function 


module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}


module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params
     let listing =  await Listing.findById(id)
   if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","you are not the owner of this listing")
     return res.redirect(`/listings/${id}`);
   }
   next() // else continue next
}


module.exports.validateListing = (req,res,next) =>{ // we made a var which has the error handling,before any submission we make validation by putting this var before any put fun
    let {error} = listingSchema.validate(req.body)  // "middleware function"
    if(error){
       const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(404, msg);
  // 8
    }
    else{
        next()  
    }
}

module.exports.validateReview = (req,res,next) =>{ // we made a var which has the error handling,before any submission we make validation by putting this var before any put fun
    let {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(', ');
       throw new ExpressError(404,msg)
    }
    else{
        next()  
    }
}  

 

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewid} = req.params;
     let review =  await Review.findById(reviewid)
   if(!review.author._id.equals(res.locals.currUser._id)){  // since in schema we have defined that type : Scehma.types.ObjectId, we obj id of ref: "user" 
    req.flash("error","you are not the author of this review")
     return res.redirect(`/listings/${id}`);
   }
   next()
}