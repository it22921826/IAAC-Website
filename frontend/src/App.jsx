import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext.jsx';
import { useAuth } from './hooks/useAuth.js';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollManager from './components/ScrollManager.jsx';

// Import Pages
import Home from './pages/Home.jsx';
import StudentLife from './pages/Studentlife.jsx';
import TrainingCourses from './pages/TrainingCourses.jsx';
import CareerSupport from './pages/CareerSupport.jsx';
import ContactUs from './pages/ContactUs.jsx';
import ApplyNow from './pages/ApplyNow.jsx';
import UpcomingEvents from './pages/Events.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import CourseDetails from './pages/CourseDetails.jsx';

function App() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const appClasses = theme === 'dark'
    ? 'min-h-screen flex flex-col bg-slate-950 text-slate-100'
    : 'min-h-screen flex flex-col bg-slate-50 text-slate-900';

  return (
    <div className={appClasses}>
      <Navbar />
      <ScrollManager />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/student-life" element={<StudentLife />} />
          
          {/* Main Training Page */}
          <Route path="/training" element={<TrainingCourses />} />
          <Route path="/training/courses" element={<TrainingCourses />} />
          <Route path="/training/course/:courseId" element={<CourseDetails />} />
          
          <Route path="/career-support" element={<CareerSupport />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/apply-now" element={<ApplyNow />} />
          <Route path="/events/upcoming" element={<UpcomingEvents />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={isAdmin ? <Dashboard /> : <Navigate to="/" replace />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;