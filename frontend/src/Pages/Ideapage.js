import { useNavigate } from "react-router-dom";
function IdeaPage() {
  const navigate = useNavigate();
  const handleViewYourIdeas = () => {
    navigate("/your_ideas");
  };
  return (
    <div>
      <section
        id="ideas"
        className="min-h-screen bg-orange-500 flex flex-col items-center text-white"
      >
        <div>
          <h1 className="text-4xl font-bold mt-20">Ideas</h1>
        </div>
        <div className="flex flex-col items-center justify-center flex-grow">
          <button
            onClick={handleViewYourIdeas}
            className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center"
          >
            View Your Ideas
          </button>
        </div>
      </section>
    </div>
  );
}

export default IdeaPage;
