import jwt from "jsonwebtoken";
import User from "../models/User.js";


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"User not Authorized"});

        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId).select("-password");

        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({message:"User not authorized"})
        
        
    }


}

export default authMiddleware;