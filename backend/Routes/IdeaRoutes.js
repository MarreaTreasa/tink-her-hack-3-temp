const express = require("express");
const router = express.Router();
const Idea = require("../Schemas/IdeaSchema");
const User = require("../Schemas/UserSchema");
const Notification = require("../Schemas/NotificationSchema");

// Add a new idea
router.post("/req-colab", async (req, res) => {});
router.post("/add", async (req, res) => {
  try {
    const { title, description, category, techStack, status, userId } =
      req.body;

    if (!title || !description || !category || !userId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newIdea = new Idea({
      title,
      description,
      category,
      techStack: techStack || [],
      owners: [{ username: user.username, userId }],
      collaborators: [],
      status: status || "Pending",
    });

    await newIdea.save();

    res
      .status(201)
      .json({ message: "Idea added successfully.", idea: newIdea });
  } catch (err) {
    console.error("Error while adding idea:", err);
    res.status(500).json({ message: "Server error while adding idea." });
  }
});

// Get all ideas for a specific user
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
    console.log("bsabe:", ideas);
    res.status(200).json({ message: "Ideas retrieved successfully.", ideas });
  } catch (err) {
    console.error("Error retrieving ideas:", err);
    res.status(500).json({ message: "Server error while retrieving ideas." });
  }
});

// Update an existing idea
router.post("/update/:id", async (req, res) => {
  console.log("enthenkilu");
  try {
    console.log("Body:", req.body);

    const { techStack, status, collaborators, owners } = req.body;
    console.log("Body:", req.body);
    const { id } = req.params;
    console.log(id);
    if (!id) {
      return res.status(400).json({ message: "Idea ID is required." });
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found." });
    }
    console.log("collab from front end: ", collaborators);
    // Update only the editable fields
    idea.techStack = techStack || idea.techStack;
    idea.status = status || idea.status;
    idea.collaborators = collaborators || idea.collaborators;
    idea.owners = owners || idea.owners;
    const updatedIdea = await Idea.findByIdAndUpdate(id, {
      $push: {
        collaborators: idea.collaborators,
        owners: idea.owners,
      },
    });
    res
      .status(200)
      .json({ message: "Idea updated successfully.", idea: updatedIdea });
  } catch (err) {
    console.error("Error while updating idea:", err);
    res.status(500).json({ message: "Server error while updating idea." });
  }
});
// Get ideas with the most likes
router.get("/top-liked", async (req, res) => {
  try {
    // Fetch top ideas sorted by likes in descending order
    const topIdeas = await Idea.find()
      .sort({ likes: -1 }) // Sort by likes in descending order
      .select("title techStack status likes") // Select only the fields we need
      .exec();

    res
      .status(200)
      .json({ message: "Top liked ideas retrieved.", ideas: topIdeas });
  } catch (err) {
    console.error("Error while retrieving top liked ideas:", err);
    res
      .status(500)
      .json({ message: "Server error while retrieving top liked ideas." });
  }
});
// Increment likes for an idea
router.post("/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!id || !userId) {
      return res
        .status(400)
        .json({ message: "Idea ID and User ID are required." });
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found." });
    }

    // Check if the user has already liked the idea
    if (idea.likedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this idea." });
    }
    idea.likes += 1;
    idea.likedBy.push(userId);
    await idea.save();

    res
      .status(200)
      .json({ message: "Idea liked successfully.", likes: idea.likes });
  } catch (err) {
    console.error("Error while liking idea:", err);
    res.status(500).json({ message: "Server error while liking idea." });
  }
});
// Get current likes for an idea
router.get("/likes/:id", async (req, res) => {
  try {
    const { id } = req.params; // Idea ID

    if (!id) {
      return res.status(400).json({ message: "Idea ID is required." });
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found." });
    }

    res
      .status(200)
      .json({ message: "Likes retrieved successfully.", likes: idea.likes });
  } catch (err) {
    console.error("Error while retrieving likes:", err);
    res.status(500).json({ message: "Server error while retrieving likes." });
  }
});
// Get a single idea by its ID
router.get("/ideas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!id) {
      return res.status(400).json({ message: "Idea ID is required." });
    }

    // Find the idea by its ID
    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found." });
    }
    console.log("Idea from R:", idea);

    res.status(200).json({ message: "Idea retrieved successfully.", idea });
  } catch (err) {
    console.error("Error retrieving idea:", err);
    res.status(500).json({ message: "Server error while retrieving idea." });
  }
});

//Notification
router.post("/collab/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // The ID of the user requesting collaboration

    if (!id || !userId) {
      return res
        .status(400)
        .json({ message: "Idea ID and User ID are required." });
    }

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found." });
    }

    // Update the idea status to 'requested'
    idea.status = "Requested";
    await idea.save();

    // Create a notification for the owner of the idea
    const notification = new Notification({
      ownerId: idea.owners[0].userId, // Assuming first owner is the main owner
      requesterId: userId,
      ideaId: id,
    });

    await notification.save();

    res
      .status(200)
      .json({ message: "Collaboration requested successfully.", notification });
  } catch (err) {
    console.error("Error requesting collaboration:", err);
    res
      .status(500)
      .json({ message: "Server error while requesting collaboration." });
  }
});

// Accept a collaboration request
router.post("/notifications/accept/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ideaId, requesterId } = req.body;

    if (!id || !ideaId || !requesterId) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found." });
    }

    // Add the collaborator to the idea
    idea.collaborators.push(requesterId);
    idea.status = "Accepted"; // Update status
    await idea.save();

    // Remove the notification from the database
    await Notification.findByIdAndUpdate(id, { status: "accepted" });

    res.status(200).json({ message: "Collaboration request accepted." });
  } catch (err) {
    console.error("Error accepting collaboration:", err);
    res
      .status(500)
      .json({ message: "Server error while accepting collaboration." });
  }
});

// Reject a collaboration request
router.post("/notifications/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Invalid request." });
    }

    // Mark the notification as rejected
    await Notification.findByIdAndUpdate(id, { status: "rejected" });

    res.status(200).json({ message: "Collaboration request rejected." });
  } catch (err) {
    console.error("Error rejecting collaboration:", err);
    res
      .status(500)
      .json({ message: "Server error while rejecting collaboration." });
  }
});

module.exports = router;
