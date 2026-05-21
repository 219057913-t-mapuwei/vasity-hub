import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { login } from "../../store";
import { GraduationCap } from "lucide-react";
import heroImage from "figma:asset/e2a58ac447a4a57b62ea4e4b9f4d3d6e366b6955.png";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);

    if (user) {
      switch (user.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'super_admin':
          navigate('/dhe/dashboard');
          break;
        case 'super_university_admin':
          navigate('/super-university/dashboard');
          break;
        case 'university_admin':
          navigate('/university/dashboard');
          break;
        case 'super_doe_admin':
          navigate('/super-doe/dashboard');
          break;
        case 'doe_admin':
          navigate('/doe/dashboard');
          break;
      }
    } else {
      setError("Invalid credentials");
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#007A4D] rounded-xl mb-4">
              <GraduationCap className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your Vasity Hub account</p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#007A4D] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#005a39] transition-colors"
              >
                Sign in
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#007A4D] font-medium hover:underline">
                  Register as Student
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowLogin(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to home
              </button>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium text-gray-800">Student:</span>
                  <p className="font-mono ml-2">student@test.com / 1234</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Super Admin:</span>
                  <p className="font-mono ml-2">superadmin@vasityhub.co.za / ChangeMe@12345</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Vasity Hub Admin:</span>
                  <p className="font-mono ml-2">admin@vasityhub.co.za / ChangeMe@12345</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">University Staff:</span>
                  <p className="font-mono ml-2">university@vasityhub.co.za / ChangeMe@12345</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Super Support Staff:</span>
                  <p className="font-mono ml-2">super-doe@test.com / 1234</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Support Staff:</span>
                  <p className="font-mono ml-2">support@vasityhub.co.za / ChangeMe@12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Hero Background Image */}
      <div className="fixed inset-0">
        <img
          src={heroImage}
          alt="University Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-[#007A4D]" size={20} />
            </div>
            <span className="text-white font-bold text-sm sm:text-base">Vasity Hub</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-3xl py-8 sm:py-0">
            <h1 className="text-[32px] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
              Your Future Starts Here
            </h1>
            <p className="text-sm leading-relaxed sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-xl">
              Access South Africa's centralized university application platform. Apply to multiple institutions, track your progress, and shape your academic journey.
            </p>
            <div className="flex flex-col gap-3 max-w-sm">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full px-6 py-3.5 bg-[#007A4D] text-white rounded-lg font-bold text-base active:bg-[#005a39] transition-colors shadow-lg min-h-[48px]"
              >
                Sign In
              </button>
              <Link
                to="/register"
                className="w-full px-6 py-3.5 bg-[#FFB612] text-gray-900 rounded-lg font-bold text-base active:bg-[#e5a510] transition-colors shadow-lg text-center min-h-[48px] flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0">
          <div className="flex items-center gap-2 text-white/70">
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-[#007A4D] rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-[#FFB612] rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
            </span>
            <span className="text-xs">Republic of South Africa</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
