const mongoCollections=require("../config/mongoCollections");
const restaurants=mongoCollections.restaurants;
const ObjectId = require('mongodb').ObjectId;

//get all restaurants and all reviews
async function getAll() {
    const restaurantsCollection=await restaurants();
    return await restaurantsCollection.find({}).toArray();  
} 

//get all restaurants
async function getAllRestaurants(){
    const restaurantsCollection=await restaurants();
    //return await restaurantsCollection.find({}).toArray();
    const allRestaurants=await restaurantsCollection.find({}).toArray();
    let resultsList=[];
    for(let i=0;i<allRestaurants.length;i++){
        let content={
            _id:allRestaurants[i]._id,
            R_cuisine:allRestaurants[i].R_cuisine,
            R_name:allRestaurants[i].R_name,
            R_href:allRestaurants[i].R_href,
            R_location:allRestaurants[i].R_location,
            R_review:[],
        }
        resultsList.push(content);
    }
    return resultsList; 
}


//get the restaurant 
async function getRestaurantById(id){
    // if(id===undefined) throw "Please provide an id.";
    // const theRestaurants=await this.getAllRestaurants();
    // if(!theRestaurants) throw "can not get theRestaurants."
    // for(let i=0;i<theRestaurants.length;i++){
    //     if(theRestaurants[i]._id.toString()===id){
    //         return theRestaurants[i]; 
    //     } 
    // }
    if(id===undefined) throw "Please provide an name.";
    const restaurantsCollection=await restaurants();
    const theRestaurant=await restaurantsCollection.findOne({_id:ObjectId(id)});
    if(!theRestaurant || theRestaurant===null) throw "No restaurant with that name.";
    return theRestaurant;
}

//get the restaurant 
async function getRestaurantByName(name){
    if(name===undefined) throw "Please provide an id.";
    //const restaurantsCollection=await restaurants();
    const theRestaurants=await this.getAllRestaurants();
    if(!theRestaurants) throw "can not get theRestaurants."
    for(let i=0;i<theRestaurants.length;i++){
        if(theRestaurants[i].R_name===name){
            return theRestaurants[i];   
        }        
    }
}

//add restaurant
async function addRestaurant(cuisine,name,href,location){
    if(!Array.isArray(cuisine) || cuisine===null || cuisine.length===0){
        cuisine=[];
    }
    if(typeof name!=="string" || name==="" || name.length===0)  throw "No name provided.";
    if(typeof href!=="string" || href==="" || href.length===0)  throw "No href provided.";
    if(typeof location!=="string" || location==="" || location.length===0)  throw "No location provided.";

    const restaurantsCollection=await restaurants();
    let newRestaurant={
        _id:new ObjectId(),
        R_cuisine:cuisine,
        R_name:name,
        R_href:href,
        R_location:location,
        R_review:[]
    }
    const insertInfo=await restaurantsCollection.insertOne(newRestaurant);
    if(insertInfo.insertedCount==0) throw "Could not add restaurant.";
    return await this.getRestaurantById(insertInfo.insertedId);
}

//update the restaurant
async function updateRestaurant(id,suppliedChange){
    const restaurantsCollection=await restaurants();
    const updatedRestaurant={};
    if(suppliedChange.R_cuisine){
        updatedRestaurant.R_cuisine=suppliedChange.R_cuisine;
    }
    if(suppliedChange.R_name){
        updatedRestaurant.R_name=suppliedChange.R_name;
    }
    if(suppliedChange.R_href){
        updatedRestaurant.R_href=suppliedChange.R_href;
    }
    if(suppliedChange.R_location){
        updatedRestaurant.R_location=suppliedChange.R_location;
    }
    if(suppliedChange.R_review){
        updatedRestaurant.R_review=suppliedChange.R_review;
    } 
    const updatedInfo=await restaurantsCollection.updateOne(
        {_id:ObjectId(id)},
        {$set:updatedRestaurant},
        {upsert:true}
    );  
    return await this.getRestaurantById(id);  
}

//Deletes the restaurant
async function deleteRestaurant(id){
    if(!id) throw "No id provided.";
    const restaurantsCollection=await restaurants();
    const deleteInfo=restaurantsCollection.removeOne({_id:ObjectId(id)});
    if(deleteInfo.deleteCount==0) throw "Could not delete restaurant.";
    return "{delete restaurant: true}";
}

module.exports={getAll,getAllRestaurants,getRestaurantById,getRestaurantByName,addRestaurant,updateRestaurant,deleteRestaurant};
