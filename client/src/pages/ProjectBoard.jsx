import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState({ 'To Do': [], 'In Progress': [], 'Done': [] });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`/api/projects/${projectId}/tasks`, {
          headers: { Authorization: `Bearer ${user.accessToken}` }
        });
        const grouped = { 'To Do': [], 'In Progress': [], 'Done': [] };
        res.data.data.forEach(task => {
          if (!grouped[task.status]) grouped[task.status] = [];
          grouped[task.status].push(task);
        });
        setTasks(grouped);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    if (user) fetchTasks();
  }, [projectId, user]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const task = tasks[source.droppableId].find(t => t._id === draggableId);
    const updatedTasks = { ...tasks };

    updatedTasks[source.droppableId] = updatedTasks[source.droppableId].filter(t => t._id !== draggableId);
    updatedTasks[destination.droppableId].splice(destination.index, 0, task);
    setTasks(updatedTasks);

    try {
      await axios.put(`/api/tasks/${draggableId}`, { status: destination.droppableId }, {
        headers: { Authorization: `Bearer ${user.accessToken}` }
      });
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  return (
    <div className="p-4">
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem' }}>
        ← Back to Dashboard
      </button>

      <button
        onClick={() => navigate(`/project/${projectId}/automations`)}
        style={{ marginLeft: '1rem', marginBottom: '1rem' }}
      >
        ⚙️ Automations
      </button>

      <div className="flex gap-4 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(tasks).map(status => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="bg-gray-100 p-4 rounded w-64 flex-shrink-0"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h2 className="font-bold mb-2">{status}</h2>
                  {tasks[status].map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided) => (
                        <div
                          className="bg-white p-2 rounded shadow mb-2"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default ProjectBoard;
