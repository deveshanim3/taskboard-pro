import {Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';
import AutomationPage from './pages/AutomationPage';

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:projectId" element={<ProjectBoard />} />
        <Route path="/project/:projectId/automations" element={<AutomationPage />} />
      </Routes>
 
  );
}
export default App;
