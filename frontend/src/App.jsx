import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Parfums from './pages/Parfums.jsx';
import ParfumDetail from './pages/ParfumDetail.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Contact from './pages/Contact.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-beige100">
      <Navbar />
      <ScrollToTop />
      <main className="flex-1 container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parfums" element={<Parfums />} />
          <Route path="/parfums/:id" element={<ParfumDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
