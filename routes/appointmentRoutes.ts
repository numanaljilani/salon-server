import express from "express";
import signup from "../controllers/auth/signupController";
import {  admin_login, login } from "../controllers/auth/loginController";
import { createsalon, mysalons, salonvarification, updatesalon } from "../controllers/salon/salonController";
import { createstylist, removestylist, updatestylist } from "../controllers/salon/styelistController";
import { isAuthenticated } from "../middlewares/auth";
import { createAppointment, myappointment, updateAppointment } from "../controllers/appointments/appointmentController";

const router = express.Router();

// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)


// ---------------------------------------- customers / stylist ------------------------------------------//
router.get("/my-appointments", isAuthenticated , myappointment);
router.post("/create-appointment", isAuthenticated , createAppointment);
router.put("/update-appointments",isAuthenticated ,updateAppointment); // cancel, update , reject , reschedule 


router.get('/appointment-slots',signup)
// ---------------------------------- admin ------------------------------------//

router.get("/salon-appintments",createsalon) // can see all salons appointmets / wprking by date also
router.put("/update-salon",updatesalon)
router.get("/salons",mysalons) // my all salons

// ---------------------------------- admin super admin ------------------------------------//



export default router;