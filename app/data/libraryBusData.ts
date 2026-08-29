/**
 * Library Bus Management System — Chart & Table Data
 * Extracted from LibraryBusProject.tsx for separation of concerns.
 */

// Weekly Borrow vs Return mock telemetry data from Django DailyStats
export const weeklyActivityData = [
  { day: 'T2', borrows: 142, returns: 120, activeUsers: 84 },
  { day: 'T3', borrows: 158, returns: 140, activeUsers: 92 },
  { day: 'T4', borrows: 151, returns: 138, activeUsers: 89 },
  { day: 'T5', borrows: 176, returns: 150, activeUsers: 104 },
  { day: 'T6', borrows: 190, returns: 171, activeUsers: 118 },
  { day: 'T7', borrows: 168, returns: 160, activeUsers: 98 },
  { day: 'CN', borrows: 199, returns: 182, activeUsers: 125 },
];

// Bus fleet performance comparison from BusAnalytics
export const busFleetData = [
  { name: 'Bus 01 (Cầu Giấy)', borrows: 312, visits: 340, efficiency: 91.8, status: 'Đang chạy' },
  { name: 'Bus 02 (Đống Đa)', borrows: 284, visits: 310, efficiency: 91.6, status: 'Đang chạy' },
  { name: 'Bus 03 (Hà Đông)', borrows: 245, visits: 280, efficiency: 87.5, status: 'Đang chạy' },
  { name: 'Bus 04 (Hai Bà Trưng)', borrows: 198, visits: 230, efficiency: 86.1, status: 'Đang chạy' },
  { name: 'Bus 05 (Thanh Xuân)', borrows: 155, visits: 190, efficiency: 81.6, status: 'Đang chạy' },
  { name: 'Bus 06 (Tây Hồ)', borrows: 90, visits: 130, efficiency: 69.2, status: 'Tạm nghỉ' },
];
