const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const UserRoutes = require("./Routes/UserRoutes");
const IdeaRoutes = require("./Routes/IdeaRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Local MongoDB connection string
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB locally
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Idea Platform Backend API");
});

// Include User Routes for authentication
app.use("/api/users", UserRoutes);
app.use("/api/ideas", IdeaRoutes);

// Add additional routes for Ideas, Collaborators, etc., as needed

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
