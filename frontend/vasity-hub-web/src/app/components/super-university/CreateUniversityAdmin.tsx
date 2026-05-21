import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { useNavigate } from "react-router";
import { createAdminUser, getCurrentUser, universities } from "../../store";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";

export function CreateUniversityAdmin() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
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

    if (!formData.name || !formData.email || !formData.password || !formData.university) {
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
      role: 'university_admin',
      university: formData.university,
      createdBy: currentUser.id,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/super-university/dashboard');
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">University Admin Created!</h2>
              <p className="text-gray-600 mb-4">The university admin account has been created successfully.</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create University Admin</h1>
            <p className="text-gray-600">Create an admin account for a specific university</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Authorization Note</p>
              <p className="text-sm text-blue-800">
                Only Super University Admin can create University Admins. Each University Admin will be assigned to a specific university.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus size={24} className="text-[#007A4D]" />
              <h2 className="text-2xl font-bold text-gray-900">Admin Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="admin@university.ac.za"
                  required
                />
              </div>

              {/* University Selection */}
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to University *
                </label>
                <select
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  required
                >
                  <option value="">Select a university...</option>
                  {universities.map(uni => (
                    <option key={uni.id} value={uni.name}>{uni.name}</option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  This admin will manage applications and courses for the selected university
                </p>
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
                  onClick={() => navigate('/super-university/dashboard')}
                  className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#007A4D] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#005a39] transition-colors"
                >
                  Create University Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
