import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// ✅ Memory storage - Render pe zaroori hai
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: "https://makeolix.vercel.app"
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Server running ✅" });
});

app.post("/send-mail", upload.single("resume"), async (req, res) => {
  const data = req.body;

  console.log("formType received:", data.formType); // debug ke liye
  console.log("file received:", req.file ? req.file.originalname : "no file");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    let emailContent = "";
    let subject = "";

    // ✅ formType se detect karo - companyName se nahi
    if (data.formType === "business") {
      subject = "New Business Inquiry 💼";
      emailContent = `
--- Business Inquiry ---

Company:      ${data.companyName}
Email:        ${data.businessEmail}
Phone:        ${data.phone}
Project Type: ${data.projectType}
Budget:       ${data.budget}
Message:      ${data.message}
      `;
    } else {
      subject = "New Job Application 🧑‍💻";
      emailContent = `
--- Job Application ---

Name:       ${data.fullName}
Email:      ${data.email}
Phone:      ${data.phone}
Position:   ${data.position}
Experience: ${data.experience}
Portfolio:  ${data.portfolio}
Message:    ${data.message}
      `;
    }

    await transporter.sendMail({
      from: `"Makeolix Website" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: subject,
      text: emailContent,
      // ✅ buffer use karo - path nahi
      attachments: req.file
        ? [{
            filename: req.file.originalname,
            content: req.file.buffer,
          }]
        : [],
    });

    res.json({ success: true });

  } catch (error) {
    console.error("Mail error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
const https = require("https");

setInterval(() => {
  https.get("https://contact-backend-khx3.onrender.com/", (res) => {
    console.log("Server jaag raha hai ✅", res.statusCode);
  }).on("error", (err) => {
    console.log("Ping error:", err.message);
  });
}, 5 * 60 * 1000); 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




