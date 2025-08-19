import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectToDB } from './db/db.js'
import authRouter from './controllers/authcontroller/authController.js'
import EmployeeRouter from './controllers/employee/employeeController.js'
import DepartmentRouter from './controllers/department/departmentController.js'
import LeaveAllocationRouter from './controllers/leave/leave_allocation_controller.js'
import LeaveTypeRouter from './controllers/leave/hr_leave_type_controller.js'
import LeaveRouter from './controllers/leave/hr_leave_controller.js'
import AttendanceRouter from './controllers/attendance/attendanceRouter.js'
import ImageRouter from './controllers/cloudinary/imageController.js'

dotenv.config()
const app = express()

app.use(
  cors({
    origin: "*",
    methods: "*",
  })
);
app.use(async (req, res, next) => {
  await connectToDB();
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use('/api/auth', authRouter)
app.use('/api/employee', EmployeeRouter)
app.use('/api/department', DepartmentRouter)
app.use('/api/leave/allocation', LeaveAllocationRouter)
app.use('/api/leave/type', LeaveTypeRouter)
app.use('/api/leave', LeaveRouter);
app.use('/api/attendance', AttendanceRouter)
app.use('/api/images', ImageRouter)


app.listen(process.env.PORT || 5000, async () => {
    console.log(`server is running on port ${process.env.PORT}`)
})
