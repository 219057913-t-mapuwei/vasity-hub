import React, { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { getAllPayments, requestRefund, approveRefund, processRefund, studentProfiles } from "../../store";
import { AlertCircle, CheckCircle, XCircle, DollarSign, Search } from "lucide-react";

export function RefundManagement() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const allPayments = getAllPayments();

  // Filter payments that can be refunded or are in refund process
  const refundablePayments = allPayments.filter(p =>
    p.status === 'paid' || p.refundStatus
  );

  // Apply filters
  const filteredPayments = refundablePayments.filter(payment => {
    const student = Object.values(studentProfiles).find(s => s.id === payment.studentId);
    const matchesSearch = !searchTerm ||
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.saId.includes(searchTerm) ||
      payment.referenceNumber?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'refundable' && !payment.refundStatus) ||
      payment.refundStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRequestRefund = (paymentId: string) => {
    if (!refundReason.trim()) {
      alert('Please enter a refund reason');
      return;
    }

    const result = requestRefund(paymentId, refundReason);
    if (result.success) {
      alert('Refund requested successfully');
      setSelectedPayment(null);
      setRefundReason('');
    } else {
      alert(result.message);
    }
  };

  const handleApproveRefund = (paymentId: string) => {
    if (confirm('Approve this refund request?')) {
      const result = approveRefund(paymentId);
      if (result.success) {
        alert('Refund approved successfully');
      } else {
        alert(result.message);
      }
    }
  };

  const handleProcessRefund = (paymentId: string) => {
    if (confirm('Process this refund? This will mark the payment as refunded and cannot be undone.')) {
      const result = processRefund(paymentId);
      if (result.success) {
        alert('Refund processed successfully');
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Management</h1>
            <p className="text-gray-600">Process and track payment refunds</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by student name, SA ID, or reference..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="refundable">Refundable</option>
                <option value="requested">Refund Requested</option>
                <option value="approved">Refund Approved</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Refund Requests</p>
              <p className="text-3xl font-bold text-amber-600">
                {allPayments.filter(p => p.refundStatus === 'requested').length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-blue-600">
                {allPayments.filter(p => p.refundStatus === 'approved').length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Processed</p>
              <p className="text-3xl font-bold text-green-600">
                {allPayments.filter(p => p.refundStatus === 'refunded').length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total Refunded</p>
              <p className="text-3xl font-bold text-gray-900">
                R{allPayments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Payment Transactions</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => {
                    const student = Object.values(studentProfiles).find(s => s.id === payment.studentId);
                    const isSelected = selectedPayment === payment.id;

                    return (
                      <React.Fragment key={payment.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">{student?.name}</div>
                              <div className="text-sm text-gray-500 font-mono">{student?.saId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-600">
                              {payment.referenceNumber?.slice(-12) || payment.id.slice(-8)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">R{payment.amount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {new Date(payment.createdDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              payment.refundStatus === 'refunded' ? 'bg-green-100 text-green-700' :
                              payment.refundStatus === 'approved' ? 'bg-blue-100 text-blue-700' :
                              payment.refundStatus === 'requested' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {payment.refundStatus ? `Refund ${payment.refundStatus}` : payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {!payment.refundStatus && (
                                <button
                                  onClick={() => setSelectedPayment(isSelected ? null : payment.id)}
                                  className="text-[#007A4D] hover:text-[#005a39] text-sm font-medium"
                                >
                                  {isSelected ? 'Cancel' : 'Issue Refund'}
                                </button>
                              )}
                              {payment.refundStatus === 'requested' && (
                                <button
                                  onClick={() => handleApproveRefund(payment.id)}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                                >
                                  Approve
                                </button>
                              )}
                              {payment.refundStatus === 'approved' && (
                                <button
                                  onClick={() => handleProcessRefund(payment.id)}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                                >
                                  Process Refund
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Refund Form Row */}
                        {isSelected && (
                          <tr className="bg-gray-50">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="max-w-2xl">
                                <h4 className="font-bold text-gray-900 mb-3">Issue Refund</h4>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Refund Reason *
                                  </label>
                                  <textarea
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    rows={3}
                                    placeholder="Enter the reason for this refund..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                                    required
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => handleRequestRefund(payment.id)}
                                    className="px-6 py-2 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39]"
                                  >
                                    Request Refund
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedPayment(null);
                                      setRefundReason('');
                                    }}
                                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Refund Details Row */}
                        {payment.refundStatus && payment.refundReason && (
                          <tr className="bg-amber-50">
                            <td colSpan={6} className="px-6 py-3">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                                <div className="text-sm">
                                  <p className="font-medium text-amber-900 mb-1">Refund Reason:</p>
                                  <p className="text-amber-800">{payment.refundReason}</p>
                                  {payment.refundDate && (
                                    <p className="text-xs text-amber-700 mt-1">
                                      Processed: {new Date(payment.refundDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Refund Process</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. <strong>Request</strong>: Admin initiates refund with reason</p>
              <p>2. <strong>Approve</strong>: Senior admin reviews and approves the refund</p>
              <p>3. <strong>Process</strong>: Refund is processed and student is notified</p>
              <p className="mt-3 text-xs">• Refunds typically take 5-7 business days to reflect in student accounts</p>
              <p className="text-xs">• Students will receive email notifications at each stage</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
