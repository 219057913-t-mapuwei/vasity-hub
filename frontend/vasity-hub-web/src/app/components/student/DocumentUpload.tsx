import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { getStudentProfile, updateStudentProfile, Document } from "../../store";
import { Upload, File, CheckCircle, XCircle, Clock } from "lucide-react";

export function DocumentUpload() {
  const profile = getStudentProfile();
  const [uploading, setUploading] = useState(false);

  const requiredDocuments = profile.studentType === 'foreign'
    ? [
        'Passport Copy',
        'Academic Transcript',
        'Final School Qualification',
        'SAQA / USAf Evaluation',
        'Study Visa / Permit',
        'Medical Cover Proof',
        'Sworn Translations where applicable',
        'Proof of Payment',
      ]
    : [
        'Certified ID Copy',
        'Academic Transcript',
        'Proof of Residence',
        'Matric Certificate',
        'Proof of Payment',
      ];

  const handleFileUpload = (docType: string) => {
    setUploading(true);

    setTimeout(() => {
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        name: docType,
        type: 'PDF',
        status: 'pending',
        uploadedDate: new Date().toISOString(),
      };

      updateStudentProfile({
        documents: [...profile.documents, newDocument],
      });

      setUploading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />;
      case 'pending':
        return <Clock className="text-amber-600" size={20} />;
      default:
        return <File className="text-gray-400" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      pending: 'bg-amber-100 text-amber-700',
      uploaded: 'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
                <p className="text-gray-600">Upload and manage your application documents</p>
              </div>
              <div className="px-4 py-3 bg-[#007A4D]/10 border border-[#007A4D]/30 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Student Identifierifier)</p>
                <p className="font-mono font-bold text-gray-900 text-lg">{profile.studentType === 'foreign' ? profile.passportNumber : profile.saId}</p>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Required Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredDocuments.map((docType) => {
                const uploaded = profile.documents.find(d => d.name === docType);

                return (
                  <div key={docType} className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{docType}</h3>
                      {uploaded && getStatusIcon(uploaded.status)}
                    </div>

                    {uploaded ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Uploaded: {new Date(uploaded.uploadedDate).toLocaleDateString()}
                          </span>
                          {getStatusBadge(uploaded.status)}
                        </div>
                        <button
                          onClick={() => handleFileUpload(docType)}
                          className="text-sm text-[#007A4D] font-medium hover:underline"
                          disabled={uploading}
                        >
                          Replace document
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleFileUpload(docType)}
                        disabled={uploading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#007A4D] text-white rounded-lg hover:bg-[#005a39] transition-colors disabled:opacity-50"
                      >
                        <Upload size={16} />
                        {uploading ? 'Uploading...' : 'Upload'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Uploaded Documents Table */}
          {profile.documents.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Uploaded Documents</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {profile.documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(doc.status)}
                            <span className="font-medium text-gray-900">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(doc.uploadedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                        <td className="px-6 py-4">
                          <button className="text-sm text-[#007A4D] font-medium hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Document Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All documents must be certified copies</li>
              <li>• Accepted formats: PDF, JPG, PNG (max 5MB per file)</li>
              <li>• Documents are verified within 48 hours</li>
              <li>• Rejected documents will need to be re-uploaded</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
