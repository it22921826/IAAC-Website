import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext.jsx';
import { useAuth } from './hooks/useAuth.js';

// --- COMPONENTS ---
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollManager from './components/ScrollManager.jsx'; // Ensures page scrolls to top on navigation

// --- PAGES ---
import Home from './pages/Home.jsx';
import About from './pages/About.jsx'; // This is now a separate page
import AcademicStaff from './pages/AcademicStaff.jsx'; // The dynamic staff page
import StudentLife from './pages/Studentlife.jsx';
import Programs from './pages/Programs.jsx';
import PracticalTrainings from './pages/PracticalTrainings.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import CareerSupport from './pages/CareerSupport.jsx';
import ContactUs from './pages/ContactUs.jsx';
import ApplyNow from './pages/ApplyNow.jsx';
import UpcomingEvents from './pages/Events.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import StudentLogin from './pages/StudentLogin.jsx';

function App() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Dynamic Theme Classes
  const appClasses = theme === 'dark'
    ? 'min-h-screen flex flex-col bg-slate-950 text-slate-100'
    : 'min-h-screen flex flex-col bg-slate-50 text-slate-900';

  return (
    <div className={appClasses}>
      <Navbar />
      
      {/* Handles scrolling to top when route changes */}
      <ScrollManager />
      
      <main className="flex-1">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/academic-staff" element={<AcademicStaff />} />
          <Route path="/student-life" element={<StudentLife />} />
          <Route path="/student-login" element={<StudentLogin />} />
          
          {/* Programs */}
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/courses" element={<Programs />} />
          <Route path="/programs/practical-trainings" element={<PracticalTrainings />} />
          <Route path="/programs/course/:courseId" element={<CourseDetails />} />

          {/* Backward-compatible Training URLs */}
          <Route path="/training" element={<Navigate to="/programs" replace />} />
          <Route path="/training/courses" element={<Navigate to="/programs/courses" replace />} />
          <Route path="/training/practical-trainings" element={<Navigate to="/programs/practical-trainings" replace />} />
          <Route path="/training/course/:courseId" element={<CourseDetails />} />
          
          {/* Support & Contact */}
          <Route path="/career-support" element={<CareerSupport />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/apply-now" element={<ApplyNow />} />
          <Route path="/events/upcoming" element={<UpcomingEvents />} />
          
          {/* --- ADMIN ROUTES --- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            // Protects the dashboard so only admins can enter
            element={isAdmin ? <Dashboard /> : <Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;