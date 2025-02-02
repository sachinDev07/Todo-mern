import axios from 'axios';
import React, { useState } from 'react';

const CreateTask = (data) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addTask = async () => {
    if(title.trim() == "" && description.trim() == ""){
      alert("Input is invalid  to CreateTask")
    }    
    try {
      const token = localStorage.getItem("userToken"); // ✅ Get token from localStorage
  
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
  
      const response = await axios.post(
        `http://localhost:3000/api/todos/${data.id}`, // ✅ Correct API URL with userId
        { title, description }, // ✅ Send title & description in body
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Include token in Authorization header
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Todo Created Successfully:", response.data);
      setTitle("");
      setDescription("");
      return response.data; // ✅ Return response if needed
    } catch (error) {
      console.error("Error posting todo:", error.response?.data || error.message);
      return null;
    }
  };

  return (
    <div className='flex justify-around  py-5 mt-8 mx-6 '>
      {/* ✅ FIXED: Use onChange instead of onClick */}
      <input 
        type="text" 
        placeholder='Enter Title...' 
        className='border-[1px] border-white text-white pl-3 rounded py-2' 
        onChange={(e) => setTitle(e.target.value)} 
        value={title} // Keep input controlled
      />
      
      <input 
        type="text" 
        placeholder='Enter description....' 
        className='border-[1px] border-white text-white pl-3 rounded py-2' 
        onChange={(e) => setDescription(e.target.value)} 
        value={description} // Keep input controlled
      />
      
      {/* ✅ FIXED: onClick should be on <button>, not <span> */}
      <button 
        className='bg-green-600 text-gray-100 px-4 py-2 text-xl rounded' 
        onClick={addTask} // Correct placement
      >
        <span className='font-extrabold'>+</span> Create Task
      </button>
    </div>
  );
};

export default CreateTask;
