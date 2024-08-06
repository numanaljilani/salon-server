import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import exphbs from "express-handlebars"; 

const sendEmail = async ({ data } : any) => {
  try {
    const transporter = nodemailer.createTransport({
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
        viewEngine: exphbs.create({
          extname: ".hbs",
          partialsDir: path.resolve("./views/partials/"),
          layoutsDir: path.resolve("./views/layouts/"),
          defaultLayout: false,
        }),
        viewPath: path.resolve("./views/"),
        extName: ".hbs",
      };

    

    // use a template file with nodemailer
    transporter.use("compile", hbs(handlebarOptions));

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
          path: path.resolve("public/images/logo-1.png"),
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
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
  }
};

export default sendEmail;
