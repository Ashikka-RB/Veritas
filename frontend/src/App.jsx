import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { useEffect } from 'react';
import Lenis from 'lenis';

// Auth Pages
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Otp from './pages/Otp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// User Pages
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import SecurityLogs from './pages/SecurityLogs';

// Verification Pages
import StartVerification from './pages/StartVerification';
import AadhaarUpload from './pages/AadhaarUpload';
import OcrReview from './pages/OcrReview';
import PanUpload from './pages/PanUpload';
import FaceVerification from './pages/FaceVerification';
import Processing from './pages/Processing';
import Status from './pages/Status';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import VerifyUser from './pages/VerifyUser';
import FraudMonitor from './pages/FraudMonitor';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard cinematic easing
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/security" element={<SecurityLogs />} />

        <Route path="/verify/start" element={<StartVerification />} />
        <Route path="/verify/aadhaar" element={<AadhaarUpload />} />
        <Route path="/verify/ocr" element={<OcrReview />} />
        <Route path="/verify/pan" element={<PanUpload />} />
        <Route path="/verify/face" element={<FaceVerification />} />
        <Route path="/verify/processing" element={<Processing />} />
        <Route path="/verify/status" element={<Status />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/verify-user/:id"
          element={
            <ProtectedAdminRoute>
              <VerifyUser />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/fraud"
          element={
            <ProtectedAdminRoute>
              <FraudMonitor />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
