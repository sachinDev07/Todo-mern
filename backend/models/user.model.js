const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    data: [
      {
        type: mongoose.Schema.Types.ObjectId,  // Corrected schema type
        ref: 'Todo',  // Referencing Todo model
      }
    ]
  },
  { timestamps: true }
);

const user = mongoose.model('user', userSchema);

module.exports = user;