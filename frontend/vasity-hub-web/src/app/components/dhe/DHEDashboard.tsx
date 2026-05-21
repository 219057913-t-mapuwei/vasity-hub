import { Navigation } from "../shared/Navigation";
import { Link } from "react-router";
import { BarChart3, Users, School, GraduationCap, TrendingUp, FileText, DollarSign, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { getRevenueAnalytics } from "../../store";

const applicationsByUniversity = [
  { name: 'UCT', applications: 450 },
  { name: 'Wits', applications: 420 },
  { name: 'Stellenbosch', applications: 380 },
  { name: 'UP', applications: 350 },
];

const applicationsTrend = [
  { month: 'Jan', applications: 120 },
  { month: 'Feb', applications: 180 },
  { month: 'Mar', applications: 250 },
  { month: 'Apr', applications: 350 },
];

const acceptanceRates = [
  { name: 'Accepted', value: 45, color: '#10B981' },
  { name: 'Rejected', value: 25, color: '#EF4444' },
  { name: 'Pending', value: 30, color: '#F59E0B' },
];

const fieldDistribution = [
  { field: 'Technology', students: 320 },
  { field: 'Engineering', students: 280 },
  { field: 'Business', students: 250 },
  { field: 'Medicine', students: 180 },
  { field: 'Law', students: 150 },
];

export function DHEDashboard() {
  const revenueData = getRevenueAnalytics();

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vasity Hub Super Admin Dashboard</h1>
            <p className="text-gray-600">Department of Higher Education - Central Analytics</p>
          </div>

          {/* Revenue Metrics */}
          <div className="bg-gradient-to-r from-[#007A4D] to-[#005a39] text-white p-6 rounded-lg mb-8">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={28} />
              <h2 className="text-2xl font-bold">Revenue Analytics</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm opacity-75 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold">R{revenueData.totalRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-75 mb-1">Student Payments</p>
                <p className="text-2xl font-bold">R{revenueData.studentPayments.toLocaleString()}</p>
                <p className="text-xs opacity-75">{revenueData.paidApplications} applications</p>
              </div>
              <div>
                <p className="text-sm opacity-75 mb-1">University Billing</p>
                <p className="text-2xl font-bold">R{revenueData.universityBilling.toLocaleString()}</p>
                <p className="text-xs opacity-75">Paid invoices</p>
              </div>
              <div>
                <p className="text-sm opacity-75 mb-1">Premium Services</p>
                <p className="text-2xl font-bold">R{revenueData.premiumRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                to="/dhe/billing"
                className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 text-sm"
              >
                Manage Billing →
              </Link>
              <div className="px-4 py-2 bg-white/20 rounded-lg text-sm">
                Pending: R{revenueData.pendingBilling.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#007A4D] rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">12,450</p>
              <p className="text-xs text-green-600 mt-2">↑ 15% from last year</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#FFB612] rounded-lg flex items-center justify-center">
                  <FileText className="text-gray-900" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">1,600</p>
              <p className="text-xs text-green-600 mt-2">↑ 22% this month</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Acceptance Rate</p>
              <p className="text-3xl font-bold text-green-600">45%</p>
              <p className="text-xs text-gray-500 mt-2">720 students accepted</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <School className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Universities</p>
              <p className="text-3xl font-bold text-gray-900">26</p>
              <p className="text-xs text-gray-500 mt-2">Participating institutions</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Applications by University */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 size={24} className="text-[#007A4D]" />
                <h2 className="text-xl font-bold text-gray-900">Applications by University</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicationsByUniversity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#007A4D" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Applications Trend */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={24} className="text-[#007A4D]" />
                <h2 className="text-xl font-bold text-gray-900">Application Trends</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={applicationsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="#007A4D" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* More Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Acceptance Rates */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Application Status Distribution</h2>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={acceptanceRates}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {acceptanceRates.map((entry, index) => (
                        <Cell key={`acceptance-cell-${entry.name}-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Field Distribution */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Students by Field of Study</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fieldDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="field" type="category" stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="students" fill="#FFB612" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Management Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#007A4D] transition-colors cursor-pointer">
              <Users size={32} className="text-[#007A4D] mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">User Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage student accounts, university admins, and system users
              </p>
              <button className="text-[#007A4D] font-medium hover:underline text-sm">
                Manage Users →
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#007A4D] transition-colors cursor-pointer">
              <School size={32} className="text-[#007A4D] mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">University Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add, edit, and manage participating universities and their profiles
              </p>
              <button className="text-[#007A4D] font-medium hover:underline text-sm">
                Manage Universities →
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#007A4D] transition-colors cursor-pointer">
              <GraduationCap size={32} className="text-[#007A4D] mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Course Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure courses, APS rules, and admission requirements
              </p>
              <button className="text-[#007A4D] font-medium hover:underline text-sm">
                Manage Courses →
              </button>
            </div>
          </div>

          {/* System Configuration */}
          <div className="mt-8 bg-gradient-to-r from-[#007A4D] to-[#005a39] text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">System Configuration</h2>
            <p className="mb-6 opacity-90">
              Configure APS calculation rules, application deadlines, and system-wide settings
            </p>
            <button className="px-6 py-3 bg-[#FFB612] text-gray-900 rounded-lg font-medium hover:bg-[#e5a510]">
              Access Configuration
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
