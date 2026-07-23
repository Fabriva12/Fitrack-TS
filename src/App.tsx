import { useEffect } from "react";
import Register from './pages/Register'
import InstructorPage from './pages/InstructorPage'
import Dashboard from './pages/Dashboard'
import { Routes, Route, Link } from "react-router-dom";
import { initDemoData } from "./store";

function App() {
  useEffect(() => {
    initDemoData();
  }, []);

  return (
    <>
      <nav className="top-nav">
        <Link to="/">FitTrack</Link>
        <Link to="/register">Registro</Link>
        <Link to="/instructor">Instructor</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/instructor" element={<InstructorPage />} />
      </Routes>
    </>
  )
}

export default App
