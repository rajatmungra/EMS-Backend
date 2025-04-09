import express from 'express'
import { authMiddleware } from '../authcontroller/HandlerFunctions/authMiddleware.js';
import { deleteLeaveAllocationHandler, leaveAllocationByEmployee, leaveAllocationByIdHandler, leaveAllocationHandler, newLeaveAllocationHandler, updateLeaveAllocationHandler } from './leave_allocation_handler.js';

const LeaveAllocationRouter = express.Router()

LeaveAllocationRouter.get('/all', authMiddleware, leaveAllocationHandler);
LeaveAllocationRouter.get('/:id', authMiddleware, leaveAllocationByIdHandler);
LeaveAllocationRouter.get('/employee/:id', authMiddleware, leaveAllocationByEmployee);
LeaveAllocationRouter.post('/new', authMiddleware, newLeaveAllocationHandler);
LeaveAllocationRouter.put('/update', authMiddleware, updateLeaveAllocationHandler);
LeaveAllocationRouter.delete('/delete/:id', authMiddleware, deleteLeaveAllocationHandler)

export default LeaveAllocationRouter
