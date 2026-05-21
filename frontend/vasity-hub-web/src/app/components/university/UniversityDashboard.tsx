import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { Link } from "react-router";
import { Users, GraduationCap, FileText, TrendingUp } from "lucide-react";

// Mock applicant data
const mockApplicants = [
  {
    id: '1',
    name: 'Thabo Molefe',
    email: 'student@test.com',
    saId: '9801015800089',
    course: 'BSc Computer Science',
    aps: 36,
    status: 'submitted',
    appliedDate: '2026-04-01',
    careerProfile: 'Technical',
    documentsComplete: true,
  },
  {
    id: '2',
    name: 'Nomvula Khumalo',
    email: 'nomvula@example.com',
    saId: '9912123456089',
    course: 'Bachelor of Engineering',
    aps: 38,
    status: 'under_review',
    appliedDate: '2026-04-03',
    careerProfile: 'Analytical',
    documentsComplete: true,
  },
  {
    id: '3',
    name: 'Sipho Dlamini',
    email: 'sipho@example.com',
    saId: '0005154567890',
    course: 'BA Law',
    aps: 35,
    status: 'submitted',
    appliedDate: '2026-04-05',
    careerProfile: 'Enterprising',
    documentsComplete: false,
  },
  {
    id: '4',
    name: 'Zanele Ndlovu',
    email: 'zanele@example.com',
    saId: '9708259876543',
    course: 'BSc Data Science',
    aps: 34,
    status: 'accepted',
    appliedDate: '2026-03-28',
    careerProfile: 'Technical',
    documentsComplete: true,
  },
];

export function UniversityDashboard() {
  const [apsFilter, setApsFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplicants = mockApplicants.filter(applicant => {
    const matchesAPS = !apsFilter || applicant.aps >= parseInt(apsFilter);
    const matchesCourse = !courseFilter || applicant.course === courseFilter;
    const matchesStatus = !statusFilter || applicant.status === statusFilter;
    const matchesSearch = !searchTerm ||
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.saId.includes(searchTerm.replace(/[\s-]/g, ''));
    return matchesAPS && matchesCourse && matchesStatus && matchesSearch;
  });

  const courses = [...new Set(mockApplicants.map(a => a.course))];

  const getStatusBadge = (status: string) => {
    const styles = {
      submitted: 'bg-blue-100 text-blue-700',
      under_review: 'bg-amber-100 text-amber-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      waitlisted: 'bg-yellow-100 text-yellow-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">University Dashboard</h1>
            <p className="text-gray-600">University of Cape Town - Applications Management</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#007A4D] rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Applicants</p>
              <p className="text-3xl font-bold text-gray-900">{mockApplicants.length}</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <FileText className="text-white" size={20} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Under Review</p>
              <p className="text-3xl font-bold text-amber-600">
                {mockApplicants.filter(a => a.status === 'under_review').length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white" size={20} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Accepted</p>
              <p className="text-3xl font-bold text-green-600">
                {mockApplicants.filter(a => a.status === 'accepted').length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#FFB612] rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-gray-900" size={20} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Avg. APS Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(mockApplicants.reduce((sum, a) => sum + a.aps, 0) / mockApplicants.length)}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Search & Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Name, Email, or SA ID..."
                className="md:col-span-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={apsFilter}
                onChange={(e) => setApsFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
              >
                <option value="">All APS Scores</option>
                <option value="30">30+ APS</option>
                <option value="35">35+ APS</option>
                <option value="38">38+ APS</option>
              </select>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
              </select>

              <Link
                to="/university/courses"
                className="px-4 py-2 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39] text-center"
              >
                Manage Courses
              </Link>
            </div>
          </div>

          {/* Applicants Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Applicants ({filteredApplicants.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SA ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">APS Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Career Profile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-[#007A4D]">{applicant.saId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{applicant.name}</p>
                          <p className="text-sm text-gray-500">{applicant.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{applicant.course}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#007A4D]">{applicant.aps}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{applicant.careerProfile}</td>
                      <td className="px-6 py-4">
                        {applicant.documentsComplete ? (
                          <span className="text-green-600 text-sm font-medium">✓ Complete</span>
                        ) : (
                          <span className="text-amber-600 text-sm font-medium">⚠ Incomplete</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(applicant.status)}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/university/applicant/${applicant.id}`}
                          className="text-[#007A4D] font-medium hover:underline text-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
