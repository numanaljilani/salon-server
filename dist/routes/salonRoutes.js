"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salonController_1 = require("../controllers/salon/salonController");
const styelistController_1 = require("../controllers/salon/styelistController");
const auth_1 = require("../middlewares/auth");
const SalonServicesController_1 = require("../controllers/salon/SalonServicesController");
const router = express_1.default.Router();
// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)
// ---------------------------------------- customers ------------------------------------------//
router.get("/visited-salons", auth_1.isAuthenticated, salonController_1.visitedSalons);
router.post("/visit-salon", auth_1.isAuthenticated, salonController_1.visitSalon);
// ---------------------------------- admin ------------------------------------//
router.post("/create-salon", auth_1.isAuthenticated, auth_1.isAdmin, salonController_1.createsalon);
router.put("/update-salon", auth_1.isAuthenticated, auth_1.isAdmin, salonController_1.updatesalon);
// router.delete("/delete-salon",admin_login)
router.post("/salons", auth_1.isAuthenticated, auth_1.isAdmin, salonController_1.mysalons); // my all salons
router.get("/salon/:id", auth_1.isAuthenticated, auth_1.isAdmin, salonController_1.salon); // salon details 
// router.post("/salons",isAuthenticated,isAdmin,mysalons) // Add services in salon
router.post('/create-stylist', auth_1.isAuthenticated, auth_1.isAdmin, styelistController_1.createstylist);
router.put('/update-stylist', auth_1.isAuthenticated, auth_1.isAdmin, styelistController_1.updatestylist);
router.put('/remove-stylist', auth_1.isAuthenticated, auth_1.isAdmin, styelistController_1.removestylist);
router.post('/salon-stylist', auth_1.isAuthenticated, styelistController_1.salonstylists);
router.post('/stylist-services', auth_1.isAuthenticated, styelistController_1.servicestylists);
router.post('/create-service', auth_1.isAuthenticated, SalonServicesController_1.createservice);
router.post('/services', auth_1.isAuthenticated, SalonServicesController_1.getservices);
// ---------------------------------- admin super admin ------------------------------------//
router.put("/salons/:id/block", salonController_1.salonvarification);
// router.put("/salons/" , admin_login)
exports.default = router;
