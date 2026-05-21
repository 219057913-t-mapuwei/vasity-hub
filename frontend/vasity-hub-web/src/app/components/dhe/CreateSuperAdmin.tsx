import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { useNavigate } from "react-router";
import { createAdminUser, getCurrentUser } from "../../store";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";

export function CreateSuperAdmin() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "super_university_admin" as "super_university_admin" | "super_doe_admin",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (!currentUser) {
      setError("Not authenticated");
      return;
    }

    const result = createAdminUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      createdBy: currentUser.id,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dhe/dashboard');
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  if (success) {
    return (
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full">
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Created Successfully!</h2>
              <p className="text-gray-600 mb-4">The super admin account has been created.</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Super Admin</h1>
            <p className="text-gray-600">Super Admin can create Super University Admin and Super Education Department Admin</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Authorization Required</p>
              <p className="text-sm text-amber-800">
                Only Super Admin can create Super Admins. Super University Admins can create University Admins. Super Education Department Admins can create Education Department Admins.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus size={24} className="text-[#007A4D]" />
              <h2 className="text-2xl font-bold text-gray-900">Admin Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  required
                >
                  <option value="super_university_admin">Super University Admin</option>
                  <option value="super_doe_admin">Super Education Department Admin</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  {formData.role === 'super_university_admin'
                    ? 'Can create and manage University Admins'
                    : 'Can create and manage Education Department Admins'}
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  placeholder="Create a password"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  placeholder="Re-enter password"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dhe/dashboard')}
                  className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#007A4D] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#005a39] transition-colors"
                >
                  Create Super Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
