
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
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {"/* Add more routes here */"}
  
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUpForm />} />
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