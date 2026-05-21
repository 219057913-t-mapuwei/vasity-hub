import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { Link } from "react-router";
import { universities, courses, getStudentProfile } from "../../store";
import { Search, MapPin, Star, BookOpen, Sparkles } from "lucide-react";

export function UniversitySearch() {
  const profile = getStudentProfile();
  const aps = profile.finalAPS || profile.grade12APS || profile.grade11APS || 0;

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [apsFilter, setApsFilter] = useState("");
  const [compareList, setCompareList] = useState<string[]>([]);

  const locations = [...new Set(universities.map(u => u.location.split(',')[1].trim()))];

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          uni.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || uni.location.includes(locationFilter);
    return matchesSearch && matchesLocation;
  });

  const getUniversityCourses = (universityName: string) => {
    let universityCourses = courses.filter(c => c.university === universityName);
    if (apsFilter) {
      const maxAPS = parseInt(apsFilter);
      universityCourses = universityCourses.filter(c => c.apsRequired <= maxAPS);
    }
    // Sort to show featured courses first
    universityCourses.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
    return universityCourses;
  };

  const toggleCompare = (uniId: string) => {
    if (compareList.includes(uniId)) {
      setCompareList(compareList.filter(id => id !== uniId));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, uniId]);
    }
  };

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">University Search</h1>
            <p className="text-gray-600">Find and compare universities across South Africa</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search universities..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select
                value={apsFilter}
                onChange={(e) => setApsFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
              >
                <option value="">All APS Requirements</option>
                <option value="30">Up to 30 APS</option>
                <option value="35">Up to 35 APS</option>
                <option value="40">Up to 40 APS</option>
              </select>

              {aps > 0 && (
                <div className="px-4 py-3 bg-[#007A4D]/5 border border-[#007A4D]/20 rounded-lg flex items-center gap-2">
                  <span className="text-sm text-gray-700">Your APS:</span>
                  <span className="font-bold text-[#007A4D]">{aps}</span>
                </div>
              )}
            </div>

            {compareList.length > 0 && (
              <div className="mt-4 p-3 bg-[#FFB612]/10 border border-[#FFB612]/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {compareList.length} universities selected for comparison
                  </span>
                  <button className="px-4 py-2 bg-[#FFB612] text-gray-900 rounded-lg text-sm font-medium hover:bg-[#e5a510]">
                    Compare
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Universities Grid */}
          <div className="space-y-6">
            {filteredUniversities.map(university => {
              const universityCourses = getUniversityCourses(university.name);
              const isComparing = compareList.includes(university.id);

              return (
                <div key={university.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-80 h-64 md:h-auto overflow-hidden">
                      <img
                        src={university.imageUrl}
                        alt={university.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{university.name}</h3>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} />
                            <span>{university.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 px-3 py-1 bg-[#FFB612]/20 rounded-lg">
                            <Star size={16} className="text-[#FFB612]" fill="#FFB612" />
                            <span className="font-semibold text-gray-900">#{university.ranking}</span>
                          </div>
                          <button
                            onClick={() => toggleCompare(university.id)}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                              isComparing
                                ? 'border-[#007A4D] bg-[#007A4D] text-white'
                                : 'border-gray-300 text-gray-700 hover:border-[#007A4D]'
                            }`}
                          >
                            {isComparing ? 'Added' : 'Compare'}
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                          <BookOpen size={16} />
                          <span className="font-medium">{universityCourses.length} courses available</span>
                          {apsFilter && <span className="text-gray-500">(filtered by APS)</span>}
                        </div>
                      </div>

                      {/* Course Pills */}
                      <div className="flex flex-wrap gap-2">
                        {universityCourses.slice(0, 5).map(course => (
                          <div
                            key={course.id}
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
                              course.isFeatured
                                ? 'bg-gradient-to-r from-[#FFB612] to-[#e5a510] text-gray-900 font-medium'
                                : 'bg-gray-100'
                            }`}
                          >
                            {course.isFeatured && <Sparkles size={14} className="text-gray-900" />}
                            <span className="font-medium text-gray-900">{course.name}</span>
                            <span className={course.isFeatured ? 'text-gray-800 ml-1' : 'text-gray-600 ml-2'}>
                              • APS {course.apsRequired}
                            </span>
                            {course.isFeatured && (
                              <span className="ml-1 px-1.5 py-0.5 bg-white/50 rounded text-xs font-bold">
                                FEATURED
                              </span>
                            )}
                          </div>
                        ))}
                        {universityCourses.length > 5 && (
                          <div className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
                            +{universityCourses.length - 5} more
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <Link
                          to="/student/apply"
                          className="inline-block px-6 py-2.5 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39] transition-colors"
                        >
                          View Courses & Apply
                        </Link>
                      </div>
                    </div>
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
