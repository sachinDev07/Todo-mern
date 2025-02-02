import React from 'react'
import './card.css'
import axios from 'axios';

const Card = ({ data, userId }) => {
  // console.log(userId);
  
  // console.log(data._id);

  const deleteTask = async (todoId) => {
    try {
      const token = localStorage.getItem("userToken"); // Retrieve the token from localStorage
  
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
  
      const response = await axios.delete(
        `http://localhost:3000/api/todos/${userId}/${todoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
  
      console.log("Todo Deleted Successfully:", response.data);
      return response.data; // Return the response if needed (e.g., to update state)
    } catch (error) {
      console.error("Error deleting todo:", error.response?.data || error.message);
      return null;
    }
  }

  const updateTask = async (todoId) => {
    try {
      const token = localStorage.getItem("userToken"); // Retrieve the token from localStorage
  
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
  
      const response = await axios.put(
        `http://localhost:3000/api/todos/${userId}/${todoId}`, // Send the request to update a specific todo
        { isCompleted: true }, // Update the isCompleted field to true
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
  
      console.log("Todo Updated Successfully:", response.data);
      return response.data; // Return the updated todo data if needed (e.g., to update the UI state)
    } catch (error) {
      console.error("Error updating todo:", error.response?.data || error.message);
      return null;
    }
  };

  return (
    <div className='container-c'>
        <p className='c-title'>{data?.title}</p>
        <p className='c-des'>{data?.description}</p>
        <div className='flex gap-3'>
          {data?.isCompleted ? <button className='Completed'>Completed</button> : <button className='Complete' onClick={() => updateTask(data._id)} >Complete</button> }
          <button className='del-btn' onClick={() => deleteTask(data._id)}>Delete</button>
        </div>

        {/* <button className='Complete'>Complete</button> 
        <button className='Completed'>Completed</button> */}
    </div>
  )
}

export default Card