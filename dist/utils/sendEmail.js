"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const path_1 = __importDefault(require("path"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const sendEmail = async ({ data }) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        // point to the template folder
        const handlebarOptions = {
            viewEngine: express_handlebars_1.default.create({
                extname: ".hbs",
                partialsDir: path_1.default.resolve("./views/partials/"),
                layoutsDir: path_1.default.resolve("./views/layouts/"),
                defaultLayout: false,
            }),
            viewPath: path_1.default.resolve("./views/"),
            extName: ".hbs",
        };
        // use a template file with nodemailer
        transporter.use("compile", (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
        let mailOptions = {
            from: process.env.USER,
            to: data.email,
            subject: data.subject,
            template: "email.handlebars", // the name of the template file i.e email.handlebars
            context: {
                link: data.url, // replace {{link}} with text
                name: data.name,
            },
            attachments: [
                {
                    filename: "logo-1.png",
                    path: path_1.default.resolve("public/images/logo-1.png"),
                    cid: "logo-1",
                },
            ],
        };
        // trigger the sending of the E-mail
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return console.log("email not sent!");
            }
            console.log("email sent successfully");
        });
    }
    catch (error) {
        console.log("email not sent!");
        console.log(error);
    }
};
exports.default = sendEmail;
