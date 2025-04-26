import { useState } from "react";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import "../css/register.css";

function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [userType, setUserType] = useState("user") // Default to "user"

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">Sign up</h1>
                <p className="signup-subtitle">
                    Enter your credentials to continue
                </p>

                <div className="signup-form">
                    <div className="signup-form-row">
                        <div className="signup-input-wrapper">
                            <label className="signup-label">First Name</label>
                            <input
                                type="text"
                                className="signup-input"
                                placeholder=""
                                style={{ backgroundColor: "#2D2D2D", color: "white" }}
                            />
                        </div>

                        <div className="signup-input-wrapper">
                            <label className="signup-label">Last Name</label>
                            <input
                                type="text"
                                className="signup-input"
                                placeholder=""
                                style={{ backgroundColor: "#2D2D2D", color: "white" }}
                            />
                        </div>
                    </div>

                    <div className="signup-form-row">
                        <div className="signup-input-wrapper">
                            <label className="signup-label">Email</label>
                            <input
                                type="email"
                                className="signup-input"
                                placeholder=""
                                style={{ backgroundColor: "#2D2D2D", color: "white" }}
                            />
                        </div>

                        <div className="signup-input-wrapper">
                            <label className="signup-label">Phone Number</label>
                            <input
                                type="tel"
                                className="signup-input"
                                placeholder=""
                                style={{ backgroundColor: "#2D2D2D", color: "white" }}
                            />
                        </div>
                    </div>

                    <div className="signup-input-wrapper signup-password-wrapper">
                        <label className="signup-label">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="signup-input"
                            placeholder=""
                            style={{ backgroundColor: "#2D2D2D", color: "white" }}
                        />
                        <button
                            type="button"
                            className="signup-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeIcon size={20} />
                            ) : (
                                <EyeOffIcon size={20} />
                            )}
                        </button>
                    </div>

                    <div className="signup-input-wrapper signup-password-wrapper">
                        <label className="signup-label">
                            Re-enter Password
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="signup-input"
                            placeholder=""
                            style={{ backgroundColor: "#2D2D2D", color: "white" }}
                        />
                        <button
                            type="button"
                            className="signup-password-toggle"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeIcon size={20} />
                            ) : (
                                <EyeOffIcon size={20} />
                            )}
                        </button>
                    </div>

                    <div className="signup-user-type">
                        <p className="signup-user-type-label">Register as:</p>
                        <div className="signup-user-type-options">
                            <div
                                className={`signup-user-type-option ${
                                    userType === "user" ? "active" : ""
                                }`}
                                onClick={() => setUserType("user")}
                            >
                                <div className="signup-user-type-radio">
                                    <div
                                        className={`signup-user-type-radio-inner ${
                                            userType === "user"
                                                ? "selected"
                                                : ""
                                        }`}
                                    ></div>
                                </div>
                                <span>As a User</span>
                            </div>
                            <div
                                className={`signup-user-type-option ${
                                    userType === "coach" ? "active" : ""
                                }`}
                                onClick={() => setUserType("coach")}
                            >
                                <div className="signup-user-type-radio">
                                    <div
                                        className={`signup-user-type-radio-inner ${
                                            userType === "coach"
                                                ? "selected"
                                                : ""
                                        }`}
                                    ></div>
                                </div>
                                <span>As a Trainer</span>
                            </div>
                        </div>
                    </div>

                    <div className="signup-terms-wrapper">
                        <label className="signup-checkbox-container">
                            <input
                                type="checkbox"
                                className="signup-checkbox"
                                checked={agreed}
                                onChange={() => setAgreed(!agreed)}
                            />
                            <span className="signup-checkmark"></span>
                        </label>
                        <p className="signup-terms-text">
                            I agree to all the{" "}
                            <a href="/terms" className="signup-terms-link">
                                Terms
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="signup-privacy-link">
                                Privacy Policies
                            </a>
                        </p>
                    </div>

                    <button className="signup-button">Create account</button>

                    <p className="signup-login-text">
                        Already have an account?{" "}
                        <a href="/login" className="signup-login-link">
                            Login
                        </a>
                    </p>

                    <div className="signup-divider">
                        <span className="signup-divider-text">
                            Or login with
                        </span>
                    </div>

                    <div className="signup-social-buttons">
                        <button className="signup-social-button signup-google">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
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
                            <span style={{ color: "white", marginLeft:"12px" }}>Continue with Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
