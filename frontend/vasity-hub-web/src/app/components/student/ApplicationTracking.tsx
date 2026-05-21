import { Navigation } from "../shared/Navigation";
import { getStudentProfile } from "../../store";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, CreditCard } from "lucide-react";

export function ApplicationTracking() {
  const profile = getStudentProfile();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="text-blue-600" size={24} />;
      case 'under_review':
        return <AlertCircle className="text-amber-600" size={24} />;
      case 'accepted':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={24} />;
      case 'waitlisted':
        return <Clock className="text-yellow-600" size={24} />;
      default:
        return <FileText className="text-gray-400" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'under_review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'waitlisted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTimeline = (status: string) => {
    const baseSteps = [
      { label: 'Submitted', completed: true },
      { label: 'Under Review', completed: false },
      { label: 'Decision', completed: false },
    ];

    if (status === 'under_review') {
      baseSteps[1].completed = true;
    } else if (status === 'accepted' || status === 'rejected' || status === 'waitlisted') {
      baseSteps[1].completed = true;
      baseSteps[2].completed = true;
    }

    return baseSteps;
  };

  if (profile.applications.length === 0) {
    return (
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <FileText size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Applications Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't submitted any applications. Start your university journey by applying to courses.
            </p>
            <a
              href="/student/apply"
              className="inline-block px-6 py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39]"
            >
              Apply to Courses
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
              <p className="text-gray-600">Track the status of your university applications</p>
            </div>
            <div className="px-4 py-3 bg-[#007A4D]/10 border border-[#007A4D]/30 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">South African ID (Primary Identifier)</p>
              <p className="font-mono font-bold text-gray-900 text-lg">{profile.saId}</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{profile.applications.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Under Review</p>
              <p className="text-2xl font-bold text-amber-600">
                {profile.applications.filter(a => a.status === 'under_review').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Accepted</p>
              <p className="text-2xl font-bold text-green-600">
                {profile.applications.filter(a => a.status === 'accepted').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-blue-600">
                {profile.applications.filter(a => a.status === 'submitted').length}
              </p>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            {profile.applications.map((application) => {
              const timeline = getTimeline(application.status);

              return (
                <div key={application.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${getStatusColor(application.status)} border`}>
                          {getStatusIcon(application.status)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{application.courseName}</h3>
                          <p className="text-gray-600">{application.university}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Submitted: {new Date(application.submittedDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Updated: {new Date(application.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          {/* Payment Status */}
                          <div className="mt-3 flex items-center gap-2">
                            <CreditCard size={16} className={
                              application.paymentStatus === 'paid' ? 'text-green-600' :
                              application.paymentStatus === 'failed' ? 'text-red-600' :
                              'text-amber-600'
                            } />
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              application.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                              application.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              Payment: {application.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)} border`}>
                        {application.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="mt-6">
                      <div className="flex items-center">
                        {timeline.map((step, index) => (
                          <div key={index} className="flex-1 flex items-center">
                            <div className="flex flex-col items-center flex-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                step.completed
                                  ? 'bg-[#007A4D] border-[#007A4D]'
                                  : 'bg-white border-gray-300'
                              }`}>
                                {step.completed ? (
                                  <CheckCircle className="text-white" size={20} />
                                ) : (
                                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                )}
                              </div>
                              <span className={`mt-2 text-xs font-medium ${
                                step.completed ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                            {index < timeline.length - 1 && (
                              <div className={`h-0.5 flex-1 ${
                                step.completed ? 'bg-[#007A4D]' : 'bg-gray-300'
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Messages */}
                    {application.status === 'accepted' && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Congratulations!</strong> Your application has been accepted. Check your email for next steps regarding registration.
                        </p>
                      </div>
                    )}
                    {application.status === 'rejected' && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          Unfortunately, your application was not successful. Consider applying to other programs that match your profile.
                        </p>
                      </div>
                    )}
                    {application.status === 'waitlisted' && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          You've been placed on the waiting list. We'll notify you if a spot becomes available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
