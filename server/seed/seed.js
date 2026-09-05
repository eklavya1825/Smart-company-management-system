// Populates MongoDB with realistic demo company data.
// Run with: npm run seed  (from the /server folder)
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Payroll = require("../models/Payroll");
const Performance = require("../models/Performance");
const Announcement = require("../models/Announcement");

const departmentsData = [
  { name: "Engineering", description: "Builds and maintains the product" },
  { name: "Human Resources", description: "Manages people operations" },
  { name: "Marketing", description: "Handles branding and growth" },
  { name: "Finance", description: "Manages company finances" },
  { name: "Sales", description: "Drives revenue and client relationships" },
  { name: "Operations", description: "Keeps the company running smoothly" },
];

const employeesData = [
  { employeeId: "EMP001", name: "Aarav Sharma", email: "aarav.sharma@scms.com", phone: "9876500001", position: "Engineering Manager", joiningDate: "2019-03-15", employmentType: "Full-Time", salary: 145000, status: "Active", role: "Manager", dept: "Engineering" },
  { employeeId: "EMP002", name: "Priya Nair", email: "priya.nair@scms.com", phone: "9876500002", position: "Senior Frontend Developer", joiningDate: "2020-06-01", employmentType: "Full-Time", salary: 95000, status: "Active", role: "Employee", dept: "Engineering", managerId: "EMP001" },
  { employeeId: "EMP003", name: "Rohan Mehta", email: "rohan.mehta@scms.com", phone: "9876500003", position: "Backend Developer", joiningDate: "2021-01-10", employmentType: "Full-Time", salary: 88000, status: "Active", role: "Employee", dept: "Engineering", managerId: "EMP001" },
  { employeeId: "EMP004", name: "Ishita Verma", email: "ishita.verma@scms.com", phone: "9876500004", position: "QA Engineer", joiningDate: "2021-08-22", employmentType: "Full-Time", salary: 72000, status: "Active", role: "Employee", dept: "Engineering", managerId: "EMP001" },
  { employeeId: "EMP005", name: "Kabir Singh", email: "kabir.singh@scms.com", phone: "9876500005", position: "DevOps Engineer", joiningDate: "2022-02-14", employmentType: "Full-Time", salary: 91000, status: "On Leave", role: "Employee", dept: "Engineering", managerId: "EMP001" },
  { employeeId: "EMP006", name: "Sneha Reddy", email: "sneha.reddy@scms.com", phone: "9876500006", position: "UI/UX Designer", joiningDate: "2022-09-05", employmentType: "Full-Time", salary: 78000, status: "Active", role: "Employee", dept: "Engineering", managerId: "EMP001" },
  { employeeId: "EMP007", name: "Neha Kapoor", email: "neha.kapoor@scms.com", phone: "9876500007", position: "HR Manager", joiningDate: "2018-11-01", employmentType: "Full-Time", salary: 105000, status: "Active", role: "HR", dept: "Human Resources" },
  { employeeId: "EMP008", name: "Aditya Rao", email: "aditya.rao@scms.com", phone: "9876500008", position: "HR Executive", joiningDate: "2021-04-18", employmentType: "Full-Time", salary: 55000, status: "Active", role: "Employee", dept: "Human Resources", managerId: "EMP007" },
  { employeeId: "EMP009", name: "Ananya Iyer", email: "ananya.iyer@scms.com", phone: "9876500009", position: "Marketing Manager", joiningDate: "2019-07-09", employmentType: "Full-Time", salary: 98000, status: "Active", role: "Manager", dept: "Marketing" },
  { employeeId: "EMP010", name: "Vikram Joshi", email: "vikram.joshi@scms.com", phone: "9876500010", position: "Content Strategist", joiningDate: "2022-05-30", employmentType: "Full-Time", salary: 62000, status: "Active", role: "Employee", dept: "Marketing", managerId: "EMP009" },
  { employeeId: "EMP011", name: "Meera Pillai", email: "meera.pillai@scms.com", phone: "9876500011", position: "Finance Manager", joiningDate: "2018-01-20", employmentType: "Full-Time", salary: 110000, status: "Active", role: "Manager", dept: "Finance" },
  { employeeId: "EMP012", name: "Arjun Malhotra", email: "arjun.malhotra@scms.com", phone: "9876500012", position: "Accountant", joiningDate: "2020-10-12", employmentType: "Full-Time", salary: 60000, status: "Active", role: "Employee", dept: "Finance", managerId: "EMP011" },
  { employeeId: "EMP013", name: "Divya Menon", email: "divya.menon@scms.com", phone: "9876500013", position: "Sales Manager", joiningDate: "2019-12-02", employmentType: "Full-Time", salary: 100000, status: "Active", role: "Manager", dept: "Sales" },
  { employeeId: "EMP014", name: "Karan Chopra", email: "karan.chopra@scms.com", phone: "9876500014", position: "Sales Executive", joiningDate: "2022-03-17", employmentType: "Full-Time", salary: 58000, status: "Active", role: "Employee", dept: "Sales", managerId: "EMP013" },
  { employeeId: "EMP015", name: "Ritu Desai", email: "ritu.desai@scms.com", phone: "9876500015", position: "Operations Lead", joiningDate: "2020-08-25", employmentType: "Full-Time", salary: 89000, status: "Active", role: "Employee", dept: "Operations" },
];

const isoDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scms");
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Employee.deleteMany(),
      Department.deleteMany(),
      Attendance.deleteMany(),
      Leave.deleteMany(),
      Project.deleteMany(),
      Task.deleteMany(),
      Payroll.deleteMany(),
      Performance.deleteMany(),
      Announcement.deleteMany(),
    ]);
    console.log("Cleared existing collections.");

    // 1. Departments
    const deptDocs = await Department.insertMany(departmentsData);
    const deptByName = {};
    deptDocs.forEach((d) => (deptByName[d.name] = d));

    // 2. Employees (two passes: create, then link managers)
    const empDocs = [];
    for (const e of employeesData) {
      const emp = await Employee.create({
        employeeId: e.employeeId,
        name: e.name,
        email: e.email,
        phone: e.phone,
        department: deptByName[e.dept]._id,
        position: e.position,
        joiningDate: e.joiningDate,
        employmentType: e.employmentType,
        salary: e.salary,
        status: e.status,
        role: e.role,
      });
      empDocs.push(emp);
    }
    const empByCode = {};
    empDocs.forEach((e) => (empByCode[e.employeeId] = e));

    for (const e of employeesData) {
      if (e.managerId) {
        await Employee.findByIdAndUpdate(empByCode[e.employeeId]._id, {
          manager: empByCode[e.managerId]._id,
        });
      }
    }

    // Set department heads
    await Department.findByIdAndUpdate(deptByName["Engineering"]._id, { head: empByCode["EMP001"]._id });
    await Department.findByIdAndUpdate(deptByName["Human Resources"]._id, { head: empByCode["EMP007"]._id });
    await Department.findByIdAndUpdate(deptByName["Marketing"]._id, { head: empByCode["EMP009"]._id });
    await Department.findByIdAndUpdate(deptByName["Finance"]._id, { head: empByCode["EMP011"]._id });
    await Department.findByIdAndUpdate(deptByName["Sales"]._id, { head: empByCode["EMP013"]._id });
    await Department.findByIdAndUpdate(deptByName["Operations"]._id, { head: empByCode["EMP015"]._id });

    console.log(`Seeded ${empDocs.length} employees across ${deptDocs.length} departments.`);

    // 3. Users (login accounts) - includes the 4 documented demo accounts
    const hash = async (pwd) => bcrypt.hash(pwd, 10);
    await User.create([
      { name: "System Admin", email: "admin@scms.com", password: await hash("admin123"), role: "Admin" },
      { name: "Neha Kapoor", email: "hr@scms.com", password: await hash("hr123"), role: "HR", employee: empByCode["EMP007"]._id },
      { name: "Aarav Sharma", email: "manager@scms.com", password: await hash("manager123"), role: "Manager", employee: empByCode["EMP001"]._id },
      { name: "Priya Nair", email: "employee@scms.com", password: await hash("employee123"), role: "Employee", employee: empByCode["EMP002"]._id },
    ]);
    console.log("Seeded 4 demo login accounts.");

    // 4. Projects
    const projectsData = [
      { name: "SCMS Internal Portal", projectCode: "PRJ-001", description: "Internal company management system", client: "Internal", manager: "EMP001", team: ["EMP002", "EMP003", "EMP006"], startDate: "2026-01-10", deadline: "2026-10-30", priority: "High", status: "In Progress", progress: 65 },
      { name: "Mobile Banking App", projectCode: "PRJ-002", description: "Cross-platform banking application for a fintech client", client: "FinEdge Pvt Ltd", manager: "EMP001", team: ["EMP003", "EMP004", "EMP005"], startDate: "2025-11-01", deadline: "2026-09-15", priority: "High", status: "In Progress", progress: 80 },
      { name: "Marketing Website Revamp", projectCode: "PRJ-003", description: "Redesign of the public marketing website", client: "Internal", manager: "EMP009", team: ["EMP006", "EMP010"], startDate: "2026-02-01", deadline: "2026-06-01", priority: "Medium", status: "Completed", progress: 100 },
      { name: "Inventory Management System", projectCode: "PRJ-004", description: "Warehouse inventory tracking system", client: "Nimbus Logistics", manager: "EMP001", team: ["EMP002", "EMP004"], startDate: "2026-04-01", deadline: "2026-12-01", priority: "Medium", status: "Planning", progress: 10 },
      { name: "CRM Integration", projectCode: "PRJ-005", description: "Third-party CRM integration for the sales team", client: "Internal", manager: "EMP013", team: ["EMP014"], startDate: "2026-03-15", deadline: "2026-07-30", priority: "Low", status: "On Hold", progress: 30 },
    ];

    const projectDocs = [];
    for (const p of projectsData) {
      const proj = await Project.create({
        name: p.name,
        projectCode: p.projectCode,
        description: p.description,
        client: p.client,
        manager: empByCode[p.manager]._id,
        teamMembers: p.team.map((code) => empByCode[code]._id),
        startDate: p.startDate,
        deadline: p.deadline,
        priority: p.priority,
        status: p.status,
        progress: p.progress,
      });
      projectDocs.push(proj);
    }
    console.log(`Seeded ${projectDocs.length} projects.`);

    // 5. Tasks
    await Task.insertMany([
      { project: projectDocs[0]._id, title: "Design dashboard UI", description: "Create dashboard wireframes and components", assignedTo: empByCode["EMP006"]._id, priority: "High", status: "Done", deadline: "2026-02-15" },
      { project: projectDocs[0]._id, title: "Build attendance API", description: "REST endpoints for attendance module", assignedTo: empByCode["EMP003"]._id, priority: "High", status: "In Progress", deadline: "2026-05-01" },
      { project: projectDocs[0]._id, title: "Implement leave approval flow", description: "HR/Manager approval workflow", assignedTo: empByCode["EMP002"]._id, priority: "Medium", status: "To Do", deadline: "2026-06-01" },
      { project: projectDocs[1]._id, title: "Set up CI/CD pipeline", description: "Automate build and deployment", assignedTo: empByCode["EMP005"]._id, priority: "High", status: "Done", deadline: "2026-01-20" },
      { project: projectDocs[1]._id, title: "Implement transaction module", description: "Core banking transaction logic", assignedTo: empByCode["EMP003"]._id, priority: "High", status: "In Progress", deadline: "2026-08-01" },
    ]);
    console.log("Seeded tasks.");

    // 6. Attendance (last 20 records across employees/dates)
    const attendanceRecords = [];
    const statuses = ["Present", "Present", "Present", "Late", "Half Day"];
    for (let i = 0; i < 20; i++) {
      const emp = empDocs[i % empDocs.length];
      const date = isoDaysAgo(Math.floor(i / 3));
      const status = statuses[i % statuses.length];
      attendanceRecords.push({
        employee: emp._id,
        date,
        checkIn: status === "Absent" ? null : "09:0" + (i % 5),
        checkOut: status === "Absent" ? null : "18:0" + (i % 5),
        workingHours: status === "Absent" ? 0 : 8 + (i % 2),
        status,
      });
    }
    // A couple of explicit Absent/On Leave records
    attendanceRecords.push({ employee: empDocs[3]._id, date: isoDaysAgo(0), checkIn: null, checkOut: null, workingHours: 0, status: "Absent" });
    attendanceRecords.push({ employee: empDocs[4]._id, date: isoDaysAgo(0), checkIn: null, checkOut: null, workingHours: 0, status: "On Leave" });
    await Attendance.insertMany(attendanceRecords, { ordered: false }).catch(() => {
      // duplicate key errors from the unique (employee, date) index are safe to ignore in seed data
    });
    console.log("Seeded attendance records.");

    // 7. Leaves
    const leaveTypes = ["Casual Leave", "Sick Leave", "Earned Leave", "Work From Home"];
    const leaveStatuses = ["Pending", "Approved", "Approved", "Rejected"];
    const leaveDocs = [];
    for (let i = 0; i < 10; i++) {
      const emp = empDocs[(i + 2) % empDocs.length];
      const start = isoDaysAgo(i * 2);
      const end = isoDaysAgo(i * 2 - 1);
      leaveDocs.push({
        employee: emp._id,
        leaveType: leaveTypes[i % leaveTypes.length],
        startDate: start,
        endDate: end,
        days: 2,
        reason: "Personal reasons",
        status: leaveStatuses[i % leaveStatuses.length],
      });
    }
    await Leave.insertMany(leaveDocs);
    console.log("Seeded leave requests.");

    // 8. Payroll
    const payrollDocs = empDocs.slice(0, 10).map((emp) => {
      const allowances = Math.round(emp.salary * 0.15);
      const deductions = Math.round(emp.salary * 0.08);
      return {
        employee: emp._id,
        basicSalary: emp.salary,
        allowances,
        deductions,
        netSalary: emp.salary + allowances - deductions,
        payDate: isoDaysAgo(5),
        month: "August 2026",
        status: "Paid",
      };
    });
    await Payroll.insertMany(payrollDocs);
    console.log("Seeded payroll records.");

    // 9. Performance reviews
    const performanceDocs = empDocs.slice(1, 9).map((emp, i) => ({
      employee: emp._id,
      reviewCycle: "Q2 2026",
      score: (3.5 + (i % 5) * 0.3).toFixed(1),
      managerFeedback: "Consistently meets expectations with room to grow.",
      strengths: ["Reliability", "Team collaboration"],
      improvements: ["Communication"],
      goals: ["Take ownership of a larger feature"],
      status: "Completed",
    }));
    await Performance.insertMany(performanceDocs);
    console.log("Seeded performance reviews.");

    // 10. Announcements
    const announcementsData = [
      { title: "Office Maintenance Notice", description: "Water supply will be interrupted on the 3rd floor from 10 AM to 12 PM tomorrow for maintenance.", priority: "Low" },
      { title: "New Leave Policy Update", description: "Starting next month, Work From Home requests must be submitted at least 2 days in advance.", priority: "Medium" },
      { title: "All-Hands Team Meeting", description: "Quarterly all-hands meeting scheduled this Friday at 4 PM in the main conference room.", priority: "High" },
      { title: "Company Holiday - Independence Day", description: "The office will remain closed on August 15th in observance of Independence Day.", priority: "Medium" },
      { title: "New Health Insurance Partner", description: "We've partnered with a new health insurance provider offering better coverage.", priority: "Medium" },
      { title: "Performance Review Cycle Begins", description: "Q2 performance review cycle starts this week. Please complete your self-assessments by Friday.", priority: "High" },
      { title: "Parking Lot Renovation", description: "The east parking lot will be under renovation for the next two weeks.", priority: "Low" },
      { title: "New Employee Referral Bonus", description: "We've increased the employee referral bonus to ₹25,000 for successful hires.", priority: "Medium" },
      { title: "Wi-Fi Upgrade Completed", description: "Office Wi-Fi infrastructure has been upgraded for better speed and reliability.", priority: "Low" },
      { title: "Diwali Celebration Plans", description: "Join us for the annual Diwali celebration in the office cafeteria.", priority: "Medium" },
    ];
    await Announcement.insertMany(
      announcementsData.map((a, i) => ({
        ...a,
        postedBy: empByCode["EMP007"]._id,
        date: isoDaysAgo(i),
      }))
    );
    console.log("Seeded announcements.");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nDemo login accounts:");
    console.log("  Admin:    admin@scms.com / admin123");
    console.log("  HR:       hr@scms.com / hr123");
    console.log("  Manager:  manager@scms.com / manager123");
    console.log("  Employee: employee@scms.com / employee123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
