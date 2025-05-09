"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { EyeOffIcon, EyeIcon } from "lucide-react"
import axios from "axios"
import "../css/register.css"

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default to "user"
    termsAccepted: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      })
    }
  }

  const handleUserTypeChange = (type) => {
    setFormData({
      ...formData,
      role: type,
    })
  }

  const validateForm = () => {
    const errors = {}
    let isValid = true

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    // Check if terms are accepted
    if (!formData.termsAccepted) {
      errors.termsAccepted = "You must accept the terms and conditions"
      isValid = false
    }

    // Password strength validation
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long"
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    // Required fields
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
      isValid = false
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
      isValid = false
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required"
      isValid = false
    }

    setFieldErrors(errors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Prepare user data for API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role,
        termsAccepted: formData.termsAccepted,
      }

      console.log("Sending registration data:", userData)

      // Call the register API
      const response = await axios.post("http://localhost:8080/api/users", userData)

      console.log("Registration response:", response)

      // If registration is successful, redirect to login page
      if (response.status === 201) {
        navigate("/login?registered=true")
      }
    } catch (err) {
      console.error("Registration error:", err)

      if (err.response?.data && typeof err.response.data === "object") {
        // Handle field-specific errors from the server
        if (Object.keys(err.response.data).length > 0) {
          setFieldErrors(err.response.data)
        } else {
          setError(err.response.data.message || "Registration failed. Please try again.")
        }
      } else {
        setError("Registration failed. Please check your connection and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    // Redirect to the OAuth2 authorization endpoint for Google
    window.location.href = "http://localhost:8080/oauth2/authorization/google"
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Sign up</h1>
        <p className="signup-subtitle">Enter your credentials to continue</p>

        {error && (
          <div className="error-message" style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-form-row">
            <div className="signup-input-wrapper">
              <label className="signup-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`signup-input ${fieldErrors.firstName ? "input-error" : ""}`}
                placeholder=""
                style={{ backgroundColor: "#2D2D2D", color: "white" }}
                required
              />
              {fieldErrors.firstName && (
                <div className="field-error" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {fieldErrors.firstName}
                </div>
              )}
            </div>

            <div className="signup-input-wrapper">
              <label className="signup-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`signup-input ${fieldErrors.lastName ? "input-error" : ""}`}
                placeholder=""
                style={{ backgroundColor: "#2D2D2D", color: "white" }}
                required
              />
              {fieldErrors.lastName && (
                <div className="field-error" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {fieldErrors.lastName}
                </div>
              )}
            </div>
          </div>

          <div className="signup-form-row">
            <div className="signup-input-wrapper">
              <label className="signup-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`signup-input ${fieldErrors.email ? "input-error" : ""}`}
                placeholder=""
                style={{ backgroundColor: "#2D2D2D", color: "white" }}
                required
              />
              {fieldErrors.email && (
                <div className="field-error" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {fieldErrors.email}
                </div>
              )}
            </div>

            <div className="signup-input-wrapper">
              <label className="signup-label">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`signup-input ${fieldErrors.phoneNumber ? "input-error" : ""}`}
                placeholder=""
                style={{ backgroundColor: "#2D2D2D", color: "white" }}
                required
              />
              {fieldErrors.phoneNumber && (
                <div className="field-error" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {fieldErrors.phoneNumber}
                </div>
              )}
            </div>
          </div>

          <div className="signup-input-wrapper signup-password-wrapper">
            <label className="signup-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`signup-input ${fieldErrors.password ? "input-error" : ""}`}
              placeholder=""
              style={{ backgroundColor: "#2D2D2D", color: "white" }}
              required
            />
            <button type="button" className="signup-password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
            </button>
            {fieldErrors.password && (
              <div className="field-error" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {fieldErrors.password}
              </div>
            )}
          </div>

          <div className="signup-input-wrapper signup-password-wrapper">
            <label className="signup-label">Re-enter Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`signup-input ${fieldErrors.confirmPassword ? "input-error" : ""}`}
              placeholder=""
              style={{ backgroundColor: "#2D2D2D", color: "white" }}
              required
            />
            <button
              type="button"
              className="signup-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
            </button>
            {fieldErrors.confirmPassword && (
              <div className="field-error" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {fieldErrors.confirmPassword}
              </div>
            )}
          </div>

          <div className="signup-user-type">
            <p className="signup-user-type-label">Register as:</p>
            <div className="signup-user-type-options">
              <div
                className={`signup-user-type-option ${formData.role === "user" ? "active" : ""}`}
                onClick={() => handleUserTypeChange("user")}
              >
                <div className="signup-user-type-radio">
                  <div className={`signup-user-type-radio-inner ${formData.role === "user" ? "selected" : ""}`}></div>
                </div>
                <span style={{ color: "white" }}>As a User</span>
              </div>
              <div
                className={`signup-user-type-option ${formData.role === "coach" ? "active" : ""}`}
                onClick={() => handleUserTypeChange("coach")}
              >
                <div className="signup-user-type-radio">
                  <div className={`signup-user-type-radio-inner ${formData.role === "coach" ? "selected" : ""}`}></div>
                </div>
                <span style={{ color: "white" }}>As a Trainer</span>
              </div>
            </div>
          </div>

          <div className="signup-terms-wrapper">
            <label className="signup-checkbox-container">
              <input
                type="checkbox"
                name="termsAccepted"
                className="signup-checkbox"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                required
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
            {fieldErrors.termsAccepted && (
              <div className="field-error" style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {fieldErrors.termsAccepted}
              </div>
            )}
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="signup-login-text">
            Already have an account?{" "}
            <a href="/login" className="signup-login-link">
              Login
            </a>
          </p>

          <div className="signup-divider">
            <span className="signup-divider-text">Or login with</span>
          </div>

          <div className="signup-social-buttons">
            <button type="button" className="signup-social-button signup-google" onClick={handleGoogleSignup}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
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
              <span style={{ color: "white", marginLeft: "12px" }}>Continue with Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
