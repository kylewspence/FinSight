import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AiInsights from './pages/AiInsights';
import HelpSupport from './pages/HelpSupport';
import { ToastProvider } from '@/components/ui/toast';

function App() {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<Layout><Outlet /></Layout>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-insights" element={<AiInsights />} />
            <Route path="/help-support" element={<HelpSupport />} />
          </Route>
        </Routes>
      </ToastProvider>
    </Router>
  );
}

export default App;
