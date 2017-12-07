const router=require("express").Router();
const restaurantsData=require("../data/restaurants");

// router.get('/', async function(req, res) {
//     res.send('restaurants respond!!!');
// });
 
router.get("/", async (req,res)=>{
    try{
        const getData=await restaurantsData.getAllRestaurants();
        console.log(getData);
        res.json(getData);
    }catch(e){
        console.log(e);
        res.status(500).json({error: e});
    }   
});

router.get("/all", async (req,res)=>{
    try{
        const getData=await restaurantsData.getAll();
        res.json(getData);
    }catch(e){
        res.status(500).json({error: e});
    }   
});

router.get("/:id", async (req,res)=>{
    try{
        const getData=await restaurantsData.getRestaurantById(req.params.id);
        res.json(getData);
    }catch(e){
        console.log(e);
        res.status(404).json({error:"The restaurant not found."});
    }
});

router.get("/:name", async (req,res)=>{
    try{
        const getData=await restaurantsData.getRestaurantByName(req.params.name);
        res.json(getData);
    }catch(e){
        console.log(e);
        res.status(404).json({error:"The restaurant not found."});
    }
});

router.post("/", async (req,res)=>{
    let restaurantInfo=req.body; 
    if (!restaurantInfo) {
        res.status(400).json({ error: "You must provide data to create a restaurant." });
        return;
    }
    if (!restaurantInfo.R_cuisine) {
        res.status(400).json({ error: "You must provide a cuisine." }); 
        return;
    }
    if (!restaurantInfo.R_name) {
        res.status(400).json({ error: "You must provide name." });
        return;
    }
    if (!restaurantInfo.R_href) {
        res.status(400).json({ error: "You must provide href." });
        return;
    }
    if (!restaurantInfo.R_location) {
        res.status(400).json({ error: "You must provide location." });
        return;
    }
    try{
        const newRestaurant=await restaurantsData.addRestaurant(restaurantInfo.R_cuisine,restaurantInfo.R_name,restaurantInfo.R_href,restaurantInfo.R_location);
        res.json(newRestaurant);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    } 
});

router.put("/:id", async (req,res)=>{
    let restaurantInfo=req.body;
    try{
        await restaurantsData.getRestaurantById(req.params.id);
    }catch(e){
        res.status(404).json({ error: "Restaurant not found" });
    }
    try{
        const result=await restaurantsData.updateRestaurant(req.params.id,restaurantInfo);
        res.json(result);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete("/:id",async (req,res)=>{
   // const restaurantInfo=await restaurantsData.getRestaurantById(req.params.id);
    try{
        try{
            const result=await restaurantsData.deleteRestaurant(req.params.id);
            res.sendStatus(200);
        }catch(e){
            res.sendStatus(500);
        }
    }catch(e){
        console.log(e);
        res.status(404).json({ error: "restaurant not found" });
    }
});

module.exports=router;