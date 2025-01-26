import React, { useState, useEffect } from "react";
import IdeaForm from "../components/IdeaForm";
import NotificationPage from "./NotificationPage";

function YoursPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(null);

  const handleEditClick = (idea) => {
    setSelectedIdea(idea); // Set the selected idea for editing
    setShowPopup(true);
  };

  const fetchIdeas = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User ID not found in localStorage!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/ideas/user/${userId}`
      );
      const data = await response.json();

      if (response.ok) {
        setIdeas(data.ideas);
        setError("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Error fetching ideas:", err.message);
      setError("Error while fetching ideas.");
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div>
      <section
        id="ideas"
        className="min-h-screen bg-orange-500 flex flex-col items-center text-white"
      >
        <div>
          <h1 className="text-4xl font-bold mt-20">Your Ideas</h1>
        </div>
        <div className="flex flex-col items-center justify-center mt-6">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center"
            onClick={() => {
              setSelectedIdea(null); // Reset the selected idea for adding a new idea
              setShowPopup(true);
            }}
          >
            Add an Idea
          </button>
          <button>
            <NotificationPage />
          </button>

          {error && <p className="text-red-500 text-lg mt-4">{error}</p>}

          {ideas.length === 0 && !error ? (
            <p className="text-lg mt-4">No ideas available currently.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {ideas.map((idea) => (
                <li
                  key={idea._id}
                  className="bg-white p-4 rounded-lg shadow-md text-black w-80"
                >
                  <h2 className="text-xl font-semibold">{idea.title}</h2>
                  <p className="text-sm text-gray-600">{idea.description}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Category:</strong> {idea.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Tech Stack:</strong> {idea.techStack.join(", ")}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Status:</strong> {idea.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Owners:</strong> {idea.owners.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Collaborators:</strong>{" "}
                    {idea.collaborators.length > 0
                      ? idea.collaborators.join(", ")
                      : "None"}
                  </p>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleEditClick(idea)}
                      className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 transition"
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {showPopup && (
        <IdeaForm
          onClose={() => setShowPopup(false)}
          onIdeaAdded={fetchIdeas}
          idea={selectedIdea} // Pass the selected idea for editing
        />
      )}
    </div>
  );
}

export default YoursPage;
