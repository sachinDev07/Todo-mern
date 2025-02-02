const mongoose = require('mongoose');

mongoose.connect("mongodb://0.0.0.0/todo-mern")
.then(() => {
    console.log("db is connected")
})
.catch((err) => {
    console.log("db connection failed : ", err)
})