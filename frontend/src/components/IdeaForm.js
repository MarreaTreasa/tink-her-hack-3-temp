import React, { useState } from "react";

function IdeaForm({ onClose, onIdeaAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [techStack, setTechStack] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      return console.error("User ID not found in localStorage!");
    }

    const userResponse = await fetch(
      `http://localhost:5000/api/users/${userId}`
    );
    const userData = await userResponse.json();

    if (!userData || !userData.username) {
      return console.error("User data not found!");
    }

    const username = userData.username;

    const payload = {
      title,
      description,
      category,
      techStack: techStack.split(",").map((item) => item.trim()),
      owners: [username],
      collaborators: [],
      userId,
    };

    try {
      const response = await fetch("http://localhost:5000/api/ideas/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Idea added successfully", data);
        onIdeaAdded();
        onClose();
      } else {
        console.log("Error:", data.message);
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error while creating idea:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Add Your Idea
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter a brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter the category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="techStack"
              className="block text-sm font-medium text-gray-700"
            >
              Tech Stack
            </label>
            <input
              type="text"
              id="techStack"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter tech stack (comma separated)"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>

        <button className="mt-4 text-blue-500 font-semibold" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default IdeaForm;
