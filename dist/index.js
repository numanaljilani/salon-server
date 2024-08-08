"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const salonRoutes_1 = __importDefault(require("./routes/salonRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const cors_1 = __importDefault(require("cors"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//The express.urlencoded() middleware is used to parse and extract this URL-encoded data from the request body and make it available in the req.body object for further processing in your application
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("<h2>Salon server is working</h2>");
});
app.use("/api", authRoutes_1.default);
app.use("/api", salonRoutes_1.default);
app.use("/api", appointmentRoutes_1.default);
app.use("/uploads", express_1.default.static("uploads"));
// global.appRoot : any = path.resolve(path.resolve());
app.use(errorHandler_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
