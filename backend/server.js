const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middleware/auth");
const router = express.Router();

// for newsletter
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// SMTP configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP server
  port: 465, // Standard port for SMTP
  secure: true, // Use true for port 465, false for other ports
  auth: {
    user: "sustainsmart824@gmail.com", // Replace with your email
    pass: "okqjqbmgrlxviaze", // Replace with your email password
  },
});

app.post("/send-newsletter", async (req, res) => {
  const { recipients, subject, text, html } = req.body;

  // Verify that the recipient (email) is provided
  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ error: "Email is required" });
  }

  // If subject or text is not provided, set default values for the subscription confirmation
  const mailOptions = {
    from: "sustainsmart824@gmail.com", // Sender address
    to: recipients.join(","), // Recipient's email address
    subject: subject || "Subscription Confirmation", // Default subject if not provided
    text: text || "Thank you for subscribing to our newsletter!", // Default text
    html:
      html ||
      `
          <p>Thank you for subscribing to the Sustain Smart newsletter!</p>
          <p>We're excited to have you on board as we work together to reduce food waste, save money, and create a smarter, more sustainable kitchen.</p>
          <p>Stay tuned for updates, tips, and features that will help you make the most of your kitchen and reduce your environmental footprint!</p>
          <p>Cheers,<br/>
          The Sustain Smart Team</p>
      `, // Default HTML content
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Done!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed!" });
  }
});

// MongoDB Connection (using environment variables)
const mongoURI =
  "mongodb+srv://katalvasudha26:password26@cluster0.md9ls.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/auth");
const foodRoutes = require("./routes/food");
const postsRoutes = require("./routes/posts");

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/posts", postsRoutes);

router.get("/protected", auth, (req, res) => {
  res.json({ msg: "You have access to this protected route", user: req.user });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
