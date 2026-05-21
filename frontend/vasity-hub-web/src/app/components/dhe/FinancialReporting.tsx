import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { getRevenueAnalytics, getAllPayments, universityBillings } from "../../store";
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function FinancialReporting() {
  const [dateRange, setDateRange] = useState('all');
  const [universityFilter, setUniversityFilter] = useState('all');
  const [paymentType, setPaymentType] = useState('all');

  const analytics = getRevenueAnalytics();
  const allPayments = getAllPayments();

  // Mock monthly revenue data
  const monthlyRevenue = [
    { month: 'Jan', student: 15000, university: 25000, premium: 3000 },
    { month: 'Feb', student: 18000, university: 28000, premium: 4500 },
    { month: 'Mar', student: 22000, university: 30000, premium: 6000 },
    { month: 'Apr', student: 25000, university: 32000, premium: 7500 },
  ];

  // Revenue breakdown
  const revenueBreakdown = [
    { name: 'Student Payments', value: analytics.studentPayments, color: '#007A4D' },
    { name: 'University Billing', value: analytics.universityBilling, color: '#FFB612' },
    { name: 'Premium Services', value: analytics.premiumRevenue, color: '#10B981' },
  ];

  // Payment methods
  const paymentMethods = [
    { name: 'Credit Card', value: allPayments.filter(p => p.method === 'card' && p.status === 'paid').length, color: '#3B82F6' },
    { name: 'EFT', value: allPayments.filter(p => p.method === 'eft' && p.status === 'paid').length, color: '#8B5CF6' },
  ];

  // Universities
  const uniqueUniversities = [...new Set(universityBillings.map(b => b.universityName))];

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reporting</h1>
                <p className="text-gray-600">Comprehensive revenue analytics and insights</p>
              </div>
              <button
                onClick={() => alert('Exporting report...\n\nIn a real system, this would download a comprehensive PDF report.')}
                className="px-6 py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39] flex items-center gap-2"
              >
                <Download size={20} />
                Export Report
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University
                </label>
                <select
                  value={universityFilter}
                  onChange={(e) => setUniversityFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                >
                  <option value="all">All Universities</option>
                  {uniqueUniversities.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="student">Student Payments</option>
                  <option value="university">University Billing</option>
                  <option value="premium">Premium Services</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-[#007A4D] rounded-lg flex items-center justify-center">
                  <DollarSign className="text-white" size={24} />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp size={16} />
                  <span>+12%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">R{analytics.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">All time earnings</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-white" size={24} />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp size={16} />
                  <span>+8%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Student Payments</p>
              <p className="text-3xl font-bold text-green-600">R{analytics.studentPayments.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">{analytics.paidApplications} applications</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-[#FFB612] rounded-lg flex items-center justify-center">
                  <DollarSign className="text-gray-900" size={24} />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp size={16} />
                  <span>+15%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">University Billing</p>
              <p className="text-3xl font-bold text-[#FFB612]">R{analytics.universityBilling.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Paid invoices</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={24} />
                </div>
                <div className="flex items-center gap-1 text-amber-600 text-sm">
                  <TrendingDown size={16} />
                  <span>Pending</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Pending Collections</p>
              <p className="text-3xl font-bold text-amber-600">R{analytics.pendingBilling.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Outstanding invoices</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Revenue Trend */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="student" stroke="#007A4D" strokeWidth={3} name="Student Payments" />
                  <Line type="monotone" dataKey="university" stroke="#FFB612" strokeWidth={3} name="University Billing" />
                  <Line type="monotone" dataKey="premium" stroke="#10B981" strokeWidth={3} name="Premium Services" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: R${value.toLocaleString()}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`revenue-cell-${entry.name}-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentMethods}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#007A4D" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Key Metrics */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Key Metrics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Average Payment</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R{analytics.paidApplications > 0 ? Math.round(analytics.studentPayments / analytics.paidApplications) : 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalApplications}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {analytics.totalApplications > 0 ? Math.round((analytics.paidApplications / analytics.totalApplications) * 100) : 0}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Refunds Issued</p>
                    <p className="text-2xl font-bold text-amber-600">
                      R{analytics.totalRefunds.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 mb-2">Premium Services Conversion</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-green-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: '34%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-green-900">34%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
