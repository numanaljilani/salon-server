import express from "express";
import signup from "../controllers/auth/signupController";
import {  admin_login, login } from "../controllers/auth/loginController";
import { createsalon, mysalons, salon, salonvarification, updatesalon, visitedSalons, visitSalon } from "../controllers/salon/salonController";
import { createstylist, removestylist, updatestylist } from "../controllers/salon/styelistController";
import { isAdmin, isAuthenticated } from "../middlewares/auth";

const router = express.Router();

// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)


// ---------------------------------------- customers ------------------------------------------//
router.get("/visited-salons",isAuthenticated ,  visitedSalons);
router.post("/visit-salon",isAuthenticated , visitSalon)


// ---------------------------------- admin ------------------------------------//

router.post("/create-salon",isAuthenticated,isAdmin,createsalon)
router.put("/update-salon",isAuthenticated,isAdmin,updatesalon)
// router.delete("/delete-salon",admin_login)
router.post("/salons",isAuthenticated,isAdmin,mysalons) // my all salons
router.get("/salon/:id",isAuthenticated,isAdmin,salon) // salon details 

// router.post("/salons",isAuthenticated,isAdmin,mysalons) // Add services in salon


router.post('/create-stylist' ,isAuthenticated,isAdmin, createstylist)
router.put('/update-stylist' , isAuthenticated,isAdmin,updatestylist)
router.put('/remove-stylist' ,isAuthenticated,isAdmin, removestylist)

// ---------------------------------- admin super admin ------------------------------------//
router.put("/salons/:id/block" , salonvarification)
// router.put("/salons/" , admin_login)


export default router;