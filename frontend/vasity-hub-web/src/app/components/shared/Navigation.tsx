import { Link, useNavigate } from "react-router";
import { Home, FileText, Compass, GraduationCap, School, Upload, ClipboardList, BarChart3, Users, Settings, LogOut, Crown, DollarSign, TrendingUp, RefreshCcw } from "lucide-react";
import { getCurrentUser, logout } from "../../store";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export function Navigation() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentNav: NavItem[] = [
    { label: 'Dashboard', path: '/student/dashboard', icon: <Home size={20} /> },
    { label: 'Grade 11 Marks', path: '/student/grades', icon: <FileText size={20} /> },
    { label: 'Career Test', path: '/student/career-test', icon: <Compass size={20} /> },
    { label: 'Recommendations', path: '/student/recommendations', icon: <GraduationCap size={20} /> },
    { label: 'University Search', path: '/student/university-search', icon: <School size={20} /> },
    { label: 'My Applications', path: '/student/applications', icon: <ClipboardList size={20} /> },
    { label: 'Documents', path: '/student/documents', icon: <Upload size={20} /> },
    { label: 'Premium Services', path: '/student/premium', icon: <Crown size={20} /> },
  ];

  const universityAdminNav: NavItem[] = [
    { label: 'Dashboard', path: '/university/dashboard', icon: <Home size={20} /> },
    { label: 'Course Management', path: '/university/courses', icon: <Settings size={20} /> },
  ];

  const superUniversityNav: NavItem[] = [
    { label: 'Dashboard', path: '/super-university/dashboard', icon: <Home size={20} /> },
    { label: 'Create Admins', path: '/super-university/create-admin', icon: <Users size={20} /> },
  ];

  const dheNav: NavItem[] = [
    { label: 'Dashboard', path: '/dhe/dashboard', icon: <BarChart3 size={20} /> },
    { label: 'University Billing', path: '/dhe/billing', icon: <DollarSign size={20} /> },
    { label: 'Financial Reports', path: '/dhe/financial-reports', icon: <TrendingUp size={20} /> },
    { label: 'Refund Management', path: '/dhe/refunds', icon: <RefreshCcw size={20} /> },
    { label: 'Create Super Admins', path: '/dhe/create-admin', icon: <Users size={20} /> },
  ];

  const superDoeNav: NavItem[] = [
    { label: 'Dashboard', path: '/super-doe/dashboard', icon: <Home size={20} /> },
    { label: 'Create Admins', path: '/super-doe/create-admin', icon: <Users size={20} /> },
  ];

  const doeAdminNav: NavItem[] = [
    { label: 'Dashboard', path: '/doe/dashboard', icon: <Upload size={20} /> },
  ];

  let navItems: NavItem[] = [];
  if (user?.role === 'student') navItems = studentNav;
  if (user?.role === 'super_admin') navItems = dheNav;
  if (user?.role === 'super_university_admin') navItems = superUniversityNav;
  if (user?.role === 'university_admin') navItems = universityAdminNav;
  if (user?.role === 'super_doe_admin') navItems = superDoeNav;
  if (user?.role === 'doe_admin') navItems = doeAdminNav;

  return (
    <nav className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#007A4D] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">VH</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Vasity Hub</h2>
            <p className="text-xs text-gray-600">{user?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-[#007A4D]/5 hover:text-[#007A4D] transition-colors"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </nav>
  );
}
