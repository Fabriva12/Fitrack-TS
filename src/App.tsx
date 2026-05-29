
import Register from './pages/Register'
import InstructorPage from './pages/InstructorPage'
import { Routes, Route, Link } from "react-router-dom";

function App() {

    return (
        <>
            <nav className="top-nav">
                <Link to="/">FitTrack</Link>
                <Link to="/instructor">Instructor</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/instructor" element={<InstructorPage />} />
            </Routes>
        </>
    )
}

export default App
