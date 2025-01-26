import React, { useState, useEffect } from "react";

function IdeaForm({ onClose, onIdeaAdded, idea = null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [techStack, setTechStack] = useState("");
  const [status, setStatus] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [owners, setOwners] = useState("");

  // Populate form fields if editing an existing idea
  useEffect(() => {
    console.log("useEffect triggered. Idea value:", idea);
    if (idea) {
      setTitle(idea.title);
      setDescription(idea.description);
      setCategory(idea.category);
      setTechStack(idea.techStack.join(", "));
      setStatus(idea.status);
      setCollaborators(idea.collaborators.join(", "));
      setOwners(idea.owners.map((owner) => owner.username).join(", "));
    }
  }, [idea]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: localStorage.getItem("userId"),
      title,
      description,
      category,
      techStack: techStack.split(",").map((item) => item.trim()),
      status,
      collaborators:
        collaborators.split(",").map((item) => item.trim()) ?? "bleh",
      owners: owners.split(",").map((item) => ({ username: item.trim() })),
    };

    const url = idea
      ? `http://localhost:5000/api/ideas/update/${idea._id}` // Update an existing idea
      : "http://localhost:5000/api/ideas/add"; // Add a new idea

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("Data sent:", payload);
      const data = await response.json();

      if (response.ok) {
        console.log("Idea saved successfully:", data);
        console.log(response);
        onIdeaAdded();
        onClose();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.log(error);
      console.error("Error while saving idea:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {idea ? "Edit Your Idea" : "Add Your Idea"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!idea && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Tech Stack</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="View">View</option>
              <option value="Looking for collaborators">
                Looking for collaborators
              </option>
            </select>
          </div>
          {idea && <div className="mb-4">
            <label className="block text-sm font-medium">Collaborators</label>
            <input
              type="text"
              value={collaborators}
              onChange={(e) => setCollaborators(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>}
          {/* <div className="mb-4">
            <label className="block text-sm font-medium">Owners</label>
            <input
              type="text"
              value={owners}
              onChange={(e) => setOwners(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div> */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            {idea ? "Update" : "Add"}
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-blue-500">
          Close
        </button>
      </div>
    </div>
  );
}

export default IdeaForm;
