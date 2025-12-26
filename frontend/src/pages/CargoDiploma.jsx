import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Calendar, 
  GraduationCap, 
  FileText,
  BookOpenCheck,
  Container
} from 'lucide-react';

function CargoDiploma() {
  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-900 pt-32 pb-16 px-6">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/training" className="hover:text-blue-400 transition-colors">Training Programs</Link>
            <span>&gt;</span>
            <span className="text-white">Diploma in Air Cargo & Logistics</span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Diploma in <span className="text-blue-500">Air Cargo & Logistics</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Master the global supply chain. Learn the intricacies of air freight, dangerous goods regulations, and logistics management essential for international trade.
            </p>
          </div>
        </div>
      </section>

      {/* --- CURRICULUM SECTION --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Theory Modules */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <Package size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Theory Syllabus</h2>
              </div>
              <ul className="space-y-3">
                <CurriculumItem text="Introduction to the Air Cargo Industry" />
                <CurriculumItem text="Aircraft Structures and Parts" />
                <CurriculumItem text="General Cargo Acceptance Principles" />
                <CurriculumItem text="Air Cargo Rates / Charges Calculations" />
                <CurriculumItem text="Floor Loading Limitations" />
                <CurriculumItem text="Freight Forwarding Procedures" />
                <CurriculumItem text="E-freight Systems" />
                <CurriculumItem text="Introduction to Logistics" />
                <CurriculumItem text="DGR (Dangerous Goods) Awareness" />
              </ul>
            </div>

            {/* Complementary Training */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <Briefcase size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Complementary Training</h2>
              </div>
              <ul className="space-y-4">
                <CurriculumItem text="Industry Relevant Field Visits" />
                <CurriculumItem text="Grooming and Deportment Training" />
                <CurriculumItem text="Interview Ready Program" />
                <CurriculumItem text="Career Guidance and Support" />
              </ul>

              {/* Decorative Icon */}
              <div className="mt-12 flex justify-center opacity-10">
                <Container size={120} className="text-slate-900" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- KEY INFORMATION GRID --- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Course Details</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Fee */}
            <InfoCard 
              icon={CreditCard} 
              label="Total Course Fee" 
              value="Contact Admission" 
              subtext="Call for latest fee structure"
            />

            {/* Duration */}
            <InfoCard 
              icon={Clock} 
              label="Course Duration" 
              value="06 to 08 Months" 
              subtext="Part-Time Basis"
            />

            {/* Schedule */}
            <InfoCard 
              icon={Calendar} 
              label="Class Schedules" 
              value="Weekends" 
              subtext="Designed for working professionals"
            />

            {/* Requirements */}
            <InfoCard 
              icon={GraduationCap} 
              label="Entry Requirements" 
              value="6 Passes at G.C.E O/L" 
              subtext="Inclusive of Maths & English"
            />

            {/* Evaluation */}
            <InfoCard 
              icon={FileText} 
              label="Evaluation Criteria" 
              value="Exams & Assignments" 
              subtext="Final Written Examination"
            />

            {/* Exam Format */}
            <InfoCard 
              icon={BookOpenCheck} 
              label="Examination Format" 
              value="Open Book" 
              subtext="Reference materials allowed"
            />

            {/* Extra Card: Logistics Focus */}
            <div className="bg-orange-600 p-6 rounded-2xl border border-orange-500 hover:bg-orange-700 transition-colors md:col-span-2 lg:col-span-3 flex items-center gap-6">
              <div className="p-3 bg-white/20 rounded-xl text-white">
                <Truck size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Logistics Focus</h3>
                <p className="text-orange-100 text-sm">
                  Special emphasis on Freight Forwarding procedures and DGR awareness, preparing you for high-responsibility roles in cargo handling.
                </p>
              </div>
            </div>

          </div>

          {/* Attendance Note */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-slate-800 px-6 py-3 rounded-full border border-slate-700 text-slate-300 text-sm">
              <span className="text-blue-400 font-bold">Note:</span> 80% Classroom Attendance is required to sit for the final examination.
            </div>
          </div>

        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Manage the World's Cargo</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Join the booming logistics sector with a specialized qualification from IAAC.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/apply-now" 
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
            >
              Apply Now
            </Link>
            <Link 
              to="/contact-us" 
              className="px-8 py-3 bg-white text-slate-700 border border-slate-300 font-bold rounded-full hover:bg-slate-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// --- Helper Components ---

function CurriculumItem({ text }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 size={20} className="text-blue-600 shrink-0 mt-0.5" />
      <span className="text-slate-700 font-medium leading-relaxed">{text}</span>
    </li>
  );
}

function InfoCard({ icon: Icon, label, value, subtext }) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center gap-4 mb-3">
        <div className="p-2 bg-slate-700 rounded-lg text-blue-400">
          <Icon size={24} />
        </div>
        <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">{label}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-slate-500">{subtext}</p>
    </div>
  );
}

export default CargoDiploma;