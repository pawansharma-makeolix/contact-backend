import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import dotenv from "dotenv";
import { Resend } from "resend";
import { hasSubscribers } from "diagnostics_channel";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });app.use(cors());
app.use(express.json());

app.post("/send-mail", upload.single("resume"), async (req, res) => {
  
  const data = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
  user: process.env.EMAIL,
  pass: process.env.EMAIL_PASS,
},
    });

    // 🧠 smart detect (career vs business)
    let emailContent = "";

    if (data.companyName) {
      // ✅ Business Form
      emailContent = `
--- Business Inquiry ---

Company: ${data.companyName}
Email: ${data.businessEmail}
Phone: ${data.phone}
Project Type: ${data.projectType}
Budget: ${data.budget}
Message: ${data.message}
      `;
    } else {
      // ✅ Career Form
      emailContent = `
--- Job Application ---

Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Position: ${data.position}
Experience: ${data.experience}
Portfolio: ${data.portfolio}
Message: ${data.message}
      `;
    }

    await transporter.sendMail({
      from: `"Website Form" <${process.env.EMAIL}>`,
      to: "pawan@makeolix.com",
      subject: "New Form Submission 🚀",
      text: emailContent,
      attachments: req.file
  ? [
      {
        filename: req.file.originalname,
        path: req.file.path,
      },
    ]
  : [],
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 