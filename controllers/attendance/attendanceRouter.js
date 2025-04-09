import express from 'express'
import { authMiddleware } from '../authcontroller/HandlerFunctions/authMiddleware.js';
import { checkInOut, getAttendanceRecords, getCurrentStatus } from './attendanceHandler.js';

const AttendanceRouter = express.Router()

AttendanceRouter.get('/all', authMiddleware, getAttendanceRecords);
AttendanceRouter.post('/checkinout', authMiddleware, checkInOut);
AttendanceRouter.get('/employee/:id', authMiddleware, getAttendanceRecords)
AttendanceRouter.get('/status/:id', authMiddleware, getCurrentStatus)

export default AttendanceRouter
