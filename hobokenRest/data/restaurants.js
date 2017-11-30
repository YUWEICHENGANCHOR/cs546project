const mongoCollections=require("../config/mongoCollections");
const restaurants=mongoCollections.restaurants;
const uuidv4 = require('uuid/v4');

//get all restaurants
async function getAllRestaurants(){
    const restaurantsCollection=await restaurants();
    const allRestaurants=await restaurantsCollection.find({}).toArray();
    let resultsList=[];
    for(let i=0;i<allRestaurants.length;i++){
        let content={
            _id:allRestaurants[i]._id,
            cuisine:allRestaurants[i].R_cuisine,
            name:allRestaurants[i].R_name,
            href:allRestaurants[i].R_href,
            location:allRestaurants[i].R_location,
            reviews:[]
        }
        resultsList.push(content);
    }
    return resultsList; 
}

//get the restaurant 
async function getRestaurantById(id){
    if(id===undefined) throw "Please provide an name.";
    const restaurantsCollection=await restaurants();
    const theRestaurant=await restaurantsCollection.findOne({_id:id});
    if(!theRestaurant || theRestaurant===null) throw "No restaurant with that name.";
    return theRestaurant;
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
        _id:uuidv4(),
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
        {_id:id},
        {$set:updatedRestaurant}
    ); 
    return await this.getRestaurantById(id);  
}

//Deletes the restaurant
async function deleteRestaurant(id){
    if(!id) throw "No id provided.";
    const restaurantsCollection=await restaurants();
    const deleteInfo=restaurantsCollection.removeOne({_id:id});
    if(deleteInfo.deleteCount==0) throw "Could not delete restaurant.";
    return "{delete restaurant: true}";
}

module.exports={getAllRestaurants,getRestaurantById,addRestaurant,updateRestaurant,deleteRestaurant};

