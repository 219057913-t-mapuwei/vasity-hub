import { Link } from "react-router";
import { GraduationCap, Search, Calculator, FileCheck2, Globe2, Users } from "lucide-react";

const steps = [
  { title: "Create profile", text: "Register as a South African or foreign student and complete your details." },
  { title: "Capture results", text: "Add Grade 11 or Grade 12 subjects so Vasity Hub can calculate your APS." },
  { title: "Find courses", text: "Search universities, compare requirements and choose programmes that fit your score." },
  { title: "Apply and track", text: "Upload documents, pay fees and track your applications from one dashboard." },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white/90 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#007A4D] text-white flex items-center justify-center">
              <GraduationCap size={26} />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Vasity Hub</h1>
              <p className="text-xs text-gray-500">Centralised Student Application Platform</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <Link to="/foreign-students">Foreign students</Link>
          </nav>
          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Login</Link>
            <Link to="/register" className="px-4 py-2 rounded-lg bg-[#007A4D] text-white hover:bg-[#005a39]">Register</Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB612]/20 text-[#7A4B00] mb-6 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#FFB612]" /> South African-inspired national platform
          </div>
          <h2 className="text-5xl font-bold tracking-tight text-gray-950 mb-6">
            Apply to multiple universities from one modern student portal.
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Vasity Hub helps students calculate APS, discover courses, upload documents, make payments and track applications in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="px-6 py-3 rounded-xl bg-[#007A4D] text-white font-medium hover:bg-[#005a39]">Get Started</Link>
            <Link to="/login" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-800 font-medium hover:bg-gray-50">I already have an account</Link>
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#007A4D] via-[#002395] to-[#111827] p-1 shadow-xl">
          <div className="rounded-3xl bg-white p-6">
            <div className="aspect-[4/3] rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-center p-8">
              <div>
                <GraduationCap size={64} className="mx-auto text-[#007A4D] mb-4" />
                <p className="font-semibold text-gray-800">Student dashboard / campus image placeholder</p>
                <p className="text-sm text-gray-500 mt-2">Replace with exported image from your refined Figma design.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-10">How it works</h3>
          <div className="grid md:grid-cols-4 gap-5">
            {steps.map((step, index) => (
              <div key={step.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-10 h-10 rounded-full bg-[#007A4D] text-white flex items-center justify-center font-bold mb-4">{index + 1}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Calculator, title: "APS calculator", text: "Calculate standard and university-specific APS scores." },
            { icon: Search, title: "University search", text: "Find courses and compare minimum entry requirements." },
            { icon: FileCheck2, title: "Document tracking", text: "Upload ID, results, passport and foreign-student documents." },
            { icon: Globe2, title: "Foreign student support", text: "Capture passport, visa, SAQA and USAf exemption details." },
            { icon: Users, title: "Super Admin control", text: "Staff access is created by the Super Admin only." },
            { icon: GraduationCap, title: "Modern portal", text: "Separate portals for students, universities, support and admins." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-gray-200 p-6 bg-white hover:shadow-sm transition-shadow">
              <Icon className="text-[#007A4D] mb-4" size={28} />
              <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
