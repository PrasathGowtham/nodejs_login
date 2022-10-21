const express=require("express");

const router = express.Router();
 
const roomData = require("../modules/Hotelmodules")


router.post("/signup",roomData.createrooms);



router.post("/signin",roomData.signin)

router.post("/save",roomData.saveprofile)


module.exports=router;