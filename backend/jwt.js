const jwt = require('jsonwebtoken');

const generateToken = (email) => {
    return jwt.sign(
        { email },                  // Payload (user ID)
        process.env.JWT_SECRET,           // Secret key stored in .env file
        { expiresIn: "1h" }                // Token expiry time (1 hour)
    );
};

const verifyToken = (req, res, next) => {
    const token =  req.cookies.token || req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);        
         // Attach the decoded email to req.user
         req.user = {
            email: decoded.email, // Assuming the token contains the user's email in the payload
            // You can add other fields here as necessary
        };
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = {
    generateToken,
    verifyToken
}