import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { registerUser } from "../../store";
import { UserPlus, ArrowLeft, Globe2, ShieldCheck } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentType: "south_african",
    saId: "",
    passportNumber: "",
    countryOfCitizenship: "",
    visaStatus: "Not Started",
    medicalCoverStatus: "Not Started",
    saqaStatus: "Not Required Yet",
    usafExemptionStatus: "Not Required Yet",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isForeign = formData.studentType === "foreign";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!isForeign) {
      const cleanSaId = formData.saId.replace(/[\s-]/g, "");
      if (!/^\d{13}$/.test(cleanSaId)) {
        setError("Please enter a valid 13-digit South African ID number");
        return;
      }
    } else {
      if (!formData.passportNumber || formData.passportNumber.trim().length < 5) {
        setError("Please enter a valid passport number");
        return;
      }
      if (!formData.countryOfCitizenship) {
        setError("Please enter your country of citizenship");
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const result = registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      studentType: formData.studentType as "south_african" | "foreign",
      saId: formData.saId.replace(/[\s-]/g, ""),
      passportNumber: formData.passportNumber.trim(),
      countryOfCitizenship: formData.countryOfCitizenship.trim(),
      visaStatus: formData.visaStatus,
      medicalCoverStatus: formData.medicalCoverStatus,
      saqaStatus: formData.saqaStatus,
      usafExemptionStatus: formData.usafExemptionStatus,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1800);
    } else {
      setError(result.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-8">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-[#007A4D]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful</h2>
            <p className="text-gray-600 mb-6">Your Vasity Hub student account has been created. Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#007A4D] hover:text-[#005a39] mb-6">
          <ArrowLeft size={20} />
          Back to login
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#007A4D] to-[#002395] px-8 py-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <UserPlus size={26} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Create Student Account</h1>
                <p className="text-white/80">South African and foreign students can register here.</p>
              </div>
            </div>
            <p className="text-sm text-white/80">
              Staff accounts are not public. Admin, University Staff and Support Staff access is created by the Super Admin only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student type *</label>
              <select
                name="studentType"
                value={formData.studentType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
              >
                <option value="south_african">South African student</option>
                <option value="foreign">Foreign student</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Tanyaradzwa Mapuwei"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address *</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                />
              </div>
            </div>

            {!isForeign ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">South African ID number *</label>
                <input
                  name="saId"
                  value={formData.saId}
                  onChange={handleChange}
                  placeholder="13-digit ID number"
                  maxLength={13}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 space-y-5">
                <div className="flex items-center gap-2 text-[#002395]">
                  <Globe2 size={20} />
                  <h3 className="font-semibold">Foreign student information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport number *</label>
                    <input
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      placeholder="Passport number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country of citizenship *</label>
                    <input
                      name="countryOfCitizenship"
                      value={formData.countryOfCitizenship}
                      onChange={handleChange}
                      placeholder="e.g. Zimbabwe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Study visa status</label>
                    <select name="visaStatus" value={formData.visaStatus} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Approved</option>
                      <option>Not Required Yet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical cover status</label>
                    <select name="medicalCoverStatus" value={formData.medicalCoverStatus} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Approved</option>
                      <option>Not Required Yet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SAQA status</label>
                    <select name="saqaStatus" value={formData.saqaStatus} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                      <option>Not Required Yet</option>
                      <option>Required</option>
                      <option>Submitted</option>
                      <option>Approved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">USAf exemption status</label>
                    <select name="usafExemptionStatus" value={formData.usafExemptionStatus} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                      <option>Not Required Yet</option>
                      <option>Required</option>
                      <option>Submitted</option>
                      <option>Approved</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password *</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#007A4D] hover:bg-[#005a39] text-white py-3 rounded-lg font-medium transition-colors"
            >
              Create Student Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
