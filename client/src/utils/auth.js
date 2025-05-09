// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem("authToken");
};

// Get the current user from localStorage
export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

// Logout user
export const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
};

// Get auth token
export const getAuthToken = () => {
    return localStorage.getItem("authToken");
};

// Add auth header to requests
export const getAuthHeader = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
