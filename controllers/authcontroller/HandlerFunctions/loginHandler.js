import jwt from 'jsonwebtoken'
import Employee from '../../../models/hr_employee.js'
import bcrypt from 'bcrypt'

const loginHandler = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
           return res.status(404).json({
                success: false,
                message: "Improper Data"
            })
        }
        const employee = await Employee.findOne({email: email})
        if(!employee){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }
        const isMatched = await bcrypt.compare(password, employee.password)
        if(!isMatched){
            return res.status(404).json({
                success: false,
                message: "Wrong Password"
            })
        }

        const token = await jwt.sign({
            id: employee._id,
            role: employee.role
        }, process.env.JWT_KEY, {expiresIn: "10d"})

        return res.status(200).json({
            success: true,
            token: token,
            user: { id: employee._id, role: employee.role },
            message: "Loggen in Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: "Someting went wrong"
        })
    }
}

export default loginHandler
