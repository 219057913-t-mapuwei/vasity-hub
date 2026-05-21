import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { Upload, FileText, CheckCircle, AlertCircle, Users, TrendingUp } from "lucide-react";

export function DOEDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [validationResults, setValidationResults] = useState<{
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
      setValidationResults(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus('validating');

    setTimeout(() => {
      const mockResults = {
        totalRecords: 150,
        validRecords: 147,
        invalidRecords: 3,
        errors: [
          'Row 45: Invalid SA ID number format (must be 13 digits)',
          'Row 78: Missing subject marks',
          'Row 123: SA ID not found in system - student not registered',
        ],
      };

      setValidationResults(mockResults);
      setUploadStatus('success');
      setUploading(false);
    }, 3000);
  };

  const uploadHistory = [
    {
      id: '1',
      fileName: 'Grade12_Results_2026_Q1.csv',
      uploadDate: '2026-04-01',
      records: 2500,
      status: 'processed',
    },
    {
      id: '2',
      fileName: 'Grade12_Results_2026_Q2.csv',
      uploadDate: '2026-03-15',
      records: 2300,
      status: 'processed',
    },
    {
      id: '3',
      fileName: 'Grade12_Results_2026_Q3.csv',
      uploadDate: '2026-02-28',
      records: 2400,
      status: 'processed',
    },
  ];

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Education Department Admin Dashboard</h1>
            <p className="text-gray-600">Department of Education - Grade 12 Results Management</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#007A4D] rounded-lg flex items-center justify-center">
                  <FileText className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Uploads</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500 mt-2">This year</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#FFB612] rounded-lg flex items-center justify-center">
                  <Users className="text-gray-900" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Results Processed</p>
              <p className="text-3xl font-bold text-gray-900">7,200</p>
              <p className="text-xs text-green-600 mt-2">↑ 100% match rate</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">APS Updated</p>
              <p className="text-3xl font-bold text-green-600">6,850</p>
              <p className="text-xs text-gray-500 mt-2">Student records updated</p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white p-8 rounded-lg border border-gray-200 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Upload size={24} className="text-[#007A4D]" />
              <h2 className="text-xl font-bold text-gray-900">Upload Grade 12 Results</h2>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">File Requirements</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Format: CSV file only</li>
                <li>• <strong>Required columns: SA ID Number (13 digits), Subject, Mark</strong></li>
                <li>• Maximum file size: 50MB</li>
                <li>• <strong>SA ID Number is the primary identifier - must match registered students</strong></li>
                <li>• System automatically matches results to students using SA ID</li>
              </ul>
            </div>

            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-700 mb-2">
                  {file ? file.name : 'Drag and drop your CSV file here, or click to browse'}
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block mt-2 px-6 py-2 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39] cursor-pointer"
                >
                  Select File
                </label>
              </div>
            </div>

            {file && (
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#007A4D]" size={24} />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-6 py-2 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Processing...' : 'Upload & Validate'}
                  </button>
                </div>
              </div>
            )}

            {/* Validation Status */}
            {uploadStatus === 'validating' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <p className="font-medium text-blue-900">Validating file...</p>
                  <p className="text-sm text-blue-700">Checking file format and matching student records</p>
                </div>
              </div>
            )}

            {uploadStatus === 'success' && validationResults && (
              <div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600" size={24} />
                    <div className="flex-1">
                      <p className="font-medium text-green-900 mb-2">Validation Complete</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-green-700">Total Records</p>
                          <p className="text-2xl font-bold text-green-900">{validationResults.totalRecords}</p>
                        </div>
                        <div>
                          <p className="text-green-700">Valid Records</p>
                          <p className="text-2xl font-bold text-green-900">{validationResults.validRecords}</p>
                        </div>
                        <div>
                          <p className="text-green-700">Invalid Records</p>
                          <p className="text-2xl font-bold text-red-600">{validationResults.invalidRecords}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {validationResults.invalidRecords > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-amber-600" size={20} />
                      <div>
                        <p className="font-medium text-amber-900 mb-2">Validation Errors</p>
                        <ul className="text-sm text-amber-800 space-y-1">
                          {validationResults.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39]">
                    Process Valid Records ({validationResults.validRecords})
                  </button>
                  <button className="px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50">
                    Download Error Report
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload History */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Upload History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {uploadHistory.map((upload) => (
                    <tr key={upload.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="text-[#007A4D]" size={20} />
                          <span className="font-medium text-gray-900">{upload.fileName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(upload.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {upload.records.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {upload.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[#007A4D] font-medium hover:underline text-sm">
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-gradient-to-r from-[#007A4D] to-[#005a39] text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Automated APS Calculation Using SA ID</h2>
            <p className="mb-4 opacity-90">
              South African ID number is the primary identifier for matching Grade 12 results. When results are uploaded, the system automatically:
            </p>
            <ul className="space-y-2 opacity-90">
              <li>✓ <strong>Matches student records by SA ID number (13 digits)</strong></li>
              <li>✓ Validates SA ID format and checks against registered students</li>
              <li>✓ Calculates final APS scores based on subject marks</li>
              <li>✓ Overrides Grade 11 estimated APS scores</li>
              <li>✓ Triggers notification to students about updated scores</li>
              <li>✓ Updates university application eligibility across all systems</li>
              <li>✓ Ensures data integrity across Vasity Hub, universities, and Education Department databases</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
