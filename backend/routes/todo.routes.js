const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const Todo = require('../models/todo.model.js');
const {verifyToken} = require('../jwt.js')



router.get('/todos/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user and populate the 'data' field with todo details
        const userWithTodos = await User.findById(userId).populate('data');

        if (!userWithTodos) {
            return res.status(404).json({ message: "User not found" });
          }

        res.status(200).json({
            success: true,
            message: "Todos fetched successfully",
            todos: userWithTodos.data  // Accessing populated todos
          });

    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// POST route to add a new todo for a specific user
router.post('/todos/:userId', verifyToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const { title, description } = req.body;
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Create a new todo and assign it to the user
      const newTodo = new Todo({
        title,
        description,
        user: userId
      });
  
      // Save the new todo
      await newTodo.save();
  
      // Push the todo's ID into the user's data array
      user.data.push(newTodo._id);
      await user.save();
  
      res.status(201).json({
        success: true,
        message: "Todo added successfully",
        todo: newTodo
      });
  
    } catch (error) {
      console.error("Error adding todo:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// DELETE route to remove a todo by ID for a specific user
router.delete('/todos/:userId/:todoId', async (req, res) => {
    try {
      const { userId, todoId } = req.params;
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Find the todo and check ownership
      const todo = await Todo.findOne({ _id: todoId, user: userId });
      if (!todo) {
        return res.status(404).json({ message: "Todo not found or unauthorized access" });
      }
  
      // Remove the todo from the user's data array
      user.data = user.data.filter(id => id.toString() !== todoId);
      await user.save();
  
      // Delete the todo from the database
      await Todo.findByIdAndDelete(todoId);
  
      res.status(200).json({
        success: true,
        message: "Todo deleted successfully"
      });
  
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  // PUT route to update a specific todo for a user
router.put('/todos/:userId/:todoId', async (req, res) => {
    try {
      const { userId, todoId } = req.params;
      const { title, description, isCompleted } = req.body;
  
      // Find the user to ensure they exist
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Find the todo and check ownership
      const todo = await Todo.findOne({ _id: todoId, user: userId });
      if (!todo) {
        return res.status(404).json({ message: "Todo not found or unauthorized access" });
      }
  
      // Update the todo fields
      if (title) todo.title = title;
      if (description) todo.description = description;
      if (typeof isCompleted === 'boolean') todo.isCompleted = isCompleted;
  
      await todo.save();
  
      res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        todo
      });
  
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;