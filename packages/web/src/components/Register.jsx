import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "../Axios/axios.js";
import TokenContext from "../context/TokenContext.js";

function Register() {
  const [formData, setFormData] = useState({});
  const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
  const [error, setError] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/user/register", formData);
      tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
      userDispatch({ type: "SET_USER", payload: result.data.user });
      localStorage.setItem("authToken", JSON.stringify(result.data.token));
    } catch (error) {
      console.log(error);
      setError({
        message: error.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {userToken && <Navigate to="/" />}
      <div className="flex flex-col lg:flex-row items-center bg-white rounded-xl shadow-lg p-8 max-w-6xl w-full">
        {/* Left image */}
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <img
            src="/images/register.png"
            alt="Shift registration visual"
            className="w-full h-auto rounded-md"
          />
        </div>

        {/* Right form */}
        <div className="w-full lg:w-1/2 px-4">
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
            Register for Shift Manager
          </h2>
          {error && (
            <div className="text-center border border-red-600 p-3 mb-4 rounded-md bg-red-100 text-red-700 shadow">
              {error.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
            >
              Register
            </button>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-400 font-medium text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button
              type="button"
              className="w-full bg-[#3b5998] hover:bg-[#2d4373] text-white py-3 rounded-md font-medium flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 320 512"
              >
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26..."></path>
              </svg>
              Continue with Facebook
            </button>
            <button
              type="button"
              className="w-full bg-[#55acee] hover:bg-[#2795e9] text-white py-3 rounded-md font-medium flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 512 512"
              >
                <path d="M459.37 151.716c.325 4.548.325 9.097..."></path>
              </svg>
              Continue with Twitter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
