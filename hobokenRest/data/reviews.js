const mongoCollections=require("../config/mongoCollections");
const reviews=mongoCollections.reviews;
const requiredRestaurant=mongoCollections.restaurants;
const restaurants=require("./restaurants");
const uuidv4 = require('uuid/v4');

async function getReviewsByRestaurantId(restaurantId) {
    const theRestaurant=await restaurants.getRestaurantById(restaurantId);
    const theReviews=theRestaurant.R_review;
    const result=[];
    for(let i=0;i<theReviews.length;i++){
        let reviewsResult={
            _id:theReviews[i]._id,
            restaurantId:theRestaurant._id,
            reviewerName:theReviews[i].reviewer_name,
            reviewerLike:theReviews[i].reviewer_like,
            review:theReviews[i].review  
        } 
        result.push(reviewsResult);   
    }  
    return result;
}

async function getReviewByReviewId(id){
    if(id===undefined) throw "Please provide an id.";
    const reviewsCollection=await reviews();
    const theReview=await reviewsCollection.findOne({_id:id});
    if(!theReview || theReview===null) throw "No review with that id.";
    return theReview;
}

async function addReview(restaurantId,name,like,review) {
    const restaurantsCollection=await requiredRestaurant();
    const theRestaurant=await restaurantsCollection.findOne({_id: restaurantId});
    //console.log(theRestaurant);
    if (!theRestaurant) throw "Restaurant not found.";

    let theReview={
        _id:uuidv4(),
        reviewer_name:name,
        reviewer_like:like,
        review:review
    };
 
    let newReview={
        $push: {R_review: theReview}  
    };
    await restaurantsCollection.updateOne({_id: restaurantId},newReview);   
    const reviewsCollection=await reviews();
    const insertInfo=await reviewsCollection.insertOne(theReview);
    //console.log(insertInfo);
    if(insertInfo.insertedCount==0) throw "Could not add review.";
    return theReview;
}

async function updateReview(restaurantId,reviewId,suppliedChange){
    const restaurantsCollection=await requiredRestaurant();
    const reviewsCollection=await reviews();
    const theRestaurant=await restaurants.getRestaurantById(restaurantId);
    const theReviews=theRestaurant.R_review;
    const updatedReview={};
    if(suppliedChange.reviewer_name){
        updatedReview.reviewer_name=suppliedChange.reviewer_name;
        const updatedNameInfo=await restaurantsCollection.update(
            {_id:restaurantId,"R_review._id":reviewId},
            {$set:{"R_review.$.reviewer_name":suppliedChange.reviewer_name}}
        );
    }
    if(suppliedChange.reviewer_like){
        updatedReview.reviewer_like=suppliedChange.reviewer_like;
        const updatedLikeInfo=await restaurantsCollection.update(
            {_id:restaurantId,"R_review._id":reviewId},
            {$set:{"R_review.$.reviewer_like":suppliedChange.reviewer_like}}
        );
    }
    if(suppliedChange.review){
        updatedReview.review=suppliedChange.review;
        const updatedReviewInfo=await restaurantsCollection.update(
            {_id:restaurantId,"R_review._id":reviewId},
            {$set:{"R_review.$.review":suppliedChange.review}}
        );
    }
    const updatedReviewInfo=await reviewsCollection.updateOne(
        {_id:reviewId},
        {$set:updatedReview}
    );    
    return await this.getReviewByReviewId(reviewId);
}

async function deleteReview(id){
    if(!id) throw "No id provided.";
    const reviewsCollection=await reviews();
    const deleteReviewInReviews=await reviewsCollection.removeOne({_id:id});
    if(deleteReviewInReviews.deleteCount===0) throw "Could not delete the review from reviewsCollection.";

    const restaurantsCollection=await requiredRestaurant();
    const theRestaurants=await restaurants.getAllRestaurants();
    for(let i=0;i<theRestaurants.length;i++){
        const theReviews =await this.getReviewsByRestaurantId(theRestaurants[i]._id);
        if (!theReviews) throw "No reviews found.";
        for(let j=0;j<theReviews.length;j++){
            if(theReviews[j]._id===id){
                let deleteReviewInRestaurants=await restaurantsCollection.update(
                    {_id:theRestaurants[i]._id},
                    {$pull:{'R_review':{_id:id}}}
                )
                if(deleteReviewInRestaurants.deleteCount===0) throw "Could not delete the review.";
            }
        }    
    }
    return "{delete comment:true}";
}

module.exports={getReviewsByRestaurantId,getReviewByReviewId,addReview,updateReview,deleteReview};

