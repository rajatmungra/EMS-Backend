import Employee from '../../models/hr_employee.js'
import bcrypt from 'bcrypt'

export const employeeHandler = async (req, res) => {
    try {
        const employees = await Employee.find().select('-password').populate('department').populate('manager', '-password')
        return res.status(200).json({
            success: true,
            employees,
            message: "All employees"
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

export const newEmployeeHandler = async (req, res) =>{
    try {
        const { name, department, email, phone, avatar, password, role, manager } =
          req.body;
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
          return res.status(400).json({ message: "Email already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
        const employee = new Employee({
          name,
          department,
          email,
          phone,
          avatar,
          password: hashedPassword,
          role: 'employee',
          manager,
        });
        await employee.save();
        res.status(201).json({ message: "Employee created successfully", employee });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
}


export const updateHandler = async (req, res) =>{
    try {
        const { id, name, department, email, phone, avatar, password, role, manager } = req.body;
        const existingEmployee = await Employee.findById(id);
        if (!existingEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        if (email && email !== existingEmployee.email) {
            const emailExists = await Employee.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }
        let hashedPassword = existingEmployee.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
        }
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                name,
                department,
                email,
                phone,
                avatar,
                password: hashedPassword,
                role: 'employee',
                manager,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const employeeByEmailHandler = async(req, res)=>{
    try {
        const { email } = req.params;
        const employee = await Employee.findOne({email}).select('-password').populate('department')
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json({ employee });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const employeeByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findOne({_id: id}).select('-password').populate('department')
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json({ employee });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const deleteEmployeeByEmail = async (req, res) => {
    try {
      const { email } = req.params;
      console.log(Employee)
      const employee = await Employee.findOne({ email });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      await Employee.findOneAndDelete({ email });
      return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
