import express from 'express'
import { deleteEmployeeByEmail, employeeByEmailHandler, employeeByIdHandler, employeeHandler, newEmployeeHandler, updateHandler } from './employeeHandler.js';
import { authMiddleware } from '../authcontroller/HandlerFunctions/authMiddleware.js';

const EmployeeRouter = express.Router()

EmployeeRouter.get('/all', authMiddleware, employeeHandler);
EmployeeRouter.get('/:email', authMiddleware, employeeByEmailHandler);
EmployeeRouter.get('/id/:id', authMiddleware, employeeByIdHandler);
EmployeeRouter.post('/new', authMiddleware, newEmployeeHandler);
EmployeeRouter.put('/update', authMiddleware, updateHandler)
EmployeeRouter.delete('/delete/:email', authMiddleware, deleteEmployeeByEmail)

export default EmployeeRouter
