import Department from '../../models/hr_department.js'

export const departmentHandler = async (req, res) => {
    try {
      const departments = await Department.find();
      return res.status(200).json({
        success: true,
        departments,
        message: "All departments",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  export const newDepartmentHandler = async (req, res) => {
    try {
      const { name, avatar } = req.body;
      const existingDepartment = await Department.findOne({ name });
      if (existingDepartment) {
        return res.status(400).json({ message: "Department name already in use" });
      }
      const department = new Department({ name, avatar });
      await department.save();
      return res.status(201).json({ message: "Department created successfully", department });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  export const updateDepartmentHandler = async (req, res) => {
    try {
      const { id, name, avatar } = req.body;
      const existingDepartment = await Department.findById(id);
      if (!existingDepartment) {
        return res.status(404).json({ message: "Department not found" });
      }
      if (name && name !== existingDepartment.name) {
        const nameExists = await Department.findOne({ name });
        if (nameExists) {
          return res.status(400).json({ message: "Department name already in use" });
        }
      }
      const updatedDepartment = await Department.findByIdAndUpdate(
        id,
        { name, avatar },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ message: "Department updated successfully", department: updatedDepartment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  export const departmentByIdHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const department = await Department.findById(id);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      return res.status(200).json({ department });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };


  export const deleteDepartmentHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const department = await Department.findById(id);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      await Department.findByIdAndDelete(id);
      return res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };
