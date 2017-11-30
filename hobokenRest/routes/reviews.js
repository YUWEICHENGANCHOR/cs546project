const router=require("express").Router();
const data=require("../data");
const reviewsData=data.reviews;

router.get("/", async (req,res)=>{
    res.status(200).send("Review root");
});

router.get("/restaurant",async (req,res)=>{
    res.status(200).send("Restaurant root");
});

router.get("/restaurant/:restaurantId", async (req,res)=>{
    try{
        const reviewsList=await reviewsData.getReviewsByRestaurantId(req.params.restaurantId);
        res.json(reviewsList); 
    }catch(e){
        console.log(e);
        res.status(404).json({error:"The restaurant not found."});
    } 
});

router.get("/:reviewId", async (req,res)=>{
    try{
        const reviewInfo=await reviewsData.getReviewByReviewId(req.params.reviewId);
        res.json(reviewInfo);
    }catch(e){
        console.log(e);
        res.status(404).json({error:"The review not found."});
    } 
});

router.post("/:restaurantId", async (req,res)=>{
    let restaurantInfo=req.body;
    if(!restaurantInfo){
        res.status(400).json({error:"You must provide data to create a review."});
        return;
    }
    if(!restaurantInfo.reviewer_name){
        res.status(400).json({error:"You must provide a reviewer_name."});
        return;
    }
    if(!restaurantInfo.reviewer_like){
        res.status(400).json({error:"You must provide reviewer_like."});
        return;
    }
    if(!restaurantInfo.review){
        res.status(400).json({error:"You must provide review."});
        return;
    }
    try {
        const result=await reviewsData.addReview(req.params.restaurantId,restaurantInfo.reviewer_name,restaurantInfo.reviewer_like,restaurantInfo.review);
        res.json(result);
    } catch (e){
        console.log(e);
        res.status(500).json({error:e});
    }
});

router.put("/:restaurantId/:reviewId",async (req,res)=>{
    let reviewInfo=req.body;
    if(!reviewInfo){
        res.status(400).json({error:"You must provide data to update a review."});
        return;
    }
    if(!req.params.restaurantId){
        res.status(400).json({error:"You must provide a restaurantId."});
        return;
    }
    if(!req.params.reviewId){
        res.status(400).json({error:"You must provide a reviewId."});
        return;
    }
    try{
        const getData=await reviewsData.getReviewByReviewId(req.params.reviewId);
        try{
            const result=await reviewsData.updateReview(req.params.restaurantId,req.params.reviewId,reviewInfo);
            res.json(result);
        }catch(e){
            console.log(e);
            res.status(500).json({error:e});
        }
    }catch(e){
        console.log(e);
        res.status(404).json({error:"Review not found."});
    }
});

router.delete("/:id", async (req,res)=>{
    try{
        const getReview=await reviewsData.getReviewByReviewId(req.params.id);
        try{
            const result=await reviewsData.deleteReview(req.params.id);
            res.sendStatus(200);
        }catch(e){
            res.status(500).json({error:e});
        }
    }catch(e){
        res.status(404).json({error:"The review not found."});
    }
});

module.exports=router;