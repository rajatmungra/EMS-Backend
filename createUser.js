import bcrypt from 'bcrypt'

import EmployeeSchema from './models/hr_employee.js'
import { connectToDB } from "./db/db.js"

export const createUser = async () => {
    try {
        await connectToDB()
        const hashedPassword = await bcrypt.hash("admin", Number(process.env.SALT))
        const newUser = new EmployeeSchema({
            name: "Admin",
            email: "admin@ems.com",
            password: hashedPassword,
            role: 'admin'
        })
        await newUser.save()
        console.log('-------------------')
    } catch (error) {
        console.log(error)
    }
}

createUser()
