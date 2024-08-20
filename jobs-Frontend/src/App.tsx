import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import Jobs from './pages/Jobs';
import Application from "./pages/Application";
import NotFound from './pages/NotFound';
import Success from './pages/Success';
import { Jobform } from './pages/Jobform';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Jobs/>} />
        <Route path="/Jobs/:id" element={<Application />} />
        <Route path="/Job-details/:id" element={<Jobform/>} />
        <Route path="/Submission" element={<Success/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Layout>
  );
}
export default App;