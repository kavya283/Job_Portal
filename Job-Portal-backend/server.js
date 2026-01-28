require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // Added to handle directory checks
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const passport = require("passport");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const employerRoutes = require("./routes/employerRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
require("./config/passport");

// 1. Ensure Uploads Folder Exists (Prevents "Directory not found" errors)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 2. CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Use env variable if available
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

// 3. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// 4. Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 5. Socket.IO Setup
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    methods: ["GET", "POST"] 
  } 
});

// Make io accessible in our routes/controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);
  
  // Custom room for employers (optional, but good for targeted notifications)
  socket.on("join-employer-room", (employerId) => {
    socket.join(employerId);
    console.log(`Employer joined room: ${employerId}`);
  });

  socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
});

// 6. Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/employer/profile", employerRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/applications", applicationRoutes);

// 7. Global Error Handler (Optional but highly recommended for 500 errors)
app.use((err, req, res, next) => {
  console.error("Server Error Stack:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server!", error: err.message });
});

// 8. Database and Server Start
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }
    await connectDB();
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("Critical Server Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();