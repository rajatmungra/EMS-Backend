import Attendance from "../../models/hr_attendance.js";
import mongoose from "mongoose";

export const getAttendanceRecords = async (req, res) => {
    try {
      const { id } = req.params;
      if(id === undefined){
        const attendanceRecords = await Attendance.find().sort({ checkIn: -1 })
        return res.status(200).json({ success: true, attendanceRecords });
      }
      const attendanceRecords = await Attendance.find({ employee: id }).sort({ checkIn: -1 });
      return res.status(200).json({ success: true, attendanceRecords });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
};

const handleAttendance = async (employeeId, location) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new Error("Invalid employee ID");
  }

  const activeRecord = await Attendance.findOne({
    employee: employeeId,
    checkOut: { $exists: false },
  });

  if (activeRecord) {
    activeRecord.checkOut = new Date();
    await activeRecord.save();
    return { type: "checkout", record: activeRecord };
  } else {
    const newRecord = new Attendance({
      employee: employeeId,
      checkIn: new Date(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
    await newRecord.save();
    return { type: "checkin", record: newRecord };
  }
};

export const checkInOut = async (req, res) => {
  try {
    const { employee, location } = req.body;
    console.log(employee, location)
    const result = await handleAttendance(employee, location);
    const message = result.type === 'checkin' ? 'Checked In' : 'Checked Out';
    res.status(200).json({ message: `Successfully ${message}`, data: result.record });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export const getCurrentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid employee ID" });
    }

    const activeRecord = await Attendance.findOne({
      employee: id,
      checkOut: { $exists: false },
    });

    if (activeRecord) {
      return res.status(200).json({
        success: true,
        status: "checked-in",
        record: activeRecord
      });
    } else {
      return res.status(200).json({
        success: true,
        status: "checked-out"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
