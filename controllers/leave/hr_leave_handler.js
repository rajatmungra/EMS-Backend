import { validateLeaveAgainstAllocation } from './leaveValidation.js';
import Leave from '../../models/hr_leave.js';
import Employee from '../../models/hr_employee.js'

export const getAllLeavesHandler = async (req, res) => {
    try {
        const leaves = await Leave.find().populate("employee allocation");
        return res.status(200).json({
            success: true,
            leaves,
            message: "All leave records retrieved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const createLeaveHandler = async (req, res) => {
    try {
        const { employee, allocation, dateFrom, dateTo, description, approver } = req.body;

        const overlappingLeave = await Leave.findOne({
            employee,
            dateFrom: { $lte: dateTo },
            dateTo: { $gte: dateFrom },
        });
        if (overlappingLeave) {
            return res.status(400).json({ message: "Leave already applied for this period" });
        }

        await validateLeaveAgainstAllocation({ employee, allocation, dateFrom, dateTo });

        const leave = new Leave({ employee, allocation, dateFrom, dateTo, description, approver });
        await leave.save();
        return res.status(201).json({
            message: "Leave request created successfully",
            leave
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error.message || "Server error"
        });
    }
};

export const updateLeaveHandler = async (req, res) => {
    try {
        const { id, employee, allocation, dateFrom, dateTo, status, description, approver } = req.body;
        const leave = await Leave.findById(id);
        if (!leave) {
            return res.status(404).json({ message: "Leave request not found" });
        }
        const overlappingLeave = await Leave.findOne({
            _id: { $ne: id },
            employee,
            dateFrom: { $lte: dateTo },
            dateTo: { $gte: dateFrom },
        });
        if (overlappingLeave) {
            return res.status(400).json({ message: "Leave already applied for this period" });
        }

        await validateLeaveAgainstAllocation({
            _id: id,
            employee,
            allocation,
            dateFrom,
            dateTo
        });

        leave.employee = employee;
        leave.allocation = allocation;
        leave.dateFrom = dateFrom;
        leave.dateTo = dateTo;
        leave.status = status;
        leave.description = description;
        leave.approver = approver;
        await leave.save();
        return res.status(200).json({
            message: "Leave request updated successfully",
            leave
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error.message || "Server error"
        });
    }
};

export const getLeaveByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const leave = await Leave.findById(id).populate("employee allocation approver");

        if (!leave) {
            return res.status(404).json({ message: "Leave request not found" });
        }
        return res.status(200).json({ leave });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteLeaveHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const leave = await Leave.findById(id);
        if (!leave) {
            return res.status(404).json({ message: "Leave request not found" });
        }
        await Leave.findByIdAndDelete(id);
        return res.status(200).json({ message: "Leave request deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const approveLeaveHandler = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body
    console.log(status)
    if(status != 'approved' && status != 'refused') {
        return res.status(404).json({ message: "Status should be either approved or refused" })
    }
    const leave = await Leave.findById(leaveId).populate('employee');
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    const employee = leave.employee;

    if (!employee.manager || employee.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to approve this leave" });
    }

    leave.status = status;
    await leave.save();

    return res.status(200).json({
      message: `Leave request ${status} successfully`,
      leave,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getLeaveByEmployeeId = async (req, res) => {
    try {
        const { id } = req.params;
        const leaves = await Leave.find({employee: id}).populate("employee allocation approver");
        console.log(leaves)

        return res.status(200).json({ leaves });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const getAllLeavesToApprove = async (req, res) =>{
    try {
        const {id} = req.params;
        console.log(id)
        const employees = await Employee.find({ manager: id }).select('_id');
        const employeeIds = employees.map(emp => emp._id);
        const leaves = await Leave.find({ employee: { $in: employeeIds } })
          .populate('employee')
          .populate('allocation')
          .sort({ createdAt: -1 });
        return res.status(200).json({
          success: true,
          leaves,
          message: "Leaves awaiting your approval",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
}
