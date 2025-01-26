import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./MainPage";
import AuthPage from "./Pages/AuthPage";
import YoursPage from "./Pages/YoursPage";
import SingleIdea from "./Pages/SingleIdea";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/your_ideas" element={<YoursPage />} />
        <Route
          path="/auth"
          element={<AuthPage setShowPopup={() => {}} />}
        />{" "}
        <Route path="/ideas/:ideaID" element={<SingleIdea />} />
      </Routes>
    </div>
  );
}

export default App;
