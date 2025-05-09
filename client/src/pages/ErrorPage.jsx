"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function ErrorPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(
        "An unexpected error occurred"
    );

    useEffect(() => {
        const errorType = searchParams.get("type") || "unknown";

        // Set error message based on error type
        switch (errorType) {
            case "authentication_failed":
                setErrorMessage("Authentication failed. Please try again.");
                break;
            case "email_missing":
                setErrorMessage(
                    "Email information is missing. Please try a different login method."
                );
                break;
            case "not_found":
                setErrorMessage("The page you're looking for doesn't exist.");
                break;
            default:
                setErrorMessage(
                    "An unexpected error occurred. Please try again later."
                );
        }
    }, [searchParams]);

    return (
        <div
            className="error-page-container"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "70vh",
                padding: "20px",
                textAlign: "center",
            }}
        >
            <div
                className="error-icon"
                style={{ marginBottom: "20px", color: "#ff5757" }}
            >
                <AlertTriangle size={64} />
            </div>
            <h1 style={{ marginBottom: "16px", fontSize: "24px" }}>
                Oops! Something went wrong
            </h1>
            <p
                style={{
                    marginBottom: "24px",
                    maxWidth: "500px",
                    color: "#666",
                }}
            >
                {errorMessage}
            </p>
            <div className="error-actions">
                <button
                    onClick={() => navigate("/")}
                    style={{
                        backgroundColor: "#3a86ff",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "10px",
                    }}
                >
                    Go to Home
                </button>
                <button
                    onClick={() => navigate("/login")}
                    style={{
                        backgroundColor: "transparent",
                        color: "#3a86ff",
                        border: "1px solid #3a86ff",
                        padding: "10px 20px",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}

export default ErrorPage;
