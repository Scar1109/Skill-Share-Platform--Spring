"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../css/login.css";
import axios from "axios";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Check for error or success messages in URL parameters
        const errorParam = searchParams.get("error");
        const registeredParam = searchParams.get("registered");
        const logoutParam = searchParams.get("logout");

        if (errorParam === "true") {
            setError("Authentication failed. Please try again.");
        } else if (errorParam === "email_missing") {
            setError(
                "Email information is missing. Please try a different login method."
            );
        } else if (errorParam === "authentication_failed") {
            setError("Authentication failed. Please try again.");
        } else if (registeredParam === "true") {
            setError(
                "Registration successful! Please log in with your credentials."
            );
        } else if (logoutParam === "true") {
            setError("You have been successfully logged out.");
        }
    }, [searchParams]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRememberMeChange = () => {
        setRememberMe(!rememberMe);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Call the login API
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email,
                    password,
                }
            );

            console.log("Login response:", response);

            // Store the token and user data
            if (response.data.token) {
                // Save auth token to localStorage
                localStorage.setItem("authToken", response.data.token);

                // Save user data to localStorage
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                console.log("Saved to localStorage:", {
                    token: response.data.token,
                    user: response.data.user,
                });

                // If remember me is checked, we could set a longer expiry
                if (rememberMe) {
                    // This would be handled on the server side typically
                    console.log("Remember me is checked");
                }

                // Force a reload to ensure the navbar updates
                window.location.href = "/";
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(
                err.response?.data?.message ||
                    "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Redirect to the OAuth2 authorization endpoint for Google
        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h1 className="login-title">Hi, Welcome Back</h1>
                <p className="login-subtitle">
                    Enter your credentials to continue
                </p>

                {error && (
                    <div
                        className="error-message"
                        style={{
                            color: error.includes("successful")
                                ? "green"
                                : "red",
                            marginBottom: "15px",
                            padding: "10px",
                            borderRadius: "4px",
                            backgroundColor: error.includes("successful")
                                ? "rgba(0, 128, 0, 0.1)"
                                : "rgba(255, 0, 0, 0.1)",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <input
                            type="email"
                            value={email}
                            style={{
                                backgroundColor: "#2D2D2D",
                                color: "white",
                            }}
                            onChange={handleEmailChange}
                            placeholder="User Name"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group password-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            style={{
                                backgroundColor: "#2D2D2D",
                                color: "white",
                            }}
                            onChange={handlePasswordChange}
                            placeholder="Password"
                            className="form-input"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? (
                                <Eye className="eye-icon" />
                            ) : (
                                <EyeOff className="eye-icon" />
                            )}
                        </button>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                                className="checkbox"
                            />
                            <span className="checkbox-label">Remember me</span>
                        </label>
                        <a href="#forgot-password" className="forgot-password">
                            Forgot Password
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="signup-option">
                    <span>Don't have an account? </span>
                    <a href="/register" className="signup-link">
                        Sign up
                    </a>
                </div>

                <div className="divider">
                    <span>Or login with</span>
                </div>

                <div className="social-login">
                    <button
                        type="button"
                        className="google-login-button"
                        onClick={handleGoogleLogin}
                    >
                        <svg className="google-icon" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span style={{ color: "white" }}>
                            Continue with Google
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
