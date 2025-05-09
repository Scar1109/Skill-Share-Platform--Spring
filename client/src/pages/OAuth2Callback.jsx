"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

function OAuth2Callback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = searchParams.get("token");
        const userId = searchParams.get("userId");
        const firstName = searchParams.get("firstName");
        const lastName = searchParams.get("lastName");
        const email = searchParams.get("email");

        console.log("OAuth2 callback params:", {
            token,
            userId,
            firstName,
            lastName,
            email,
        });

        if (!token || !userId) {
            setError(
                "Authentication failed. Missing token or user information."
            );
            setLoading(false);
            return;
        }

        try {
            // Save auth token to localStorage
            localStorage.setItem("authToken", token);

            // Save user data to localStorage
            const userData = {
                id: userId,
                firstName,
                lastName,
                email,
            };
            localStorage.setItem("user", JSON.stringify(userData));

            console.log("Saved to localStorage:", { token, userData });

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } catch (err) {
            console.error("Error during OAuth callback:", err);
            setError("Authentication failed. Please try again.");
            setLoading(false);
        }
    }, [searchParams, navigate]);

    if (error) {
        return (
            <div
                className="oauth-callback-error"
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
                <h2>Authentication Error</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate("/login")}
                    style={{
                        backgroundColor: "#3a86ff",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}
                >
                    Return to Login
                </button>
            </div>
        );
    }

    return (
        <div
            className="oauth-callback-loading"
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
            <Loader2
                size={48}
                className="animate-spin"
                style={{ marginBottom: "20px", color: "#3a86ff" }}
            />
            <h2>Completing authentication...</h2>
            <p>Please wait while we complete your sign in.</p>
        </div>
    );
}

export default OAuth2Callback;
