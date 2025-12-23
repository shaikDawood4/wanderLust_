const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req,res)=>{ 
    let {id} = req.params;
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    listing.reviews.push(newReview);
    req.flash("success", "new review added")
    await newReview.save()
    await listing.save()

    console.log("new review saved")

    res.redirect(`/listings/${id}`)
}


module.exports.destroyReview = async(req,res)=>{
    let {reviewid,id}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewid}}) 
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "review is deleted!!")
    res.redirect(`/listings/${id}`)
}