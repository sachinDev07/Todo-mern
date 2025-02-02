import React, { useEffect, useState } from "react";
import Nav from "../components/navbar/Nav";
import axios from "axios";
import DisplayTask from "../components/DisplayTask";
import CreateTask from "../components/CreateTask";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      // Assuming the token is stored in localStorage or cookies
      const token = localStorage.getItem("userToken"); // Or retrieve it from cookies if stored there

      if (!token) {
        throw new Error("No token provided");
      }

      // Make an Axios GET request to the /info route, passing the token in the Authorization header
      const response = await axios.get("http://localhost:3000/user/info", {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });

      // Handle the response (user data)
      console.log("User data fetched:", response.data);
      return response.data; // Return user data for further use (e.g., updating the state)
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response?.data || error.message
      );

      // If the error is related to token expiration or authentication, navigate to the login page
      navigate("/login"); // Redirect to login page immediately

      // Handle specific error types
      if (error.response) {
        // Log server error response data
        console.error("Server Error: ", error.response.data.error);
      } else {
        // Log network or other types of error
        console.error("Error Message: ", error.message);
      }
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData();
      setUserData(data); // Set the user data in the state
    };

    getUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>; // Display loading state while fetching data
    // navigate("/login");
  }

  return (
    <div>
      <Nav />
      <div className="bg-[#292c31] min-h-[90vh] w-full">
        <p className="text-white text-3xl flex justify-center align-middle pt-7">
          Hello {userData.name}
        </p>
        <CreateTask id={userData.id} />
        <p className="text-white text-xl pl-20 pt-10">List of Your Task </p>
        <DisplayTask userId={userData.id} />
      </div>
    </div>
  );
};

export default Home;
