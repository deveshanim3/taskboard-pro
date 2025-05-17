import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusesInput, setStatusesInput] = useState('To Do, In Progress, Done');
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) return;

        const res = await api.get('/projects');
        setProjects(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setProjects([]);
      }
    };

    fetchProjects();
  }, [user]);

  const createProject = async () => {
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }

    setError(null);

    const statuses = statusesInput.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      const res = await api.post('/projects', { title, description, statuses });
      setProjects((prev) => [...prev, res.data.data]);
      setTitle('');
      setDescription('');
      setStatusesInput('To Do, In Progress, Done');
    } catch (err) {
      console.error('Error creating project:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome, {user?.displayName || 'Guest'}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Create New Project</h3>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block mb-2 p-2 w-full rounded bg-gray-800 border border-gray-700 text-white"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="block mb-2 p-2 w-full rounded bg-gray-800 border border-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Statuses (comma separated)"
          value={statusesInput}
          onChange={(e) => setStatusesInput(e.target.value)}
          className="block mb-2 p-2 w-full rounded bg-gray-800 border border-gray-700 text-white"
        />
        <button
          onClick={createProject}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Create Project
        </button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Projects</h3>
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-800 p-4 rounded mb-4 border border-gray-700"
            >
              <h4
                className="text-lg font-semibold text-blue-400 cursor-pointer"
                onClick={() => navigate(`/project/${project._id}`)}
              >
                {project.title}
              </h4>
              <p className="text-gray-300">{project.description}</p>
              <button
                onClick={() => navigate(`/project/${project._id}/automations`)}
                className="mt-2 text-sm text-yellow-400 underline"
              >
                Manage Automations
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
