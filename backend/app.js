const express = require('express');
require('dotenv').config();
require('./db.js')
const userRoute = require('./routes/user.routes.js')
const todoRoute = require('./routes/todo.routes.js')
const cookieParser = require('cookie-parser');
const { verifyToken } = require('./jwt.js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Use CORS
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers)
}));

app.get("/", verifyToken, (req,res) => {
    console.log(req.user.email);
    
    res.status(200).send("hello todo")
} )

app.use("/user", userRoute);
app.use("/api", verifyToken, todoRoute);

app.listen(process.env.PORT, () => {
    console.log("server is running on port : ",process.env.PORT)
})