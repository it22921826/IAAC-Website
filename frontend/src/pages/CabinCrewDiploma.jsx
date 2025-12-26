import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  LifeBuoy, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Calendar, 
  GraduationCap, 
  FileCheck,
  Ruler,
  ArrowLeft
} from 'lucide-react';

function CabinCrewDiploma() {
  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-900 pt-32 pb-16 px-6">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/training" className="hover:text-blue-400 transition-colors">Training Programs</Link>
            <span>&gt;</span>
            <span className="text-white">Diploma in Airline Cabin Crew</span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Diploma in <span className="text-blue-500">Airline Cabin Crew</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Launch your career in the skies with our International Airline Diploma. Master the art of passenger safety, service excellence, and professional grooming required by top global airlines.
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
                  <BookOpen size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Theory Modules</h2>
              </div>
              <ul className="space-y-4">
                <CurriculumItem text="Cabin crew members’ roles and responsibilities" />
                <CurriculumItem text="Crew member coordination and communication" />
                <CurriculumItem text="Handling of Passengers with special needs" />
                <CurriculumItem text="Food and beverages served on board" />
                <CurriculumItem text="Safety and emergency procedures" />
                <CurriculumItem text="First aid and handling medical emergencies" />
                <CurriculumItem text="Dangerous Goods Control" />
              </ul>
            </div>

            {/* Practical Modules */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                  <LifeBuoy size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Practical Training</h2>
              </div>
              <ul className="space-y-4">
                <CurriculumItem text="Industry Relevant Field Visits" />
                <CurriculumItem text="Personal water survival / Fire drill training" />
                <CurriculumItem text="Grooming and Deportment training" />
                <CurriculumItem text="Interview Ready Program" />
                <CurriculumItem text="BMI maintenance / General fitness training" />
                <CurriculumItem text="Career guidance and support" />
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* --- KEY INFORMATION GRID (Index Details) --- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Course Details</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Fee */}
            <InfoCard 
              icon={CreditCard} 
              label="Total Course Fee" 
              value="LKR 100,000" 
              subtext="Installment plans available"
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
              value="Weekdays & Weekends" 
              subtext="Flexible timing options"
            />

            {/* Requirements */}
            <InfoCard 
              icon={GraduationCap} 
              label="Entry Requirements" 
              value="6 Passes at G.C.E O/L" 
              subtext="Inclusive of Maths & English (C Pass)"
            />

            {/* Height Req */}
            <InfoCard 
              icon={Ruler} 
              label="Physical Requirement" 
              value="Arm Reach: 212cm" 
              subtext="Minimum height requirement standard"
            />

            {/* Evaluation */}
            <InfoCard 
              icon={FileCheck} 
              label="Evaluation Criteria" 
              value="Written Examinations" 
              subtext="Modularised / Closed Book Format"
            />

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
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Take Off?</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Join the next intake for the Diploma in Airline Cabin Crew and start your journey towards an exciting career in aviation.
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

export default CabinCrewDiploma;