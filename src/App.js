import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import TutorialsList from "./components/TutorialsList";

function App() {
  return (
    <div>
      <div className="container mt-3">
      <Router>

        <Routes>
          <Route exact path="/" element={<TutorialsList/>}/>
        </Routes>
    </Router>
      </div>
    </div>
  );
}

export default App;
