import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SingleIdea() {
  const { ideaID } = useParams(); // Get the idea ID from the URL params
  const [idea, setIdea] = useState(null);
  const [error, setError] = useState("");

  // Fetch the idea details
  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/ideas/ideas/${ideaID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch idea details");
        }
        const data = await response.json();
        setIdea(data.idea);
      } catch (err) {
        console.error("Error fetching idea:", err);
        setError("Failed to load idea details. Please try again.");
      }
    };

    fetchIdea();
  }, [ideaID]); // Re-fetch if the ID changes

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {idea ? (
        <div className="idea-detail mt-60 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold mb-4">{idea.title}</h1>
          <p className="mb-2">
            <strong>Description:</strong> {idea.description}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {idea.status}
          </p>
          <p className="mb-2">
            <strong>Tech Stack:</strong> {idea.techStack.join(", ")}
          </p>
          <p className="mb-2">
            <strong>Likes:</strong> {idea.likes}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
