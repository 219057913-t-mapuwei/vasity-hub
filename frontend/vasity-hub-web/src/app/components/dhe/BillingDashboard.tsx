import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { getUniversityBillings, markBillingAsPaid, generateInvoiceNumber } from "../../store";
import { DollarSign, Download, CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";

export function BillingDashboard() {
  const [billings, setBillings] = useState(getUniversityBillings());
  const [selectedBilling, setSelectedBilling] = useState<string | null>(null);

  const handleMarkAsPaid = (billingId: string) => {
    if (confirm('Mark this invoice as paid?')) {
      markBillingAsPaid(billingId);
      setBillings(getUniversityBillings());
    }
  };

  const handleGenerateInvoice = (billingId: string) => {
    alert(`Invoice generated: ${generateInvoiceNumber()}`);
  };

  const totalOwed = billings
    .filter(b => b.paymentStatus === 'pending')
    .reduce((sum, b) => sum + b.amountOwed, 0);

  const totalPaid = billings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.amountOwed, 0);

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">University Billing</h1>
            <p className="text-gray-600">Manage university invoices and payment tracking</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-amber-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <p className="text-3xl font-bold text-amber-600">R{totalOwed.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">
                {billings.filter(b => b.paymentStatus === 'pending').length} invoices
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Paid This Quarter</p>
              <p className="text-3xl font-bold text-green-600">R{totalPaid.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">
                {billings.filter(b => b.paymentStatus === 'paid').length} invoices
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#007A4D] rounded-lg flex items-center justify-center">
                  <DollarSign className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">R{(totalOwed + totalPaid).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">All time</p>
            </div>
          </div>

          {/* Billing Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">University Invoices</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Billing Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
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
                  {billings.map((billing) => (
                    <tr key={billing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{billing.universityName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-600">{billing.invoiceNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{billing.billingPeriod}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">R{billing.amountOwed.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {new Date(billing.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          billing.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                          billing.paymentStatus === 'overdue' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {billing.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedBilling(selectedBilling === billing.id ? null : billing.id)}
                            className="text-[#007A4D] hover:text-[#005a39] text-sm font-medium"
                          >
                            {selectedBilling === billing.id ? 'Hide' : 'View'} Details
                          </button>
                          {billing.paymentStatus === 'pending' && (
                            <button
                              onClick={() => handleMarkAsPaid(billing.id)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleGenerateInvoice(billing.id)}
                            className="p-1 text-gray-600 hover:text-gray-900"
                            title="Download Invoice"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {selectedBilling && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        {(() => {
                          const billing = billings.find(b => b.id === selectedBilling);
                          if (!billing) return null;
                          return (
                            <div className="space-y-4">
                              <h3 className="font-bold text-gray-900 mb-3">Itemized Charges</h3>
                              <div className="space-y-2">
                                {billing.itemizedCharges.map((charge) => (
                                  <div key={charge.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <div>
                                      <p className="font-medium text-gray-900">{charge.description}</p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(charge.date).toLocaleDateString()} · {charge.type.replace('_', ' ')}
                                      </p>
                                    </div>
                                    <p className="font-bold text-gray-900">R{charge.amount.toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                                <p className="font-bold text-lg text-gray-900">Total</p>
                                <p className="font-bold text-xl text-[#007A4D]">R{billing.amountOwed.toLocaleString()}</p>
                              </div>
                              {billing.paidDate && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <p className="text-sm text-green-800">
                                    <strong>Paid on:</strong> {new Date(billing.paidDate).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Billing Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <FileText className="text-blue-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Billing Information</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Universities are billed quarterly for course listings and featured promotions</p>
                  <p>• Course listing: R3,000 per course per quarter</p>
                  <p>• Featured course promotion: R6,000 per course per quarter</p>
                  <p>• Payment due within 30 days of invoice date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
