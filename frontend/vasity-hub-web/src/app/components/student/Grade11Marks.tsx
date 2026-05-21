import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { useNavigate } from "react-router";
import { calculateAPS, calculateAllUniversityAPS, updateStudentProfile, getStudentProfile } from "../../store";
import { Calculator, Check, Award } from "lucide-react";

const subjects = [
  'English Home Language',
  'Mathematics',
  'Physical Sciences',
  'Life Sciences',
  'Accounting',
  'Business Studies',
  'Geography',
];

export function Grade11Marks() {
  const navigate = useNavigate();
  const profile = getStudentProfile();
  const [marks, setMarks] = useState<{ [key: string]: number }>({});
  const [nbtScore, setNbtScore] = useState<number | undefined>(undefined);
  const [calculated, setCalculated] = useState(false);
  const [aps, setAps] = useState<number | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');

  const handleMarkChange = (subject: string, value: string) => {
    const mark = parseInt(value) || 0;
    setMarks({ ...marks, [subject]: mark });
  };

  const handleCalculate = () => {
    const subjectArray = Object.entries(marks).map(([subject, mark]) => ({
      subject,
      mark,
    }));

    if (subjectArray.length < 6) {
      alert('Please enter at least 6 subjects');
      return;
    }

    const calculatedAPS = calculateAPS(subjectArray);
    const universityAPSScores = calculateAllUniversityAPS(subjectArray, nbtScore);

    setAps(calculatedAPS);
    setCalculated(true);

    updateStudentProfile({
      grade11APS: calculatedAPS,
      finalAPS: profile.grade12APS || calculatedAPS,
      subjects: subjectArray,
      universityAPS: universityAPSScores,
    });
  };

  const handleSave = () => {
    navigate('/student/dashboard');
  };

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Grade 11 Marks</h1>
            <p className="text-gray-600">Enter your Grade 11 marks to calculate your estimated APS score</p>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm text-gray-600">SA ID:</span>
              <span className="font-mono font-bold text-gray-900">{profile.saId}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-1">About APS Calculation</h3>
              <p className="text-sm text-blue-800">
                The Admission Point Score (APS) is calculated based on your subject marks. Each subject mark is converted to points (1-7), and the total gives your APS score.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {subjects.map((subject) => (
                <div key={subject} className="flex items-center gap-4">
                  <label className="flex-1 font-medium text-gray-700">{subject}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marks[subject] || ''}
                    onChange={(e) => handleMarkChange(subject, e.target.value)}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                    placeholder="0-100"
                  />
                </div>
              ))}
            </div>

            <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-lg">
              <label className="block font-medium text-gray-700 mb-2">
                NBT Score (Optional - Required for UCT)
              </label>
              <input
                type="number"
                min="0"
                max="200"
                value={nbtScore || ''}
                onChange={(e) => setNbtScore(parseInt(e.target.value) || undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                placeholder="Enter NBT score (0-200)"
              />
              <p className="text-xs text-amber-700 mt-2">
                Some universities like UCT require NBT scores. If you haven't written NBT yet, leave this blank.
              </p>
            </div>

            {!calculated ? (
              <button
                onClick={handleCalculate}
                className="w-full bg-[#007A4D] text-white py-3 rounded-lg font-medium hover:bg-[#005a39] transition-colors flex items-center justify-center gap-2"
              >
                <Calculator size={20} />
                Calculate Estimated APS
              </button>
            ) : (
              <div>
                <div className="mb-6 p-6 bg-gradient-to-r from-[#007A4D] to-[#005a39] text-white rounded-lg text-center">
                  <p className="text-sm opacity-90 mb-2">Estimated APS Score</p>
                  <p className="text-5xl font-bold">{aps}</p>
                  <p className="text-sm mt-3 opacity-90">
                    This is an estimated score based on your Grade 11 marks.
                    It will be updated automatically when your Grade 12 results are available.
                  </p>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full bg-[#FFB612] text-gray-900 py-3 rounded-lg font-medium hover:bg-[#e5a510] transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Save and Continue
                </button>
              </div>
            )}
          </div>

          {calculated && profile.universityAPS && profile.universityAPS.length > 0 && (
            <>
              <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="text-[#007A4D]" size={24} />
                  Your APS per University
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Each university calculates APS differently. Here's your score for each institution:
                </p>

                {/* University Selector Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select University for Details
                  </label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  >
                    <option value="">All Universities</option>
                    {profile.universityAPS.map((uniAPS) => (
                      <option key={uniAPS.universityId} value={uniAPS.universityId}>
                        {uniAPS.universityName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* University APS Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.universityAPS
                    .filter(uniAPS => !selectedUniversity || uniAPS.universityId === selectedUniversity)
                    .map((uniAPS) => (
                      <div key={uniAPS.universityId} className="p-4 border-2 border-[#007A4D] rounded-lg bg-[#007A4D]/5">
                        <p className="text-sm font-medium text-gray-700 mb-1">{uniAPS.universityName}</p>
                        <p className="text-4xl font-bold text-[#007A4D] mb-2">{uniAPS.apsScore}</p>
                        <p className="text-xs text-gray-600 leading-tight">
                          <strong>Method:</strong> {uniAPS.calculationMethod}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>✓ Your estimated APS has been saved</p>
                  <p>✓ University-specific APS scores have been calculated</p>
                  <p>• Take the career test to get personalized recommendations</p>
                  <p>• Your APS will be automatically updated when Grade 12 results are available</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
