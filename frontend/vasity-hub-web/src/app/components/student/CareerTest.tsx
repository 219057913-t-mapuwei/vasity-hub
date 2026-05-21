import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { useNavigate } from "react-router";
import { updateStudentProfile, CareerProfile } from "../../store";
import { ChevronRight, ChevronLeft } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "I enjoy working with numbers and solving mathematical problems",
    category: "analytical"
  },
  {
    id: 2,
    question: "I like helping people and making a difference in their lives",
    category: "social"
  },
  {
    id: 3,
    question: "I am creative and enjoy expressing myself through art or design",
    category: "creative"
  },
  {
    id: 4,
    question: "I prefer working with technology and computers",
    category: "technical"
  },
  {
    id: 5,
    question: "I enjoy leading teams and organizing projects",
    category: "leadership"
  },
  {
    id: 6,
    question: "I like researching and discovering new information",
    category: "investigative"
  },
  {
    id: 7,
    question: "I am good at persuading and influencing others",
    category: "enterprising"
  },
  {
    id: 8,
    question: "I enjoy hands-on work and building things",
    category: "practical"
  },
  {
    id: 9,
    question: "I care about environmental and social issues",
    category: "social"
  },
  {
    id: 10,
    question: "I like analyzing data and finding patterns",
    category: "analytical"
  },
];

export function CareerTest() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const categoryScores: { [key: string]: number } = {};

    questions.forEach((q, index) => {
      const answer = answers[index] || 0;
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = 0;
      }
      categoryScores[q.category] += answer;
    });

    const topCategories = Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    const careerMapping: { [key: string]: string[] } = {
      analytical: ['Data Scientist', 'Financial Analyst', 'Actuary'],
      social: ['Social Worker', 'Teacher', 'Nurse'],
      creative: ['Graphic Designer', 'Architect', 'Marketing Specialist'],
      technical: ['Software Engineer', 'IT Specialist', 'Network Administrator'],
      leadership: ['Business Manager', 'Project Manager', 'Entrepreneur'],
      investigative: ['Research Scientist', 'Psychologist', 'Medical Doctor'],
      enterprising: ['Sales Manager', 'Lawyer', 'Business Consultant'],
      practical: ['Engineer', 'Electrician', 'Construction Manager'],
    };

    const suggestedCareers = topCategories.flatMap(([category]) =>
      careerMapping[category] || []
    ).slice(0, 5);

    const skills = topCategories.map(([category, score]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      score: Math.round((score / 50) * 100),
    }));

    const personalityType = topCategories[0][0].charAt(0).toUpperCase() + topCategories[0][0].slice(1);

    const profile: CareerProfile = {
      personalityType,
      suggestedCareers,
      skills,
      interests: topCategories.map(([cat]) => cat),
    };

    updateStudentProfile({
      careerTestCompleted: true,
      careerProfile: profile,
    });

    navigate('/student/career-results');
  };

  const currentQ = questions[currentQuestion];
  const hasAnswer = answers[currentQuestion] !== undefined;

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Assessment Test</h1>
            <p className="text-gray-600">Answer honestly to get personalized career recommendations</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#007A4D] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQ.question}</h2>

            <div className="space-y-4">
              {[
                { value: 5, label: 'Strongly Agree' },
                { value: 4, label: 'Agree' },
                { value: 3, label: 'Neutral' },
                { value: 2, label: 'Disagree' },
                { value: 1, label: 'Strongly Disagree' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    answers[currentQuestion] === value
                      ? 'border-[#007A4D] bg-[#007A4D]/5'
                      : 'border-gray-200 hover:border-[#007A4D]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{label}</span>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      answers[currentQuestion] === value
                        ? 'border-[#007A4D] bg-[#007A4D]'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion] === value && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#007A4D] text-white hover:bg-[#005a39] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? 'View Results' : 'Next'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
