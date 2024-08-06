import express from "express";
import signup from "../controllers/auth/signupController";
import {  admin_login, login } from "../controllers/auth/loginController";
import { createsalon, mysalons, salonvarification, updatesalon } from "../controllers/salon/salonController";
import { createstylist, removestylist, updatestylist } from "../controllers/salon/styelistController";

const router = express.Router();

// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)


// ---------------------------------------- customers / stylist ------------------------------------------//
router.get("/my-appointments", signup);
router.post("/create-appointment", signup);
router.put("/update-appointments", signup); // cancel, update , reject , reschedule 


router.get('/appointment-slots',signup)
// ---------------------------------- admin ------------------------------------//

router.get("/salon-appintments",createsalon) // can see all salons appointmets / wprking by date also
router.put("/update-salon",updatesalon)
// router.delete("/delete-salon",admin_login)
router.get("/salons",mysalons) // my all salons

router.post('/create-stylist' , createstylist)
router.put('/update-stylist' , updatestylist)
router.put('/remove-stylist' , removestylist)

// ---------------------------------- admin super admin ------------------------------------//



export default router;