import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LearningPlanList from "./pages/LeariningPlanList";
import LearningPlanPage from "./pages/LearningPlanPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import NavBar from "./components/NavBar";
import WorkoutsList from "./pages/WorkoutsList";

function App() {
    return (
        <BrowserRouter> {/* Ensure BrowserRouter wraps everything */}
            <div className="App">
                <NavBar /> {/* Include the NavBar here so it appears on all pages */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/learning-plans" element={<LearningPlanList />} />
                    <Route path="/learning-plans/:id" element={<LearningPlanPage />} />
                    <Route path="/workouts" element={<WorkoutsList />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
