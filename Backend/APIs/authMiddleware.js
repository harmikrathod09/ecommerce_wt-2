import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Correct key usage
        req.user = decoded; // Ensures `req.user` holds user data
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;
