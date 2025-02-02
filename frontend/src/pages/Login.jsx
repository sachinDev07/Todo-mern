import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
      });

      // Save token or session info
      localStorage.setItem("userToken", response.data.token);
      // Cookies.set('token', response.data.token, { expires: 1 / 24 });

      // Navigate to dashboard
      navigate("/");
    } catch (err) {
      console.error("Error logging in:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <div className="h-screen flex">
      <div className="bg-[#292c31] lg:w-[50vw] lg:h-full">
        <p className="font-extrabold pt-11 pl-20 text-xl text-white">ToDoMERN</p>
        <p className="font-medium pt-18 pl-49 text-[16px] text-white">Start your journey</p>
        <p className="font-bold pt-2 pl-49 text-3xl text-white">Sign In to ToDoMERN</p>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="pt-10 flex flex-col">
            <label className="font-medium pl-49 text-xl text-white" htmlFor="email">Email</label>
            <input
              className="border-1 border-black-400 rounded w-[300px] h-10 ml-49 mt-4 text-white pl-3"
              type="email"
              placeholder="example@gmail.com"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="pt-3 flex flex-col">
            <label className="font-medium pl-49 text-xl text-white" htmlFor="password">Password</label>
            <input
              className="border-1 border-black-400 rounded w-[300px] h-10 ml-49 mt-4 text-white pl-3"
              type="password"
              placeholder="*****"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="border-1 border-green-500 rounded w-[300px] h-10 ml-49 mt-8 bg-green-500 text-white font-bold"
            type="submit"
           >
            Sign In
           </button>
        </form>
        <p className="text-white font-bold pt-18 pl-20">Don't have an account? <Link to={'/signin'} className="text-green-500" >Sign Up</Link></p>
      </div>
      <div className="lg:w-[50vw] lg:h-full bg-[url('/nature.jpg')] bg-cover bg-center">
      </div>
    </div>
  );
}
