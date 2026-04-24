import React from 'react';
import { MapPin, Award, Calendar, User, ChevronDown, Trophy, BookOpen } from 'lucide-react';

const inductees = [
  {
    id: 1,
    name: "Peter Hill",
    year: "2024",
    role: "Aviation Industry Veteran",
    experience: "52 Years",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800", // Replace with actual image
    bio: "A career that began in 1972 grew into a legacy 52 years in the making. Peter Murray Hill is a seasoned veteran whose illustrious career and reputation precede him. In 1998, a new chapter unfolded as he took on the CEO role at Sri Lankan Airlines. Over the next 10 years, he led the airline through rebranding, restructuring, and profitability. His journey through British Airways, Gulf Air, Emirates, Sri Lankan Airlines, and Oman Air is a testament to his enduring impact on the aviation industry."
  },
  {
    id: 2,
    name: "Keerthi Peiris",
    year: "2023/24",
    role: "Head of Training",
    experience: "50+ Years",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800", // Replace with actual image
    bio: "A pillar of excellence in airport operations and customer service. With an illustrious career spanning over 50 years, Mr. Peiris has become a legend in aviation. His landmark contributions span globally renowned organizations including KLM, British Airways, Etihad, and Oman Air. Today, as Head of Training at IAAC, Mr. Peiris continues to inspire and mentor the next generation of aviation professionals."
  }
];

const HallOfFameProfile = ({ inductee }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* HEADER */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="font-bold text-xl tracking-tighter text-blue-900">IAAC AWARDS</div>
        <div className="flex gap-6 text-sm text-gray-600 font-medium">
          {['Home', 'Hall of Fame', 'Graduation', 'Contact'].map((item) => (
            <a href="#" key={item} className="hover:text-blue-900">{item}</a>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:py-12">
        {/* TITLE SECTION */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            {inductee.name} <span className="text-amber-500">| Hall of Fame</span>
          </h1>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"><Trophy size={16} className="text-amber-600" /> Sri Lanka Aviation Hall of Fame</span>
            <span className="flex items-center gap-1"><Calendar size={16} /> Inducted in {inductee.year}</span>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl h-[400px] md:h-[500px]">
          <img src={inductee.imageUrl} alt={inductee.name} className="w-full h-full object-cover" />
        </div>

        {/* CONTENT SPLIT */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* PROFILE CARD (Sidebar) */}
          <div className="md:col-span-1 border border-gray-100 rounded-3xl p-8 shadow-lg bg-gray-50/50">
            <h2 className="text-xl font-bold mb-6 text-blue-900">Inductee Summary</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-blue-100 rounded-lg"><User className="text-blue-800"/></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Current Role</p>
                  <p className="text-sm font-semibold">{inductee.role}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-amber-100 rounded-lg"><Award className="text-amber-800"/></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Experience</p>
                  <p className="text-sm font-semibold">{inductee.experience}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p className="text-gray-400 text-xs mb-1">Status</p>
              <p className="text-lg font-bold text-green-700">Official Inductee</p>
              <button className="w-full mt-6 bg-blue-900 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-800 transition">
                View Certificate
              </button>
            </div>
          </div>

          {/* BIO DESCRIPTION */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-900 mb-6 flex items-center gap-2">
              <BookOpen size={18} /> Career Biography
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {inductee.bio}
            </p>
            
            <div className="mt-10 p-6 bg-blue-50 rounded-2xl border-l-4 border-blue-900">
              <h4 className="font-bold text-blue-900 mb-2">Dedication & Impact</h4>
              <p className="text-blue-800/80 italic">
                "Your dedication and commitment to the betterment of the aviation industry is truly respected and appreciated by the IAAC Awards Council."
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return <HallOfFameProfile inductee={inductees[0]} />;
}