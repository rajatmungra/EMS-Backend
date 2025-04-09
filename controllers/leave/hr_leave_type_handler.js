import LeaveType from "../../models/hr_leave_type.js";

export const getAllLeaveTypesHandler = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find();
    return res.status(200).json({
      success: true,
      leaveTypes,
      message: "All leave types",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createLeaveTypeHandler = async (req, res) => {
  try {
    const { name, approval_required } = req.body;
    console.log(name)

    const existingLeaveType = await LeaveType.findOne({ name });
    if (existingLeaveType) {
      return res.status(400).json({ message: "Leave type already exists" });
    }

    const leaveType = new LeaveType({ name, approval_required });
    await leaveType.save();

    return res.status(201).json({ message: "Leave type created successfully", leaveType });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateLeaveTypeHandler = async (req, res) => {
  try {
    const { id, name, approval_required } = req.body;

    const existingLeaveType = await LeaveType.findById(id);
    if (!existingLeaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    const duplicateLeaveType = await LeaveType.findOne({ name, _id: { $ne: id } });
    if (duplicateLeaveType) {
      return res.status(400).json({ message: "Leave type name already exists" });
    }

    const updatedLeaveType = await LeaveType.findByIdAndUpdate(
      id,
      { name, approval_required },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: "Leave type updated successfully", leaveType: updatedLeaveType });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getLeaveTypeByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveType = await LeaveType.findById(id);

    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    return res.status(200).json({ leaveType });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteLeaveTypeHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveType = await LeaveType.findById(id);

    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    await LeaveType.findByIdAndDelete(id);
    return res.status(200).json({ message: "Leave type deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
