import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "./card/Card";

const DisplayTask = ({ userId }) => {
  const [todoList, setTodoList] = useState([]); // Initialize with an empty array

  const fetchTodo = async () => {
    try {
      const token = localStorage.getItem("userToken"); // Retrieve token

      if (!token) {
        throw new Error("No token provided");
      }

      const response = await axios.get(
        `http://localhost:3000/api/todos/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
          },
        }
      );

      return response.data.todos; // Return only the todo array
    } catch (error) {
      console.error("Error fetching todo data:", error.response?.data || error.message);
      return []; // Return an empty array if there's an error
    }
  };

  useEffect(() => {
    const getTodoData = async () => {
      const data = await fetchTodo(); // Await the API call
      setTodoList(data); // Update state
    };

    getTodoData();
  }, []); // Re-fetch if userId changes

  return (
    <div className="flex justify-around gap-y-1 flex-wrap bg-[#292c31] mt-[-70px]">
      {todoList.length > 0 ? (
        todoList.map((todo) => (
          <Card key={todo._id} data={todo} userId={userId}/> // Use `_id` as key
        ))
      ) : (
        <p>Loading or No tasks available</p>
      )}
    </div>
  );
};

export default DisplayTask;
