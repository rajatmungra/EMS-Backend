import express from 'express'
import { authMiddleware } from '../authcontroller/HandlerFunctions/authMiddleware.js';
import { departmentByIdHandler, departmentHandler, newDepartmentHandler, updateDepartmentHandler } from './departmentHandler.js';

const DepartmentRouter = express.Router()

DepartmentRouter.get('/all', authMiddleware, departmentHandler);
DepartmentRouter.get('/:id', authMiddleware, departmentByIdHandler);
DepartmentRouter.post('/new', authMiddleware, newDepartmentHandler);
DepartmentRouter.put('/update', authMiddleware, updateDepartmentHandler)

export default DepartmentRouter
