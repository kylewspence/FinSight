import './App.css';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginForm from './pages/LoginPage';
import SignUpForm from './pages/SignUp';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      {/* Landing page outside of Layout */}
      <Route path="/" element={<LandingPage />} />

      {/* All other pages use the Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        {/* Add more routes here */}
      </Route>
    </Routes>
  );
}

// const [serverData, setServerData] = useState('');

// useEffect(() => {
//   async function readServerData() {
//     const resp = await fetch('/api/hello');
//     const data = await resp.json();

//     console.log('Data from server:', data);

//     setServerData(data.message);
//   }

//   readServerData();
// }, []);
