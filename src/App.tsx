
import Register from './pages/Register'
import { Routes, Route } from "react-router-dom";

function App() {

    return (
        <Routes>
            <Route path="/" element={<Register />} />
        </Routes>
    )
}




export default App
