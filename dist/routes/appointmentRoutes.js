"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signupController_1 = __importDefault(require("../controllers/auth/signupController"));
const salonController_1 = require("../controllers/salon/salonController");
const styelistController_1 = require("../controllers/salon/styelistController");
const router = express_1.default.Router();
// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)
// ---------------------------------------- customers / stylist ------------------------------------------//
router.get("/my-appointments", signupController_1.default);
router.post("/create-appointment", signupController_1.default);
router.put("/update-appointments", signupController_1.default); // cancel, update , reject , reschedule 
router.get('/appointment-slots', signupController_1.default);
// ---------------------------------- admin ------------------------------------//
router.get("/salon-appintments", salonController_1.createsalon); // can see all salons appointmets / wprking by date also
router.put("/update-salon", salonController_1.updatesalon);
// router.delete("/delete-salon",admin_login)
router.get("/salons", salonController_1.mysalons); // my all salons
router.post('/create-stylist', styelistController_1.createstylist);
router.put('/update-stylist', styelistController_1.updatestylist);
router.put('/remove-stylist', styelistController_1.removestylist);
// ---------------------------------- admin super admin ------------------------------------//
exports.default = router;
