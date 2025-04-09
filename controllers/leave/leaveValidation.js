import LeaveAllocation from '../../models/hr_leave_allocation.js';
import Leave from '../../models/hr_leave.js';

export const validateLeaveAgainstAllocation = async ({ employee, allocation, dateFrom, dateTo, leaveId = null }) => {
  const alloc = await LeaveAllocation.findOne({ _id: allocation, employee }).populate('leaveType');
  console.log(allocation, employee)
  if (!alloc) throw new Error('Leave allocation not found for employee');

  const [start, end, allocStart, allocEnd] = [
    new Date(dateFrom),
    new Date(dateTo),
    new Date(alloc.dateFrom),
    new Date(alloc.dateTo)
  ].map(d => new Date(d.setHours(0, 0, 0, 0)));

  if (start < allocStart) throw new Error('Leave starts before allocation period');
  if (end > allocEnd) throw new Error('Leave ends after allocation period');

  const requestedDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const usedDays = await getApprovedLeaveDays(employee, allocation, leaveId);

  const maxDays = alloc.totalDays;
  if (requestedDays > (maxDays - usedDays)) {
    throw new Error(`Exceeds available leave days (${maxDays - usedDays} remaining)`);
  }

  return true;
};

const getApprovedLeaveDays = async (employeeId, allocationId, excludeLeaveId) => {
  const leaves = await Leave.find({
    employee: employeeId,
    allocation: allocationId,
    _id: { $ne: excludeLeaveId }
  });

  return leaves.reduce((total, leave) => {
    const start = new Date(leave.dateFrom.setHours(0, 0, 0, 0));
    const end = new Date(leave.dateTo.setHours(0, 0, 0, 0));
    return total + (Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1);
  }, 0);
};
