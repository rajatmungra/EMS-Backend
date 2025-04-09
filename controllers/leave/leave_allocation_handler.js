import LeaveAllocation from "../../models/hr_leave_allocation.js";

const calculateDays = (from, to) => {
  return Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1;
};

export const leaveAllocationHandler = async (req, res) => {
  try {
    const leaveAllocations = await LeaveAllocation.find()
      .populate('employee', '-password')
      .populate('leaveType');
    return res.status(200).json({
      success: true,
      leaveAllocations,
      message: "All leave allocations",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const newLeaveAllocationHandler = async (req, res) => {
  try {
    const { name, employee, leaveType, dateFrom, dateTo, totalDays } = req.body;
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    if (isNaN(fromDate) || isNaN(toDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (fromDate > toDate) {
      return res.status(400).json({ message: "dateFrom must be before dateTo" });
    }

    const existingLeave = await LeaveAllocation.findOne({
      employee,
      leaveType,
      dateFrom: { $lte: toDate },
      dateTo: { $gte: fromDate },
    });

    if (existingLeave) {
      return res.status(400).json({ message: "Leave already allocated for this period" });
    }

    const leaveAllocation = new LeaveAllocation({
      name,
      employee,
      leaveType,
      dateFrom: fromDate,
      dateTo: toDate,
      totalDays,
      usedDays: 0
    });

    await leaveAllocation.save();
    const populatedLeave = await LeaveAllocation.findById(leaveAllocation._id)
      .populate("employee", "-password")
      .populate("leaveType");

    return res.status(201).json({
      message: "Leave allocated successfully",
      leaveAllocation: populatedLeave
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateLeaveAllocationHandler = async (req, res) => {
  try {
    const { id, name, employee, leaveType, dateFrom, dateTo, totalDays } = req.body;
    const existingLeave = await LeaveAllocation.findById(id);

    if (!existingLeave) {
      return res.status(404).json({ message: "Leave allocation not found" });
    }

    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    if (isNaN(fromDate) || isNaN(toDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (fromDate > toDate) {
      return res.status(400).json({ message: "dateFrom must be before dateTo" });
    }

    const overlappingLeave = await LeaveAllocation.findOne({
      _id: { $ne: id },
      employee,
      leaveType,
      dateFrom: { $lte: toDate },
      dateTo: { $gte: fromDate },
    });

    if (overlappingLeave) {
      return res.status(400).json({ message: "Leave already allocated for this period" });
    }

    const updatedLeave = await LeaveAllocation.findByIdAndUpdate(
      id,
      { name, employee, leaveType, dateFrom: fromDate, dateTo: toDate, totalDays },
      { new: true, runValidators: true }
    ).populate("employee", "-password")
     .populate("leaveType");

    return res.status(200).json({ 
      message: "Leave allocation updated successfully", 
      leaveAllocation: updatedLeave 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const leaveAllocationByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveAllocation = await LeaveAllocation.findById(id);

    if (!leaveAllocation) {
      return res.status(404).json({ message: "Leave allocation not found" });
    }

    return res.status(200).json({ leaveAllocation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteLeaveAllocationHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveAllocation = await LeaveAllocation.findById(id);

    if (!leaveAllocation) {
      return res.status(404).json({ message: "Leave allocation not found" });
    }

    await LeaveAllocation.findByIdAndDelete(id);
    return res.status(200).json({ message: "Leave allocation deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const leaveAllocationByEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveAllocations = await LeaveAllocation.find({employee: id})
    .populate('employee', '-password')
    .populate('leaveType');

    return res.status(200).json({ leaveAllocations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
