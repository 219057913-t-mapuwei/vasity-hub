import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { useParams, useNavigate } from "react-router";
import { User, Award, Target, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

// Mock applicant data
const mockApplicant = {
  id: '1',
  name: 'Thabo Molefe',
  email: 'student@test.com',
  saId: '9801015800089',
  phone: '+27 82 123 4567',
  course: 'BSc Computer Science',
  aps: 36,
  grade11APS: 34,
  status: 'submitted',
  appliedDate: '2026-04-01',
  careerProfile: {
    personalityType: 'Technical',
    suggestedCareers: ['Software Engineer', 'Data Scientist', 'IT Specialist'],
    skills: [
      { name: 'Technical', score: 85 },
      { name: 'Analytical', score: 78 },
      { name: 'Creative', score: 65 },
    ],
  },
  documents: [
    { id: '1', name: 'Certified ID Copy', status: 'approved' },
    { id: '2', name: 'Academic Transcript', status: 'approved' },
    { id: '3', name: 'Proof of Residence', status: 'pending' },
    { id: '4', name: 'Matric Certificate', status: 'approved' },
  ],
  motivation: 'I am deeply passionate about technology and its potential to solve real-world problems. Throughout my high school years, I have excelled in mathematics and physical sciences, consistently achieving top marks. My participation in coding clubs and hackathons has further strengthened my desire to pursue computer science at a tertiary level.',
};

export function ApplicantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(mockApplicant.status);
  const [notes, setNotes] = useState("");

  const handleApprove = () => {
    setStatus('accepted');
    alert('Application approved successfully');
    navigate('/university/dashboard');
  };

  const handleReject = () => {
    setStatus('rejected');
    alert('Application rejected');
    navigate('/university/dashboard');
  };

  const handleWaitlist = () => {
    setStatus('waitlisted');
    alert('Applicant added to waitlist');
    navigate('/university/dashboard');
  };

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-600" size={18} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={18} />;
      default:
        return <Clock className="text-amber-600" size={18} />;
    }
  };

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/university/dashboard')}
              className="text-[#007A4D] font-medium hover:underline mb-4"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Applicant Profile</h1>
                <p className="text-gray-600">Detailed view and application management</p>
              </div>
              <div className="px-6 py-4 bg-[#007A4D] text-white rounded-lg">
                <p className="text-xs opacity-75 mb-1">South African ID (Primary Identifier)</p>
                <p className="font-mono font-bold text-xl">{mockApplicant.saId}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Documents */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <User size={24} className="text-[#007A4D]" />
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                </div>
                <div className="mb-4 p-3 bg-[#007A4D]/5 border border-[#007A4D]/20 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">South African ID (Primary Identifier)</p>
                  <p className="font-mono font-bold text-lg text-[#007A4D]">{mockApplicant.saId}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-medium text-gray-900">{mockApplicant.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{mockApplicant.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{mockApplicant.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Applied Course</p>
                    <p className="font-medium text-gray-900">{mockApplicant.course}</p>
                  </div>
                </div>
              </div>

              {/* Academic Profile */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <Award size={24} className="text-[#007A4D]" />
                  <h2 className="text-xl font-bold text-gray-900">Academic Profile</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#007A4D]/5 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Final APS Score</p>
                      <p className="text-3xl font-bold text-[#007A4D]">{mockApplicant.aps}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Grade 11 APS</p>
                      <p className="text-xl font-semibold text-gray-700">{mockApplicant.grade11APS}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Meets the APS requirement for {mockApplicant.course}
                    </p>
                  </div>
                </div>
              </div>

              {/* Career Profile */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <Target size={24} className="text-[#007A4D]" />
                  <h2 className="text-xl font-bold text-gray-900">Career Profile</h2>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Personality Type</p>
                  <div className="inline-block px-4 py-2 bg-[#007A4D] text-white rounded-lg font-semibold">
                    {mockApplicant.careerProfile.personalityType}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Suggested Career Paths</p>
                  <div className="flex flex-wrap gap-2">
                    {mockApplicant.careerProfile.suggestedCareers.map((career, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-900">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-3">Skills Assessment</p>
                  <div className="space-y-3">
                    {mockApplicant.careerProfile.skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                          <span className="text-sm text-[#007A4D] font-semibold">{skill.score}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#007A4D]"
                            style={{ width: `${skill.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <FileText size={24} className="text-[#007A4D]" />
                  <h2 className="text-xl font-bold text-gray-900">Submitted Documents</h2>
                </div>
                <div className="space-y-3">
                  {mockApplicant.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDocumentStatus(doc.status)}
                        <span className="font-medium text-gray-900">{doc.name}</span>
                      </div>
                      <button className="text-[#007A4D] text-sm font-medium hover:underline">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivation Statement */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Motivation Statement</h2>
                <p className="text-gray-700 leading-relaxed">{mockApplicant.motivation}</p>
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Application Status</h3>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  status === 'accepted' ? 'bg-green-100 text-green-700' :
                  status === 'rejected' ? 'bg-red-100 text-red-700' :
                  status === 'waitlisted' ? 'bg-yellow-100 text-yellow-700' :
                  status === 'under_review' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {status.replace('_', ' ').toUpperCase()}
                </span>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Applied: {new Date(mockApplicant.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Decision Actions */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Decision Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={handleWaitlist}
                    className="w-full bg-yellow-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Add to Waitlist
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Reject Application
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Reviewer Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Add internal notes about this applicant..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent text-sm"
                />
                <button className="mt-3 w-full bg-[#007A4D] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#005a39]">
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
