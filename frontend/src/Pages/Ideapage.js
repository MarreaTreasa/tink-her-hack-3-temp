import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import NotificationsPage from "./NotificationPage";

function IdeaPage() {
  const navigate = useNavigate();
  const [topIdeas, setTopIdeas] = useState([]);
  const [error, setError] = useState("");

  // Fetch top liked ideas on load
  useEffect(() => {
    const fetchTopLikedIdeas = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URI}/api/ideas/top-liked`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch top-liked ideas");
        }
        const data = await response.json();
        console.log("top liked: ", data);
        setTopIdeas(data.ideas);
      } catch (err) {
        console.error("Error fetching top-liked ideas:", err);
        setError("Failed to load top-liked ideas. Please try again.");
      }
    };

    fetchTopLikedIdeas();
  }, []);

  // Function to handle like button click
  const handleLike = async (ideaId, index) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URI}/api/ideas/like/${ideaId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: "currentUserId" }), // Replace with actual user ID
        }
      );
      if (!response.ok) {
        throw new Error("Failed to like the idea");
      }
      const data = await response.json();

      // Update the likes in the UI
      const updatedIdeas = [...topIdeas];
      updatedIdeas[index].likes = data.likes;
      setTopIdeas(updatedIdeas);
    } catch (err) {
      console.error("Error liking the idea:", err);
      setError("Failed to update likes. Please try again.");
    }
  };

  const handleViewIdea = (ideaId) => {
    // Navigate to a new page for the detailed view of the idea
    navigate(`/ideas/${ideaId}`);
  };

  const handleViewYourIdeas = () => {
    navigate("/your_ideas");
  };

  return (
    <div>
      <section
        id="ideas"
        className="min-h-screen bg-orange-500 flex flex-col items-center text-white relative py-4"
      >
        <div>
          <h1 className="text-4xl font-bold mt-5 mb-10">Top Liked Ideas</h1>
        </div>

        {/* Display Top-Liked Ideas */}
        <div className="w-full px-10">
          {error && <p className="text-red-500">{error}</p>}
          {topIdeas.length > 0 ? (
            <ul className="space-y-4 max-h-[35rem] overflow-y-auto">
              {topIdeas.map((idea, index) => (
                <li
                  key={idea._id}
                  className="bg-white text-black p-4 rounded-lg shadow-md relative"
                >
                  <h3 className="text-xl font-semibold">{idea.title}</h3>
                  <p className="mt-2">{idea.description}</p>{" "}
                  {/* Display description */}
                  <div className="flex gap-1">
                    {idea.techStack.map((stack, idx) => (
                      <p key={idx}>{stack}</p>
                    ))}
                  </div>
                  <p className="mt-3 font-semibold">{idea.status}</p>
                  <p className="mt-2 font-medium flex items-center ">
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleLike(idea._id, index)}
                    >
                      <FaHeart className="text-red-500 mr-2" />
                      <span className="text-blue-500">{idea.likes}</span>
                    </button>
                  </p>
                  {/* View button for each idea (aligned to the right) */}
                  {idea.status === "Looking for collaborators" && (
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center absolute bottom-6 right-24">
                      Collabu
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleViewIdea(idea._id);
                      console.log("idea id:", idea._id);
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center absolute bottom-6 right-6"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !error && <p className="text-gray-300">No ideas found.</p>
          )}
        </div>

        <button
          onClick={handleViewYourIdeas}
          className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center absolute bottom-6 right-6"
        >
          View Your Ideas
        </button>
      </section>
    </div>
  );
}

export default IdeaPage;
