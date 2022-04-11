const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors")
require("dotenv").config();

// middlware
app.use(express.json())
app.use(cors())

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      pass: process.env.WORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
   });

transporter.verify((err, success) => {
err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

app.post("/send", function (req, res) {
    console.log(req.body)
    let mailOptions = {
      from: `${req.body.mailerState.email}`,
      to: process.env.EMAIL,
      subject: `Today I Feel – article was reported ${req.body.mailerState.article}`,
      html: `<h4>Reason: ${req.body.mailerState.value}</h4> <p>Comment: ${req.body.mailerState.message}</p>`,
    };
   
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        res.json({
            status: "Fail",
        })
      } else {
        console.log("== Message sent ==");
        res.json({ status: "success" });
      }
    });
   });


const port = 3001;
app.listen(port, () => {
 console.log(`Server is running on port: ${port}`);
});