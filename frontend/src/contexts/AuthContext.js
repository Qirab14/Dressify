import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL = "http://localhost:5000/api/users";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { user, token } = response.data;
            setUser(user);
            localStorage.setItem('user', JSON.stringify({ ...user, token }));
            return { success: true, user, token };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "Login failed" };
        }
    };

    const signup = async (username, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/register`, { username, email, password });
            const { user, token } = response.data;
            setUser(user);
            localStorage.setItem('user', JSON.stringify({ ...user, token }));
            return { success: true, user, token };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "Signup failed" };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const storedUser = localStorage.getItem('user');
            const userObject = JSON.parse(storedUser);
            const token = userObject.token;

            const response = await axios.put(`${API_URL}/profile/${userObject._id}`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify({ ...updatedUser, token }));

            return { success: true, user: updatedUser };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "Profile update failed" };
        }
    };

    const getDashboardData = async () => {
        if (!user || !user._id) return { success: false, error: "User not found" };
        try {
            const res = await axios.get(`${API_URL}/dashboard/${user._id}`);
            return { success: true, data: res.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "Dashboard fetch failed" };
        }
    };

    const askFashionChatbot = async (message) => {
        if (!message || message.trim().length < 2) {
            return { reply: "Please enter a valid question." };
        }
        try {
            const res = await axios.post(`${API_URL}/chat`, { message });
            return res.data;
        } catch (error) {
            return { reply: "Sorry, something went wrong." };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = { user, login, signup, logout, getDashboardData, updateProfile, askFashionChatbot, loading };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
