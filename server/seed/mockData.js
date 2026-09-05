// Lightweight, self-contained mock data used only when MongoDB
// is not reachable. This lets the app still be demoed (read-only)
// without a database connection.

const mockDepartments = [
  { _id: "d1", name: "Engineering", description: "Builds and maintains the product", head: "e1", employeeCount: 6, activeProjects: 3 },
  { _id: "d2", name: "Human Resources", description: "Manages people operations", head: "e7", employeeCount: 2, activeProjects: 1 },
  { _id: "d3", name: "Marketing", description: "Handles branding and growth", head: "e9", employeeCount: 2, activeProjects: 1 },
  { _id: "d4", name: "Finance", description: "Manages company finances", head: "e11", employeeCount: 2, activeProjects: 0 },
  { _id: "d5", name: "Sales", description: "Drives revenue and client relationships", head: "e13", employeeCount: 2, activeProjects: 1 },
  { _id: "d6", name: "Operations", description: "Keeps the company running smoothly", head: "e15", employeeCount: 1, activeProjects: 0 },
];

const mockEmployees = [
  { _id: "e1", employeeId: "EMP001", name: "Aarav Sharma", email: "aarav.sharma@scms.com", phone: "9876500001", department: "d1", position: "Engineering Manager", manager: null, joiningDate: "2019-03-15", employmentType: "Full-Time", salary: 145000, status: "Active", role: "Manager", avatar: "" },
  { _id: "e2", employeeId: "EMP002", name: "Priya Nair", email: "priya.nair@scms.com", phone: "9876500002", department: "d1", position: "Senior Frontend Developer", manager: "e1", joiningDate: "2020-06-01", employmentType: "Full-Time", salary: 95000, status: "Active", role: "Employee", avatar: "" },
  { _id: "e3", employeeId: "EMP003", name: "Rohan Mehta", email: "rohan.mehta@scms.com", phone: "9876500003", department: "d1", position: "Backend Developer", manager: "e1", joiningDate: "2021-01-10", employmentType: "Full-Time", salary: 88000, status: "Active", role: "Employee", avatar: "" },
  { _id: "e4", employeeId: "EMP004", name: "Ishita Verma", email: "ishita.verma@scms.com", phone: "9876500004", department: "d1", position: "QA Engineer", manager: "e1", joiningDate: "2021-08-22", employmentType: "Full-Time", salary: 72000, status: "Active", role: "Employee", avatar: "" },
  { _id: "e5", employeeId: "EMP005", name: "Kabir Singh", email: "kabir.singh@scms.com", phone: "9876500005", department: "d1", position: "DevOps Engineer", manager: "e1", joiningDate: "2022-02-14", employmentType: "Full-Time", salary: 91000, status: "On Leave", role: "Employee", avatar: "" },
  { _id: "e6", employeeId: "EMP006", name: "Sneha Reddy", email: "sneha.reddy@scms.com", phone: "9876500006", department: "d1", position: "UI/UX Designer", manager: "e1", joiningDate: "2022-09-05", employmentType: "Full-Time", salary: 78000, status: "Active", role: "Employee", avatar: "" },
  { _id: "e7", employeeId: "EMP007", name: "Neha Kapoor", email: "neha.kapoor@scms.com", phone: "9876500007", department: "d2", position: "HR Manager", manager: null, joiningDate: "2018-11-01", employmentType: "Full-Time", salary: 105000, status: "Active", role: "HR", avatar: "" },
  { _id: "e8", employeeId: "EMP008", name: "Aditya Rao", email: "aditya.rao@scms.com", phone: "9876500008", department: "d2", position: "HR Executive", manager: "e7", joiningDate: "2021-04-18", employmentType: "Full-Time", salary: 55000, status: "Active", role: "Employee", avatar: "" },
  { _id: "e9", employeeId: "EMP009", name: "Ananya Iyer", email: "ananya.iyer@scms.com", phone: "9876500009", department: "d3", position: "Marketing Manager", manager: null, joiningDate: "2019-07-09", employmentType: "Full-Time", salary: 98000, status: "Active", role: "Manager", avatar: "" },
  { _id: "e10", employeeId: "EMP010", name: "Vikram Joshi", email: "vikram.joshi@scms.com", phone: "9876500010", department: "d3", position: "Content Strategist", manager: "e9", joiningDate: "2022-05-30", employmentType: "Full-Time", salary: 62000, status: "Active", role: "Employee", avatar: "" },
  { _id: "e11", employeeId: "EMP011", name: "Meera Pillai", email: "meera.pillai@scms.com", phone: "9876500011", department: "d4", position: "Finance Manager", manager: null, joiningDate: "2018-01-20", employmentType: "Full-Time", salary: 110000, status: "Active", role: "Manager", avatar: "" },
  { _id: "e12", employeeId: "EMP012", name: "Arjun Malhotra", email: "arjun.malhotra@scms.com", phone: "9876500012", department: "d4", position: "Accountant", manager: "e11", joiningDate: "2020-10-12", employmentType: "Full-Time", salary: 60000, status: "Active", role: "Employee", avatar: "" },
  { _id: "e13", employeeId: "EMP013", name: "Divya Menon", email: "divya.menon@scms.com", phone: "9876500013", department: "d5", position: "Sales Manager", manager: null, joiningDate: "2019-12-02", employmentType: "Full-Time", salary: 100000, status: "Active", role: "Manager", avatar: "" },
  { _id: "e14", employeeId: "EMP014", name: "Karan Chopra", email: "karan.chopra@scms.com", phone: "9876500014", department: "d5", position: "Sales Executive", manager: "e13", joiningDate: "2022-03-17", employmentType: "Full-Time", salary: 58000, status: "Active", role: "Employee", avatar: "" },
  { _id: "e15", employeeId: "EMP015", name: "Ritu Desai", email: "ritu.desai@scms.com", phone: "9876500015", department: "d6", position: "Operations Lead", manager: null, joiningDate: "2020-08-25", employmentType: "Full-Time", salary: 89000, status: "Active", role: "Employee", avatar: "" },
];

const mockProjects = [
  { _id: "p1", name: "SCMS Internal Portal", projectCode: "PRJ-001", description: "Internal company management system", client: "Internal", manager: "e1", teamMembers: ["e2", "e3", "e6"], startDate: "2026-01-10", deadline: "2026-10-30", priority: "High", status: "In Progress", progress: 65 },
  { _id: "p2", name: "Mobile Banking App", projectCode: "PRJ-002", description: "Cross-platform banking application for a fintech client", client: "FinEdge Pvt Ltd", manager: "e1", teamMembers: ["e3", "e4", "e5"], startDate: "2025-11-01", deadline: "2026-09-15", priority: "High", status: "In Progress", progress: 80 },
  { _id: "p3", name: "Marketing Website Revamp", projectCode: "PRJ-003", description: "Redesign of the public marketing website", client: "Internal", manager: "e9", teamMembers: ["e6", "e10"], startDate: "2026-02-01", deadline: "2026-06-01", priority: "Medium", status: "Completed", progress: 100 },
  { _id: "p4", name: "Inventory Management System", projectCode: "PRJ-004", description: "Warehouse inventory tracking system", client: "Nimbus Logistics", manager: "e1", teamMembers: ["e2", "e4"], startDate: "2026-04-01", deadline: "2026-12-01", priority: "Medium", status: "Planning", progress: 10 },
  { _id: "p5", name: "CRM Integration", projectCode: "PRJ-005", description: "Third-party CRM integration for the sales team", client: "Internal", manager: "e13", teamMembers: ["e14"], startDate: "2026-03-15", deadline: "2026-07-30", priority: "Low", status: "On Hold", progress: 30 },
];

const mockTasks = [
  { _id: "t1", project: "p1", title: "Design dashboard UI", description: "Create dashboard wireframes and components", assignedTo: "e6", priority: "High", status: "Done", deadline: "2026-02-15" },
  { _id: "t2", project: "p1", title: "Build attendance API", description: "REST endpoints for attendance module", assignedTo: "e3", priority: "High", status: "In Progress", deadline: "2026-05-01" },
  { _id: "t3", project: "p1", title: "Implement leave approval flow", description: "HR/Manager approval workflow", assignedTo: "e2", priority: "Medium", status: "To Do", deadline: "2026-06-01" },
  { _id: "t4", project: "p2", title: "Set up CI/CD pipeline", description: "Automate build and deployment", assignedTo: "e5", priority: "High", status: "Done", deadline: "2026-01-20" },
  { _id: "t5", project: "p2", title: "Implement transaction module", description: "Core banking transaction logic", assignedTo: "e3", priority: "High", status: "In Progress", deadline: "2026-08-01" },
];

const today = new Date();
const isoDaysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const mockAttendance = [
  { _id: "a1", employee: "e1", date: isoDaysAgo(0), checkIn: "09:02", checkOut: "18:10", workingHours: 9.1, status: "Present" },
  { _id: "a2", employee: "e2", date: isoDaysAgo(0), checkIn: "09:15", checkOut: "18:05", workingHours: 8.8, status: "Late" },
  { _id: "a3", employee: "e3", date: isoDaysAgo(0), checkIn: "08:55", checkOut: "17:50", workingHours: 8.9, status: "Present" },
  { _id: "a4", employee: "e4", date: isoDaysAgo(0), checkIn: null, checkOut: null, workingHours: 0, status: "Absent" },
  { _id: "a5", employee: "e5", date: isoDaysAgo(0), checkIn: null, checkOut: null, workingHours: 0, status: "On Leave" },
  { _id: "a6", employee: "e6", date: isoDaysAgo(0), checkIn: "09:00", checkOut: "13:00", workingHours: 4, status: "Half Day" },
  { _id: "a7", employee: "e7", date: isoDaysAgo(0), checkIn: "08:50", checkOut: "17:45", workingHours: 8.9, status: "Present" },
  { _id: "a8", employee: "e8", date: isoDaysAgo(0), checkIn: "09:05", checkOut: "18:00", workingHours: 8.9, status: "Present" },
  { _id: "a9", employee: "e9", date: isoDaysAgo(0), checkIn: "09:00", checkOut: "18:00", workingHours: 9, status: "Present" },
  { _id: "a10", employee: "e10", date: isoDaysAgo(0), checkIn: "09:20", checkOut: "18:00", workingHours: 8.7, status: "Late" },
  ...Array.from({ length: 10 }).map((_, i) => ({
    _id: `a${11 + i}`,
    employee: `e${(i % 15) + 1}`,
    date: isoDaysAgo(i + 1),
    checkIn: "09:00",
    checkOut: "18:00",
    workingHours: 9,
    status: "Present",
  })),
];

const mockLeaves = [
  { _id: "l1", employee: "e5", leaveType: "Sick Leave", startDate: isoDaysAgo(0), endDate: isoDaysAgo(-2), days: 3, reason: "Fever and flu", status: "Approved" },
  { _id: "l2", employee: "e2", leaveType: "Casual Leave", startDate: isoDaysAgo(-5), endDate: isoDaysAgo(-5), days: 1, reason: "Personal work", status: "Pending" },
  { _id: "l3", employee: "e4", leaveType: "Earned Leave", startDate: isoDaysAgo(-10), endDate: isoDaysAgo(-7), days: 4, reason: "Family vacation", status: "Pending" },
  { _id: "l4", employee: "e10", leaveType: "Work From Home", startDate: isoDaysAgo(-1), endDate: isoDaysAgo(-1), days: 1, reason: "Internet installation at home", status: "Approved" },
  { _id: "l5", employee: "e14", leaveType: "Sick Leave", startDate: isoDaysAgo(-15), endDate: isoDaysAgo(-14), days: 2, reason: "Migraine", status: "Rejected" },
  { _id: "l6", employee: "e3", leaveType: "Casual Leave", startDate: isoDaysAgo(-20), endDate: isoDaysAgo(-20), days: 1, reason: "House shifting", status: "Approved" },
  { _id: "l7", employee: "e6", leaveType: "Earned Leave", startDate: isoDaysAgo(-25), endDate: isoDaysAgo(-22), days: 4, reason: "Travel", status: "Approved" },
  { _id: "l8", employee: "e8", leaveType: "Sick Leave", startDate: isoDaysAgo(-3), endDate: isoDaysAgo(-3), days: 1, reason: "Dental appointment", status: "Pending" },
  { _id: "l9", employee: "e12", leaveType: "Work From Home", startDate: isoDaysAgo(-2), endDate: isoDaysAgo(-2), days: 1, reason: "Waiting for a delivery", status: "Approved" },
  { _id: "l10", employee: "e15", leaveType: "Casual Leave", startDate: isoDaysAgo(-8), endDate: isoDaysAgo(-6), days: 3, reason: "Wedding in family", status: "Approved" },
];

const mockPayroll = mockEmployees.slice(0, 10).map((emp, i) => {
  const basicSalary = emp.salary;
  const allowances = Math.round(basicSalary * 0.15);
  const deductions = Math.round(basicSalary * 0.08);
  return {
    _id: `pay${i + 1}`,
    employee: emp._id,
    basicSalary,
    allowances,
    deductions,
    netSalary: basicSalary + allowances - deductions,
    payDate: isoDaysAgo(5),
    month: "August 2026",
    status: "Paid",
  };
});

const mockPerformance = [
  { _id: "perf1", employee: "e2", reviewCycle: "Q2 2026", score: 4.5, managerFeedback: "Consistently delivers high-quality frontend work.", strengths: ["Attention to detail", "Team collaboration"], improvements: ["Delegation"], goals: ["Mentor junior developers"], status: "Completed" },
  { _id: "perf2", employee: "e3", reviewCycle: "Q2 2026", score: 4.2, managerFeedback: "Strong backend skills, good ownership of API design.", strengths: ["Problem solving", "Code quality"], improvements: ["Documentation"], goals: ["Lead the payments module"], status: "Completed" },
  { _id: "perf3", employee: "e4", reviewCycle: "Q2 2026", score: 3.8, managerFeedback: "Solid QA coverage, needs faster turnaround.", strengths: ["Thoroughness"], improvements: ["Speed", "Automation skills"], goals: ["Learn Cypress"], status: "Completed" },
  { _id: "perf4", employee: "e5", reviewCycle: "Q2 2026", score: 4.0, managerFeedback: "Reliable infra work, improved deployment speed.", strengths: ["Reliability"], improvements: ["Communication"], goals: ["Set up monitoring dashboards"], status: "Completed" },
  { _id: "perf5", employee: "e6", reviewCycle: "Q2 2026", score: 4.7, managerFeedback: "Excellent design sense and user empathy.", strengths: ["Creativity", "User research"], improvements: ["Prototyping speed"], goals: ["Own design system"], status: "Completed" },
  { _id: "perf6", employee: "e8", reviewCycle: "Q2 2026", score: 3.9, managerFeedback: "Good progress in HR operations.", strengths: ["Organization"], improvements: ["Proactive communication"], goals: ["Improve onboarding process"], status: "Completed" },
  { _id: "perf7", employee: "e10", reviewCycle: "Q2 2026", score: 4.1, managerFeedback: "Strong content output, good SEO awareness.", strengths: ["Writing", "Creativity"], improvements: ["Analytics"], goals: ["Learn SEO tools"], status: "Completed" },
  { _id: "perf8", employee: "e14", reviewCycle: "Q2 2026", score: 3.6, managerFeedback: "Meeting targets, can improve client follow-ups.", strengths: ["Persistence"], improvements: ["Follow-up speed"], goals: ["Improve CRM hygiene"], status: "Completed" },
];

const mockAnnouncements = [
  { _id: "an1", title: "Office Maintenance Notice", description: "Water supply will be interrupted on the 3rd floor from 10 AM to 12 PM tomorrow for maintenance.", priority: "Low", date: isoDaysAgo(1), postedBy: "e7" },
  { _id: "an2", title: "New Leave Policy Update", description: "Starting next month, Work From Home requests must be submitted at least 2 days in advance.", priority: "Medium", date: isoDaysAgo(3), postedBy: "e7" },
  { _id: "an3", title: "All-Hands Team Meeting", description: "Quarterly all-hands meeting scheduled this Friday at 4 PM in the main conference room.", priority: "High", date: isoDaysAgo(2), postedBy: "e1" },
  { _id: "an4", title: "Company Holiday - Independence Day", description: "The office will remain closed on August 15th in observance of Independence Day.", priority: "Medium", date: isoDaysAgo(20), postedBy: "e7" },
  { _id: "an5", title: "New Health Insurance Partner", description: "We've partnered with a new health insurance provider offering better coverage. Details in your email.", priority: "Medium", date: isoDaysAgo(10), postedBy: "e7" },
  { _id: "an6", title: "Performance Review Cycle Begins", description: "Q2 performance review cycle starts this week. Please complete your self-assessments by Friday.", priority: "High", date: isoDaysAgo(5), postedBy: "e1" },
  { _id: "an7", title: "Parking Lot Renovation", description: "The east parking lot will be under renovation for the next two weeks. Please use the west entrance.", priority: "Low", date: isoDaysAgo(7), postedBy: "e15" },
  { _id: "an8", title: "New Employee Referral Bonus", description: "We've increased the employee referral bonus to ₹25,000 for successful hires.", priority: "Medium", date: isoDaysAgo(15), postedBy: "e7" },
  { _id: "an9", title: "Wi-Fi Upgrade Completed", description: "Office Wi-Fi infrastructure has been upgraded for better speed and reliability.", priority: "Low", date: isoDaysAgo(12), postedBy: "e15" },
  { _id: "an10", title: "Diwali Celebration Plans", description: "Join us for the annual Diwali celebration in the office cafeteria. More details to follow soon.", priority: "Medium", date: isoDaysAgo(4), postedBy: "e7" },
];

module.exports = {
  mockDepartments,
  mockEmployees,
  mockProjects,
  mockTasks,
  mockAttendance,
  mockLeaves,
  mockPayroll,
  mockPerformance,
  mockAnnouncements,
};
