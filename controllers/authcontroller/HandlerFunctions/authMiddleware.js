import jwt from 'jsonwebtoken'
import Employee from '../../../models/hr_employee.js'

export const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ success: false, message: 'Authorization header is missing' });
        }
        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            return res.status(404).json({
                success: false,
                message: "Token Not provided"
            })
        }
        const decoded = await jwt.verify(token , process.env.JWT_KEY)
        if(!decoded){
            return res.status(404).json({
                success: false,
                message: "Token is not valid"
            })
        }

        const User = await Employee.findById(decoded.id)
        if(!User){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        req.user = User
        next()
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        })
    }
}


export const verifyHandler = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            token:  req.headers.authorization.split(' ')[1],
            role: req.user.role
        },
        message: "Token is valid"
    })
}
