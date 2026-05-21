import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { courses } from "../../store";
import { GraduationCap, Edit, Plus, DollarSign, AlertCircle, Sparkles } from "lucide-react";

export function CourseManagement() {
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [apsRequirement, setApsRequirement] = useState<{ [key: string]: number }>({});

  const universityCourses = courses.filter(c => c.university === 'University of Cape Town');

  const handleEditAPS = (courseId: string, currentAPS: number) => {
    setEditingCourse(courseId);
    setApsRequirement({ ...apsRequirement, [courseId]: currentAPS });
  };

  const handleSaveAPS = (courseId: string) => {
    alert(`APS requirement updated to ${apsRequirement[courseId]}`);
    setEditingCourse(null);
  };

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
            <p className="text-gray-600">Manage courses and admission requirements</p>
          </div>

          {/* Billing Warning */}
          <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Billing Notice</h3>
              <p className="text-sm text-amber-800 mb-2">
                Adding or modifying courses may incur billing charges. Standard rates apply:
              </p>
              <ul className="text-sm text-amber-800 space-y-1 ml-4">
                <li>• Course listing fee: <strong>R3,000</strong> per course per quarter</li>
                <li>• Featured course promotion: <strong>R6,000</strong> per course per quarter</li>
              </ul>
            </div>
          </div>

          {/* Add Course Button */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => alert('Add Course Modal\n\nIn a real system, this would open a form to add a new course.\n\nNote: This action will incur a billing charge of R3,000 per quarter.')}
              className="flex items-center gap-2 px-6 py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39]"
            >
              <Plus size={20} />
              Add New Course
            </button>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <GraduationCap size={24} className="text-[#007A4D]" />
                <h2 className="text-xl font-bold text-gray-900">
                  Available Courses ({universityCourses.length})
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">APS Required</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {universityCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{course.name}</p>
                          <p className="text-sm text-gray-500">{course.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#007A4D]/10 text-[#007A4D] rounded-full text-sm font-medium">
                          {course.field}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{course.duration}</td>
                      <td className="px-6 py-4">
                        {editingCourse === course.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={apsRequirement[course.id]}
                              onChange={(e) => setApsRequirement({
                                ...apsRequirement,
                                [course.id]: parseInt(e.target.value)
                              })}
                              className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#007A4D]"
                              min="0"
                              max="50"
                            />
                            <button
                              onClick={() => handleSaveAPS(course.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCourse(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-[#007A4D]">{course.apsRequired}</span>
                            <button
                              onClick={() => handleEditAPS(course.id, course.apsRequired)}
                              className="text-gray-400 hover:text-[#007A4D]"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <button className="text-[#007A4D] font-medium hover:underline text-sm text-left">
                            View Details
                          </button>
                          {course.isFeatured ? (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-gradient-to-r from-[#FFB612] to-[#e5a510] text-gray-900 rounded text-xs font-bold flex items-center gap-1">
                                <Sparkles size={12} />
                                FEATURED
                              </span>
                              <button
                                onClick={() => alert('Remove Featured Status\n\nThis will save R6,000 per quarter in billing charges.')}
                                className="text-xs text-gray-500 hover:text-gray-700"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => alert('Promote Course\n\nMake this course featured for R6,000 per quarter.\n\nFeatured courses appear at the top of search results with special highlighting.')}
                              className="text-xs text-[#FFB612] font-medium hover:underline flex items-center gap-1"
                            >
                              <Sparkles size={12} />
                              Promote Course (R6,000/quarter)
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">About APS Requirements</h3>
            <p className="text-sm text-blue-800">
              APS (Admission Point Score) requirements determine the minimum academic standard for course admission.
              Changes to APS requirements will affect future applications and be communicated to prospective students.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
