const express = require("express");
const router = express.Router();
const Idea = require("../Schemas/IdeaSchema");
const User = require("../Schemas/UserSchema");

router.post("/add", async (req, res) => {
  try {
    const { title, description, category, techStack, status, userId } =
      req.body;
    if (!title || !description || !category || !userId) {
      if (!userId) {
        return res.status(400).json({ message: "User req" });
      }
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user exists
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newIdea = new Idea({
      title,
      description,
      category,
      techStack: techStack || [], // Default to an empty array if not provided
      owners: [{ username: user.username, userId }], // Add the user as the initial owner
      collaborators: [], // No collaborators initially
      status: status || "View", // Default status to "View" if not provided
    });

    await newIdea.save();

    res.status(201).json({
      message: "Idea added successfully.",
      idea: newIdea,
    });
  } catch (err) {
    console.error("Error while adding idea:", err);
    res.status(500).json({ message: "Server error while adding idea." });
  }
});
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const ideas = await Idea.find({ "owners.userId": userId });

    if (!ideas || ideas.length === 0) {
      return res.status(404).json({ message: "No ideas found for this user." });
    }

    res.status(200).json({ message: "Ideas retrieved successfully.", ideas });
  } catch (err) {
    console.error("Error retrieving ideas:", err);
    res.status(500).json({ message: "Server error while retrieving ideas." });
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    const { techStack, status } = req.body;
    const { id } = req.params; // Getting the idea's ID from the route parameter

    if (!id) {
      return res.status(400).json({ message: "Idea ID is required." });
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found." });
    }

    // Update the idea fields (only the fields that are provided)
    idea.techStack = techStack || idea.techStack;
    idea.status = status || idea.status;

    // Save the updated idea
    const updatedIdea = await idea.save();

    res.status(200).json({
      message: "Idea updated successfully.",
      idea: updatedIdea,
    });
  } catch (err) {
    console.error("Error while updating idea:", err);
    res.status(500).json({ message: "Server error while updating idea." });
  }
});

module.exports = router;
