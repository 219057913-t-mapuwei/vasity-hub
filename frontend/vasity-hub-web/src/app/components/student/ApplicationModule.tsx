import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { useNavigate } from "react-router";
import { courses, getStudentProfile, universities, APPLICATION_FEE } from "../../store";
import { FileText, AlertCircle, Award, CreditCard } from "lucide-react";

export function ApplicationModule() {
  const navigate = useNavigate();
  const profile = getStudentProfile();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [motivation, setMotivation] = useState("");

  const applicationsCount = profile.applications.length;
  const maxApplications = 5;
  const hasAPS = !!(profile.finalAPS || profile.grade12APS || profile.grade11APS);
  const hasIdentifier = profile.studentType === 'foreign'
    ? !!(profile.passportNumber && profile.passportNumber.length >= 5)
    : !!(profile.saId && profile.saId.length === 13);
  const canApply = applicationsCount < maxApplications && hasAPS && hasIdentifier;

  const appliedCourseIds = profile.applications.map(app =>
    courses.find(c => c.name === app.courseName)?.id
  );
  const availableCourses = courses.filter(c => !appliedCourseIds.includes(c.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) {
      alert('Please select a course');
      return;
    }

    if (!hasIdentifier) {
      alert('A valid ID or passport number is required for application');
      return;
    }

    if (motivation.length < 100) {
      alert('Motivation statement must be at least 100 characters');
      return;
    }

    // Redirect to payment page
    navigate(`/student/payment?courseId=${selectedCourse}&motivation=${encodeURIComponent(motivation)}`);
  };

  // Check if SA ID is missing
  if (!hasIdentifier) {
    return (
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Identifier Required</h2>
            <p className="text-gray-600 mb-6">
              South African students must have a valid 13-digit ID number. Foreign students must have a valid passport number and foreign student profile details before applying.
            </p>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39]"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Check if APS is missing
  if (!hasAPS) {
    return (
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">APS Required Before Applying</h2>
            <p className="text-gray-600 mb-6">
              You need to calculate your APS score before you can apply to courses. Please complete your Grade 11 marks to get an estimated APS.
            </p>
            <button
              onClick={() => navigate('/student/grades')}
              className="px-6 py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39]"
            >
              Calculate APS Score
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Check application limit
  if (applicationsCount >= maxApplications) {
    return (
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <AlertCircle size={64} className="text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Limit Reached</h2>
            <p className="text-gray-600 mb-6">
              You have reached the maximum of {maxApplications} applications. You can manage your existing applications.
            </p>
            <button
              onClick={() => navigate('/student/applications')}
              className="px-6 py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39]"
            >
              View My Applications
            </button>
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
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply to Course</h1>
              <p className="text-gray-600">
                Applications: {applicationsCount} of {maxApplications} used
              </p>
            </div>
            <div className="px-4 py-3 bg-[#007A4D]/10 border border-[#007A4D]/30 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">South African ID (Primary Identifier)</p>
              <p className="font-mono font-bold text-gray-900 text-lg">{profile.saId}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-200">
            {/* Payment Info Banner */}
            <div className="mb-6 p-4 bg-[#007A4D]/10 border border-[#007A4D]/30 rounded-lg flex items-start gap-3">
              <CreditCard className="text-[#007A4D] mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Application Fee Required</h4>
                <p className="text-sm text-gray-700">
                  An application fee of <strong>R{APPLICATION_FEE}</strong> is required to submit your application.
                  You will be redirected to payment after completing this form.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Course Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course *
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  required
                >
                  <option value="">Choose a course...</option>
                  {availableCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} - {course.university} (APS: {course.apsRequired})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Course Details */}
              {selectedCourse && (
                <div className="mb-6 space-y-4">
                  {(() => {
                    const course = courses.find(c => c.id === selectedCourse);
                    if (!course) return null;

                    const university = universities.find(u => u.name === course.university);
                    const studentUniAPS = profile.universityAPS?.find(u => u.universityName === course.university);
                    const isEligible = studentUniAPS ? studentUniAPS.apsScore >= course.apsRequired : false;

                    return (
                      <>
                        <div className="p-4 bg-[#007A4D]/5 border border-[#007A4D]/20 rounded-lg">
                          <h3 className="font-bold text-gray-900 mb-3">{course.name}</h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">University:</span>
                              <p className="font-medium text-gray-900">{course.university}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">APS Required:</span>
                              <p className="font-medium text-gray-900">{course.apsRequired}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Duration:</span>
                              <p className="font-medium text-gray-900">{course.duration}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Field:</span>
                              <p className="font-medium text-gray-900">{course.field}</p>
                            </div>
                          </div>
                        </div>

                        {/* University-Specific APS & Eligibility */}
                        {studentUniAPS && (
                          <div className={`p-4 rounded-lg border-2 ${
                            isEligible
                              ? 'bg-green-50 border-green-300'
                              : 'bg-red-50 border-red-300'
                          }`}>
                            <div className="flex items-start gap-3">
                              <Award className={isEligible ? 'text-green-600' : 'text-red-600'} size={24} />
                              <div className="flex-1">
                                <h4 className={`font-bold mb-2 ${isEligible ? 'text-green-900' : 'text-red-900'}`}>
                                  {isEligible ? 'You Meet the Requirements!' : 'APS Below Requirement'}
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                  <div>
                                    <span className={isEligible ? 'text-green-700' : 'text-red-700'}>Your APS for {course.university}:</span>
                                    <p className={`text-2xl font-bold ${isEligible ? 'text-green-900' : 'text-red-900'}`}>
                                      {studentUniAPS.apsScore}
                                    </p>
                                  </div>
                                  <div>
                                    <span className={isEligible ? 'text-green-700' : 'text-red-700'}>Required APS:</span>
                                    <p className={`text-2xl font-bold ${isEligible ? 'text-green-900' : 'text-red-900'}`}>
                                      {course.apsRequired}
                                    </p>
                                  </div>
                                </div>
                                <p className={`text-xs leading-tight ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
                                  <strong>Calculation:</strong> {studentUniAPS.calculationMethod}
                                </p>
                                {!isEligible && (
                                  <p className="text-sm text-red-800 mt-3 font-medium">
                                    Note: You can still apply, but acceptance may be less likely. Consider improving your marks or applying to courses with lower APS requirements.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* If no university APS calculated yet */}
                        {!studentUniAPS && (
                          <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="text-amber-600" size={20} />
                              <div>
                                <p className="text-sm text-amber-800">
                                  Your university-specific APS has not been calculated yet. Make sure to enter your subject marks to see eligibility for this university.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Motivation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivation Statement *
                </label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  rows={8}
                  placeholder="Explain why you want to study this course and what makes you a suitable candidate..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {motivation.length} / 100 characters minimum
                  {motivation.length >= 100 && <span className="text-green-600 ml-2">✓</span>}
                </p>
              </div>

              {/* Required Documents Info */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Required Documents</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Certified copy of ID</li>
                      <li>• Academic transcripts</li>
                      <li>• Proof of residence</li>
                      <li>• Additional documents may be requested by the university</li>
                    </ul>
                    <p className="text-sm text-blue-700 mt-2">
                      Upload your documents in the Documents section before submitting your application.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#007A4D] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#005a39] transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Proceed to Payment (R{APPLICATION_FEE})
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
