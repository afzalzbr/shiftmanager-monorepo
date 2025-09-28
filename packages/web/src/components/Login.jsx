import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from "../Axios/axios.js";
import TokenContext from '../context/TokenContext.js';

function Login() {
    const [formData, setFormData] = useState({});
    const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
    const [error, setError] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post("/user/login", formData);
            tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
            userDispatch({ type: "SET_USER", payload: result.data.user });
            localStorage.setItem("authToken", JSON.stringify(result.data.token));
        } catch (error) {
            console.log(error);
            setError({ message: error.response?.data?.message || "Login failed" });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {userToken && <Navigate to="/" />}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg p-8 max-w-5xl w-full">
                {/* Left side image */}
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    <img
                        src="/images/landing.png"
                        alt="Shift Planning"
                        className="w-full h-auto rounded-md"
                    />
                </div>

                {/* Right side form */}
                <div className="w-full md:w-1/2 px-4">
                    <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
                        Shift Manager Login
                    </h2>
                    {error && (
                        <div className="text-center border border-red-600 p-3 mb-4 rounded-md bg-red-100 text-red-700 shadow">
                            {error.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-between items-center">
                            <Link
                                to="/forgotPassword"
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold transition"
                        >
                            Login
                        </button>
                        <p className="text-sm text-center">
                            Don't have an account?
                            <Link
                                to="/register"
                                className="text-red-500 hover:underline ml-2"
                            >
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
