import { Navigation } from "../shared/Navigation";
import { Link } from "react-router";
import { getStudentProfile } from "../../store";
import { Award, Target, GraduationCap, FileCheck, AlertCircle, TrendingUp, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";

export function StudentDashboard() {
  const profile = getStudentProfile();

  const apsScore = profile.grade12APS || profile.finalAPS || profile.grade11APS;
  const apsType = profile.grade12APS || profile.finalAPS ? 'Final APS' : profile.grade11APS ? 'Estimated APS' : 'Not calculated';
  const apsBadgeColor = profile.grade12APS || profile.finalAPS ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';

  const stats = [
    {
      label: 'APS Score',
      value: apsScore || 'Not calculated',
      subtext: apsType,
      badge: apsScore ? (profile.grade12APS || profile.finalAPS ? 'FINAL' : 'ESTIMATED') : null,
      badgeColor: apsBadgeColor,
      icon: <Award size={24} />,
      color: 'bg-[#007A4D]'
    },
    {
      label: 'Career Test',
      value: profile.careerTestCompleted ? 'Completed' : 'Not started',
      subtext: profile.careerTestCompleted ? profile.careerProfile?.personalityType : '',
      icon: <Target size={24} />,
      color: 'bg-[#FFB612]'
    },
    {
      label: 'Applications',
      value: profile.applications.length.toString(),
      subtext: `of 5 maximum`,
      icon: <FileCheck size={24} />,
      color: 'bg-[#007A4D]'
    },
  ];

  const quickActions = [
    { label: 'Calculate APS', path: '/student/grades', available: !profile.grade11APS },
    { label: 'Take Career Test', path: '/student/career-test', available: !profile.careerTestCompleted },
    { label: 'View Recommendations', path: '/student/recommendations', available: profile.finalAPS !== undefined && profile.careerTestCompleted },
    { label: 'Search Universities', path: '/student/university-search', available: true },
    { label: 'Apply to Course', path: '/student/apply', available: profile.applications.length < 5 },
  ];

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#007A4D] to-[#005a39] text-white">
          <div className="px-8 py-12">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {profile.name}</h1>
            <div className="flex items-center gap-4 mt-3">
              <p className="text-lg opacity-90">Track your academic progress and applications</p>
              <span className="px-4 py-2 bg-white/20 rounded-lg border border-white/30">
                <span className="text-xs opacity-75 block">SA ID (Primary Identifier)</span>
                <span className="font-mono font-bold text-sm">{profile.saId}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          {/* Alert if missing key steps */}
          {(!profile.grade11APS || !profile.careerTestCompleted) && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-amber-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-amber-900">Complete your profile</h3>
                <p className="text-sm text-amber-800 mt-1">
                  {!profile.grade11APS && 'Calculate your APS score. '}
                  {!profile.careerTestCompleted && 'Take the career test to get personalized recommendations.'}
                </p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.color} text-white p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                  {stat.badge && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${stat.badgeColor}`}>
                      {stat.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.subtext && (
                    <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Your APS per University */}
          {profile.universityAPS && profile.universityAPS.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="text-[#007A4D]" size={24} />
                Your APS per University
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Different universities calculate APS differently. Your score varies based on each institution's specific requirements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {profile.universityAPS.map((uniAPS) => (
                  <div key={uniAPS.universityId} className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#007A4D] transition-colors">
                    <p className="text-sm font-medium text-gray-700 mb-2">{uniAPS.universityName}</p>
                    <p className="text-3xl font-bold text-[#007A4D] mb-1">{uniAPS.apsScore}</p>
                    <p className="text-xs text-gray-500 leading-tight">{uniAPS.calculationMethod}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className={`block p-4 rounded-lg border transition-all ${
                      action.available
                        ? 'border-gray-200 hover:border-[#007A4D] hover:bg-[#007A4D]/5'
                        : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{action.label}</span>
                      {action.available && (
                        <TrendingUp size={18} className="text-[#007A4D]" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Applications</h2>
              {profile.applications.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No applications yet</p>
                  <Link
                    to="/student/apply"
                    className="mt-4 inline-block text-[#007A4D] font-medium hover:underline"
                  >
                    Start your first application
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.applications.slice(0, 3).map((app) => (
                    <div key={app.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{app.courseName}</p>
                          <p className="text-sm text-gray-600 mt-1">{app.university}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          app.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'waitlisted' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                  {profile.applications.length > 3 && (
                    <Link
                      to="/student/applications"
                      className="block text-center py-2 text-[#007A4D] font-medium hover:underline"
                    >
                      View all applications
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          {profile.payments && profile.payments.length > 0 && (
            <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="text-[#007A4D]" size={24} />
                Payment History
              </h2>
              <div className="space-y-3">
                {profile.payments.slice(0, 5).map((payment) => {
                  const application = profile.applications.find(app => app.id === payment.applicationId);
                  return (
                    <div key={payment.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          {payment.status === 'paid' && <CheckCircle className="text-green-600" size={20} />}
                          {payment.status === 'failed' && <XCircle className="text-red-600" size={20} />}
                          {payment.status === 'pending' && <Clock className="text-amber-600" size={20} />}
                          {payment.status === 'refunded' && <AlertCircle className="text-amber-600" size={20} />}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {application?.courseName || 'Application Fee'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(payment.createdDate).toLocaleDateString()} · {payment.method.toUpperCase()}
                              {payment.referenceNumber && <span className="ml-2 font-mono text-xs">Ref: {payment.referenceNumber.slice(-8)}</span>}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">R{payment.amount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                            payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                            payment.status === 'refunded' ? 'bg-amber-100 text-amber-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                      {payment.status === 'paid' && (
                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => alert('Receipt downloaded!\n\nIn a real system, this would download a PDF receipt.')}
                            className="px-4 py-2 bg-[#007A4D] text-white rounded text-sm font-medium hover:bg-[#005a39] flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Receipt
                          </button>
                          <button
                            onClick={() => alert(`Receipt sent to ${profile.email}`)}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
                          >
                            Email Receipt
                          </button>
                        </div>
                      )}
                      {payment.status === 'refunded' && payment.refundReason && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                          <p className="font-medium">Refund Reason:</p>
                          <p>{payment.refundReason}</p>
                          {payment.refundDate && (
                            <p className="text-xs mt-1">Refunded on: {new Date(payment.refundDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {profile.payments.length > 5 && (
                  <Link
                    to="/student/applications"
                    className="block text-center py-2 text-[#007A4D] font-medium hover:underline text-sm"
                  >
                    View all payments
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Recommendations preview */}
          {profile.finalAPS && profile.careerTestCompleted && (
            <div className="mt-6 bg-gradient-to-r from-[#007A4D] to-[#005a39] text-white p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Your Recommendations are Ready</h2>
              <p className="mb-4 opacity-90">Based on your APS score and career test results, we have personalized course and university recommendations for you.</p>
              <Link
                to="/student/recommendations"
                className="inline-block bg-[#FFB612] text-gray-900 px-6 py-2.5 rounded-lg font-medium hover:bg-[#e5a510] transition-colors"
              >
                View Recommendations
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
