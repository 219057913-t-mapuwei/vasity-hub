import { Navigation } from "../shared/Navigation";
import { Link } from "react-router";
import { getStudentProfile } from "../../store";
import { Target, Briefcase, TrendingUp, ArrowRight } from "lucide-react";

export function CareerResults() {
  const profile = getStudentProfile();
  const careerProfile = profile.careerProfile;

  if (!careerProfile) {
    return (
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No career test results available</p>
            <Link to="/student/career-test" className="text-[#007A4D] font-medium hover:underline">
              Take the career test
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {/* Student ID Badge */}
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-600">SA ID:</span>
            <span className="font-mono font-bold text-gray-900">{profile.saId}</span>
          </div>

          {/* Header */}
          <div className="mb-8 bg-gradient-to-r from-[#007A4D] to-[#005a39] text-white p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Target size={32} />
              <h1 className="text-3xl font-bold">Your Career Profile</h1>
            </div>
            <p className="text-lg opacity-90">
              Based on your responses, we've identified your strengths and suggested career paths that align with your interests.
            </p>
          </div>

          {/* Personality Type */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Personality Type</h2>
            <div className="inline-block px-6 py-3 bg-[#007A4D] text-white rounded-lg text-xl font-bold">
              {careerProfile.personalityType}
            </div>
            <p className="mt-4 text-gray-700">
              Your dominant trait suggests you excel in {careerProfile.personalityType.toLowerCase()} roles.
            </p>
          </div>

          {/* Skills Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Profile</h2>
            <div className="space-y-4">
              {careerProfile.skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="text-[#007A4D] font-semibold">{skill.score}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#007A4D] transition-all duration-500"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Careers */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase size={24} className="text-[#007A4D]" />
              <h2 className="text-2xl font-bold text-gray-900">Recommended Career Paths</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careerProfile.suggestedCareers.map((career, index) => (
                <div
                  key={index}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#007A4D] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFB612] rounded-lg flex items-center justify-center font-bold text-gray-900">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-900">{career}</span>
                    </div>
                    <TrendingUp size={18} className="text-[#007A4D]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-[#FFB612] to-[#e5a510] p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
            <p className="text-gray-900 mb-6">
              Now that you have your career profile, explore university courses and programs that align with your interests.
            </p>
            <div className="flex gap-4">
              <Link
                to="/student/recommendations"
                className="flex items-center gap-2 px-6 py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39] transition-colors"
              >
                View Course Recommendations
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/student/university-search"
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Search Universities
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
