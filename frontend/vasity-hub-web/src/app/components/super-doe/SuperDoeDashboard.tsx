import { Navigation } from "../shared/Navigation";
import { Link } from "react-router";
import { users, getCurrentUser } from "../../store";
import { Users, Upload, Plus, Shield } from "lucide-react";

export function SuperDoeDashboard() {
  const currentUser = getCurrentUser();
  const doeAdmins = users.filter(u => u.role === 'doe_admin' && u.createdBy === currentUser?.id);
  const allDoeAdmins = users.filter(u => u.role === 'doe_admin');

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Education Department Admin Dashboard</h1>
            <p className="text-gray-600">Manage Education Department Admins and oversee grade 12 results uploads</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#007A4D] rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Education Department Admins Created</p>
              <p className="text-3xl font-bold text-gray-900">{doeAdmins.length}</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#FFB612] rounded-lg flex items-center justify-center">
                  <Upload className="text-gray-900" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Education Department Admins</p>
              <p className="text-3xl font-bold text-gray-900">{allDoeAdmins.length}</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Your Role</p>
              <p className="text-lg font-bold text-gray-900">Super Admin</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-[#007A4D] to-[#005a39] text-white p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-2">Create Education Department Admin</h2>
            <p className="mb-6 opacity-90">
              As a Super Education Department Admin, you can create Education Department Admin accounts who will manage Grade 12 results uploads.
            </p>
            <Link
              to="/super-doe/create-admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFB612] text-gray-900 rounded-lg font-medium hover:bg-[#e5a510]"
            >
              <Plus size={20} />
              Create Education Department Admin
            </Link>
          </div>

          {/* Education Department Admins List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Education Department Admins You Created</h2>
              <Link
                to="/super-doe/admins"
                className="text-[#007A4D] font-medium hover:underline"
              >
                View All Admins
              </Link>
            </div>

            {doeAdmins.length === 0 ? (
              <div className="p-12 text-center">
                <Users size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No Education Department admins created yet</p>
                <Link
                  to="/super-doe/create-admin"
                  className="inline-block text-[#007A4D] font-medium hover:underline"
                >
                  Create your first admin
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {doeAdmins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{admin.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">2026-04-10</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
