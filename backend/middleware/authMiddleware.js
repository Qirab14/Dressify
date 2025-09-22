
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 

/**
 * Middleware function to authenticate a JWT from the 'Authorization' header.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
const authenticateToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        console.error("Authentication Failed: No token provided.");
        return res.status(401).json({ error: "Access Denied. No token provided." });
    }

    try {

        
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token Verified. Decoded Payload:", decoded);

        
        const user = await User.findById(decoded.id).select("-password");
        

        if (!user) {
            console.error("Authentication Failed: User not found with ID from token.");
            return res.status(404).json({ error: "User not found." });
        }

       

        req.user = user;
        next();
    } catch (err) {

        
        console.error("JWT Verification Failed:", err.message);
        res.status(403).json({ error: "Invalid or expired token. Please log in again." });
    }
};

module.exports = authenticateToken;
