import express from 'express'
import { authMiddleware } from '../authcontroller/HandlerFunctions/authMiddleware.js';
import { approveLeaveHandler, createLeaveHandler, getAllLeavesHandler, getAllLeavesToApprove, getLeaveByEmployeeId, getLeaveByIdHandler, updateLeaveHandler } from './hr_leave_handler.js';

const LeaveRouter = express.Router()

LeaveRouter.get('/all', authMiddleware, getAllLeavesHandler);
LeaveRouter.get('/:id', authMiddleware, getLeaveByIdHandler);
LeaveRouter.get('/employee/:id', authMiddleware, getLeaveByEmployeeId)
LeaveRouter.post('/new', authMiddleware, createLeaveHandler);
LeaveRouter.put('/update', authMiddleware, updateLeaveHandler);
LeaveRouter.put('/approve/:leaveId', authMiddleware, approveLeaveHandler);
LeaveRouter.get('/to-approve/:id', authMiddleware, getAllLeavesToApprove)

export default LeaveRouter
