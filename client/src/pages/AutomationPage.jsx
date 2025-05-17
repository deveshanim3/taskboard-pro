import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// import axios from 'axios'; // remove this
import api from '../utils/axiosConfig'; // <-- use api instance

const AutomationPage = () => {
  const { projectId } = useParams();
  const [automations, setAutomations] = useState([]);
  const [form, setForm] = useState({
    triggerType: '',
    condition: '',
    actionType: '',
    data: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/automations`);
      setAutomations(res.data.data || []);
    } catch (err) {
      console.error('Error fetching automations:', err);
    }
  };

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidJSON(form.condition) || !isValidJSON(form.data)) {
      setError('Condition and Data fields must be valid JSON.');
      return;
    }

    try {
      await api.post(`/projects/${projectId}/automations`, {
        trigger: {
          type: form.triggerType,
          condition: JSON.parse(form.condition),
        },
        action: {
          type: form.actionType,
          data: JSON.parse(form.data),
        },
        name: `${form.triggerType}-${form.actionType}` // Fallback name
      });

      setForm({ triggerType: '', condition: '', actionType: '', data: '' });
      fetchAutomations();
    } catch (err) {
      console.error('Error creating automation:', err);
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/automations/${id}`);
      fetchAutomations();
    } catch (err) {
      console.error('Error deleting automation:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Link
        to={`/project/${projectId}`}
        className="mb-4 inline-block text-blue-400 hover:text-blue-200"
      >
        ← Back to Project Board
      </Link>

      <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-4">
        Automation Rules
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <select
          value={form.triggerType}
          onChange={(e) => setForm({ ...form, triggerType: e.target.value })}
          className="w-full p-2 border rounded bg-zinc-900 text-white"
          required
        >
          <option value="">Select Trigger Type</option>
          <option value="task_status_change">Task Status Change</option>
          <option value="task_assigned">Task Assigned</option>
          <option value="due_date_passed">Due Date Passed</option>
        </select>

        <textarea
          placeholder='Trigger Condition (JSON) e.g., {"newStatus":"Done"}'
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
          className="w-full p-2 border rounded bg-zinc-900 text-white"
          required
          rows={3}
        />

        <select
          value={form.actionType}
          onChange={(e) => setForm({ ...form, actionType: e.target.value })}
          className="w-full p-2 border rounded bg-zinc-900 text-white"
          required
        >
          <option value="">Select Action Type</option>
          <option value="assign_badge">Assign Badge</option>
          <option value="change_status">Change Status</option>
          <option value="send_notification">Send Notification</option>
        </select>

        <textarea
          placeholder='Action Data (JSON) e.g., {"badgeType":"Task Completer"}'
          value={form.data}
          onChange={(e) => setForm({ ...form, data: e.target.value })}
          className="w-full p-2 border rounded bg-zinc-900 text-white"
          required
          rows={3}
        />

        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          Create Automation
        </button>
      </form>

      <ul className="space-y-3">
        {automations.map((auto) => (
          <li
            key={auto._id}
            className="p-4 bg-zinc-900 border border-gray-700 rounded shadow"
          >
            <p>
              <strong>Trigger:</strong> {auto.trigger.type}
            </p>
            <p>
              <strong>Action:</strong> {auto.action.type}
            </p>
            <button
              onClick={() => handleDelete(auto._id)}
              className="mt-2 text-red-500 text-sm underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutomationPage;
