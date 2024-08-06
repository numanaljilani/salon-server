import express from "express";
import signup from "../controllers/auth/signupController";
import {  admin_login, login } from "../controllers/auth/loginController";
import { createsalon, mysalons, salonvarification, updatesalon } from "../controllers/salon/salonController";
import { createstylist, removestylist, updatestylist } from "../controllers/salon/styelistController";

const router = express.Router();

// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)


// ---------------------------------------- customers ------------------------------------------//
router.post("/register", signup);

router.post("/login",login)


// ---------------------------------- admin ------------------------------------//

router.post("/create-salon",createsalon)
router.put("/update-salon",updatesalon)
// router.delete("/delete-salon",admin_login)
router.get("/salons",mysalons) // my all salons

router.post('/create-stylist' , createstylist)
router.put('/update-stylist' , updatestylist)
router.put('/remove-stylist' , removestylist)

// ---------------------------------- admin super admin ------------------------------------//
router.put("/salons/:id/block" , salonvarification)
router.put("/salons/" , admin_login)


export default router;