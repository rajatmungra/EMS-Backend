import express from 'express'
import { authMiddleware } from '../authcontroller/HandlerFunctions/authMiddleware.js';
import { createLeaveTypeHandler, deleteLeaveTypeHandler, getAllLeaveTypesHandler, getLeaveTypeByIdHandler, updateLeaveTypeHandler } from './hr_leave_type_handler.js';

const LeaveTypeRouter = express.Router()

LeaveTypeRouter.get('/all', authMiddleware, getAllLeaveTypesHandler);
LeaveTypeRouter.get('/:id', authMiddleware, getLeaveTypeByIdHandler);
LeaveTypeRouter.post('/new', authMiddleware, createLeaveTypeHandler);
LeaveTypeRouter.put('/update', authMiddleware, updateLeaveTypeHandler);
LeaveTypeRouter.delete('/delete/:id', authMiddleware, deleteLeaveTypeHandler);

export default LeaveTypeRouter
