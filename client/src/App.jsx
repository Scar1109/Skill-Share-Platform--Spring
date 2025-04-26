import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LearningPlanList from "./pages/LeariningPlanList";
import LearningPlanPage from "./pages/LearningPlanPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/learning-plans" element={<LearningPlanList />} />
                    <Route path="/learning-plans/:id" element={<LearningPlanPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
