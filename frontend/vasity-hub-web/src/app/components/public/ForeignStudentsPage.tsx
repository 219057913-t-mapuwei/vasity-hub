import { Link } from "react-router";
import { ArrowLeft, Globe2, FileText, ShieldCheck } from "lucide-react";

const docs = [
  "Passport copy",
  "Academic transcript",
  "Final school qualification",
  "SAQA / USAf evaluation where required",
  "Study visa or study permit",
  "Medical cover proof",
  "Sworn translations where documents are not in English",
  "Proof of payment"
];

export function ForeignStudentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[#007A4D] mb-8">
          <ArrowLeft size={18} /> Back to home
        </Link>

        <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#002395]/10 text-[#002395] flex items-center justify-center mb-5">
            <Globe2 size={30} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Foreign Student Support</h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Vasity Hub supports applicants who are not South African citizens by collecting the extra information universities normally require before an application can be processed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <ShieldCheck className="text-[#007A4D] mb-4" />
            <h2 className="text-xl font-bold mb-3">Information captured</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Passport number</li>
              <li>Country of citizenship</li>
              <li>Study visa status</li>
              <li>Medical cover status</li>
              <li>SAQA status</li>
              <li>USAf exemption status</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <FileText className="text-[#007A4D] mb-4" />
            <h2 className="text-xl font-bold mb-3">Document checklist</h2>
            <ul className="space-y-2 text-gray-700">
              {docs.map(doc => <li key={doc}>• {doc}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/register" className="inline-flex px-6 py-3 rounded-xl bg-[#007A4D] text-white font-medium hover:bg-[#005a39]">
            Register as a foreign student
          </Link>
        </div>
      </div>
    </div>
  );
}
