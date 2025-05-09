"use client";

import "./App.css";
import "./css/navbar.css"; // Import the navbar CSS
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LearningPlanList from "./pages/LeariningPlanList";
import LearningPlanPage from "./pages/LearningPlanPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import OAuth2Callback from "./pages/OAuth2Callback";
import ErrorPage from "./pages/ErrorPage";
import NavBar from "./components/NavBar";
import WorkoutsList from "./pages/WorkoutsList";

// Protected route component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("authToken");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token is valid on app load
        // You could make an API call to validate the token here
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            <div className="App">
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/oauth2/callback"
                        element={<OAuth2Callback />}
                    />
                    <Route path="/error" element={<ErrorPage />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/learning-plans"
                        element={
                            <ProtectedRoute>
                                <LearningPlanList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/learning-plans/:id"
                        element={
                            <ProtectedRoute>
                                <LearningPlanPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* Catch-all route for 404 errors */}
                    <Route path="*" element={<ErrorPage />} />
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
