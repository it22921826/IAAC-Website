import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import logo from '/logo.png';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Toggle dropdown on mobile
  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    // Single Row Navbar with transparency
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm h-20 flex items-center transition-all duration-300">
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* --- LEFT: LOGO --- */}
          <Link to="/" className="flex-shrink-0 flex items-center" aria-label="IAAC home">
            <img 
              src="/logo.png" 
              alt="IAAC" 
              className="h-14 w-auto object-contain" 
            />
          </Link>

          {/* --- CENTER: MENU LINKS --- */}
          <div className="hidden xl:flex items-center space-x-6">
            <NavLink to="/" text="Home" />
            <NavLink to={{ pathname: '/', hash: '#about' }} text="About Us" />
            <NavLink to="/student-life" text="Student Life" />
            {/* Admin links hidden from public navbar */}

            {/* Training Dropdown */}
            <div className="relative group h-20 flex items-center">
              <Link
                to="/training"
                className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Training Programs
                <ChevronDown size={16} />
              </Link>
              <div className="absolute top-full left-0 w-64 bg-[#2a2a2a] text-white rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <DropdownItem to={{ pathname: '/training', hash: '#courses' }} text="Training Courses" />
                  <DropdownItem to={{ pathname: '/training', hash: '#practical' }} text="Practical Training's" />
                </div>
              </div>
            </div>

            <NavLink to="/career-support" text="Career Support" />

            {/* Events Dropdown */}
            <div className="relative group h-20 flex items-center">
              <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
                Events
                <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-0 w-48 bg-[#2a2a2a] text-white rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <DropdownItem to="/events/upcoming" text="Upcoming Events" />
                  <DropdownItem to="/events/gallery" text="Gallery" />
                </div>
              </div>
            </div>

            <NavLink to="/contact-us" text="Contact Us" />
          </div>

          {/* --- RIGHT: SEARCH & APPLY --- */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 rounded-full bg-slate-100 border-transparent focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none text-sm w-40 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>

            {/* Apply Button */}
            <Link
              to="/apply-now"
              className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-full transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:brightness-110 shadow-lg shadow-blue-600/20 whitespace-nowrap"
            >
              Apply Now
            </Link>
            {/* Admin login button removed from public navbar */}
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-20 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-100 overflow-y-auto pb-20 z-40">
          <div className="px-6 py-6 space-y-4">
            
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none text-base"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>

            <MobileLink to="/" text="Home" onNavigate={() => setIsMobileMenuOpen(false)} />
            <MobileLink to={{ pathname: '/', hash: '#about' }} text="About Us" onNavigate={() => setIsMobileMenuOpen(false)} />
            <MobileLink to="/student-life" text="Student Life" onNavigate={() => setIsMobileMenuOpen(false)} />
            {/* Admin mobile link removed */}
            {/* Admin dashboard link hidden from mobile menu */}

            <div>
              <button 
                onClick={() => toggleDropdown('training')}
                className="flex items-center justify-between w-full text-left py-3 text-lg font-medium text-slate-700 border-b border-slate-100"
              >
                Training Programs
                <ChevronDown size={20} className={`transform transition-transform ${activeDropdown === 'training' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'training' && (
                <div className="pl-4 py-2 space-y-2 bg-slate-50/50">
                  <MobileSubLink to={{ pathname: '/training', hash: '#courses' }} text="Training Courses" />
                  <MobileSubLink to={{ pathname: '/training', hash: '#practical' }} text="Practical Training's" />
                </div>
              )}
            </div>

            <MobileLink to="/career-support" text="Career Support" onNavigate={() => setIsMobileMenuOpen(false)} />

            <div>
              <button 
                onClick={() => toggleDropdown('events')}
                className="flex items-center justify-between w-full text-left py-3 text-lg font-medium text-slate-700 border-b border-slate-100"
              >
                Events
                <ChevronDown size={20} className={`transform transition-transform ${activeDropdown === 'events' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'events' && (
                <div className="pl-4 py-2 space-y-2 bg-slate-50/50">
                  <MobileSubLink to="/events/upcoming" text="Upcoming Events" />
                  <MobileSubLink to="/events/gallery" text="Gallery" />
                </div>
              )}
            </div>

            <MobileLink to="/contact-us" text="Contact Us" onNavigate={() => setIsMobileMenuOpen(false)} />
            
            <div className="pt-4">
              <Link to="/apply-now" className="block w-full text-center py-3 bg-blue-600 text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:brightness-110">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// --- HELPER COMPONENTS ---

function NavLink({ to, text }) {
  return (
    <Link to={to} className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap">
      {text}
    </Link>
  );
}

function DropdownItem({ to, text }) {
  return (
    <Link
      to={to}
      className="block px-6 py-3 text-sm text-slate-300 hover:bg-[#333] hover:text-white transition-colors border-l-2 border-transparent hover:border-blue-500"
    >
      {text}
    </Link>
  );
}

function MobileLink({ to, text, onNavigate }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="block py-3 text-lg font-medium text-slate-700 border-b border-slate-100"
    >
      {text}
    </Link>
  );
}

function MobileSubLink({ to, text }) {
  return (
    <Link to={to} className="block py-2 text-base text-slate-600 hover:text-blue-600">
      {text}
    </Link>
  );
}

export default Navbar;