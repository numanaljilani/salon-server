"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signupController_1 = __importDefault(require("../controllers/auth/signupController"));
const salonController_1 = require("../controllers/salon/salonController");
const auth_1 = require("../middlewares/auth");
const appointmentController_1 = require("../controllers/appointments/appointmentController");
const router = express_1.default.Router();
// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)
// ---------------------------------------- customers / stylist ------------------------------------------//
router.get("/my-appointments", auth_1.isAuthenticated, appointmentController_1.myappointment);
router.post("/create-appointment", auth_1.isAuthenticated, appointmentController_1.createAppointment);
router.put("/update-appointments", auth_1.isAuthenticated, appointmentController_1.updateAppointment); // cancel, update , reject , reschedule 
router.put("/cancel-appointments", auth_1.isAuthenticated, appointmentController_1.cancelAppointment); // cancel, update , reject , reschedule 
router.get('/appointment-slots', signupController_1.default);
// ---------------------------------- admin ------------------------------------//
router.get("/salon-appintments", salonController_1.createsalon); // can see all salons appointmets / wprking by date also
router.put("/update-salon", salonController_1.updatesalon);
router.get("/get-salons", salonController_1.mysalons); // my all salons
// ---------------------------------- admin super admin ------------------------------------//
exports.default = router;
