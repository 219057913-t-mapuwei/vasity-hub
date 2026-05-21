import { Navigation } from "../shared/Navigation";
import { Link } from "react-router";
import { getStudentProfile, getRecommendations, Course, University } from "../../store";
import { GraduationCap, School, Briefcase, TrendingUp, AlertCircle } from "lucide-react";

export function Recommendations() {
  const profile = getStudentProfile();
  const aps = profile.finalAPS || profile.grade12APS || profile.grade11APS;

  if (!aps || !profile.careerTestCompleted) {
    return (
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <AlertCircle size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile First</h2>
            <p className="text-gray-600 mb-6">
              To receive personalized recommendations, you need to:
            </p>
            <div className="space-y-3 mb-6">
              {!aps && (
                <Link
                  to="/student/grades"
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-[#007A4D] transition-colors"
                >
                  <p className="font-medium text-gray-900">Calculate your APS score</p>
                </Link>
              )}
              {!profile.careerTestCompleted && (
                <Link
                  to="/student/career-test"
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-[#007A4D] transition-colors"
                >
                  <p className="font-medium text-gray-900">Complete the career test</p>
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const recommendations = getRecommendations(aps, profile.careerProfile);
  const courseRecs = recommendations.filter(r => r.type === 'course');
  const universityRecs = recommendations.filter(r => r.type === 'university');
  const careerRecs = recommendations.filter(r => r.type === 'career');

  const getMatchBadge = (match: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-orange-100 text-orange-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[match]}`}>
        {match.toUpperCase()} MATCH
      </span>
    );
  };

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Recommendations</h1>
              <p className="text-gray-600">
                Based on your APS score of <span className="font-bold text-[#007A4D]">{aps}</span> and career profile
              </p>
            </div>
            <div className="px-4 py-3 bg-[#007A4D]/10 border border-[#007A4D]/30 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">SA ID</p>
              <p className="font-mono font-bold text-gray-900">{profile.saId}</p>
            </div>
          </div>

          {/* Recommended Courses */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap size={28} className="text-[#007A4D]" />
              <h2 className="text-2xl font-bold text-gray-900">Recommended Courses</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {courseRecs.map((rec, index) => {
                const course = rec.item as Course;
                return (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#007A4D] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900">{course.name}</h3>
                      {getMatchBadge(rec.matchScore)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{course.university}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>APS Required: <span className="font-semibold text-gray-900">{course.apsRequired}</span></span>
                      <span>•</span>
                      <span>{course.duration}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">{rec.reason}</p>
                    <Link
                      to="/student/apply"
                      className="inline-flex items-center gap-2 text-[#007A4D] font-medium hover:underline"
                    >
                      Apply Now
                      <TrendingUp size={16} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Universities */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <School size={28} className="text-[#007A4D]" />
              <h2 className="text-2xl font-bold text-gray-900">Recommended Universities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {universityRecs.map((rec, index) => {
                const university = rec.item as University;
                return (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-[#007A4D] transition-colors">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={university.imageUrl}
                        alt={university.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{university.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{university.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Rank #{university.ranking}</span>
                        {getMatchBadge(rec.matchScore)}
                      </div>
                      <Link
                        to="/student/university-search"
                        className="mt-3 block text-center py-2 text-[#007A4D] font-medium text-sm hover:underline"
                      >
                        View Courses
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggested Career Roles */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Briefcase size={28} className="text-[#007A4D]" />
              <h2 className="text-2xl font-bold text-gray-900">Suggested Career Roles</h2>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {careerRecs.map((rec, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#FFB612] rounded-lg flex items-center justify-center">
                        <Briefcase size={20} className="text-gray-900" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{rec.item as string}</h3>
                        {getMatchBadge(rec.matchScore)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 bg-gradient-to-r from-[#007A4D] to-[#005a39] text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Ready to Apply?</h2>
            <p className="mb-6 opacity-90">Start your university application journey today</p>
            <div className="flex gap-4">
              <Link
                to="/student/apply"
                className="px-6 py-3 bg-[#FFB612] text-gray-900 rounded-lg font-medium hover:bg-[#e5a510] transition-colors"
              >
                Apply to Courses
              </Link>
              <Link
                to="/student/university-search"
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Explore More Universities
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
