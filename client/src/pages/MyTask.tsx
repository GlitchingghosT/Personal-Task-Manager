import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { getTasks, deleteTask } from '../services/api';
import type { Task } from '../types/task';
import TaskCard from '../components/TaskCard';

const MyTask: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      try {
        const data = await getTasks();
        if (!cancelled) {
          setTasks(data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(task => task._id !== id));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const sortedTasks = tasks
    .filter(task => {
      const matchCategory = filterCategory === 'All' || task.category === filterCategory;
      const matchStatus = filterStatus === 'All' || 
                          (filterStatus === 'Completed' && task.completed) || 
                          (filterStatus === 'Pending' && !task.completed);
      return matchCategory && matchStatus;
    })
    .sort((a, b) => {
      const now = new Date();
      const aOverdue = new Date(a.dueDate) < now && !a.completed;
      const bOverdue = new Date(b.dueDate) < now && !b.completed;

      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      if (aOverdue !== bOverdue) {
        return aOverdue ? -1 : 1;
      }

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const overdueTasks = sortedTasks.filter(task => new Date(task.dueDate) < new Date() && !task.completed);
  const upcomingTasks = sortedTasks.filter(task => new Date(task.dueDate) >= new Date() && !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);

  return (
    <main className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">My Tasks</h2>
        <Link 
          to="/tasks/new" 
          className="flex items-center gap-2 text-[#974FD0] font-medium hover:underline transition text-sm"
        >
          <FaPlus /> Add New Task
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2 shadow-sm hover:border-gray-300 transition">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category:</label>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Urgent">Urgent</option>
            <option value="Important">Important</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2 shadow-sm hover:border-gray-300 transition">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading tasks...</p>
      ) : sortedTasks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No tasks found matching your filters.</p>
          <Link to="/tasks/new" className="text-[#974FD0] font-medium hover:underline transition">
            Create your first task
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          
          {overdueTasks.map(task => (
            <TaskCard key={task._id} task={task} onDelete={handleDelete} />
          ))}

          {upcomingTasks.map(task => (
            <TaskCard key={task._id} task={task} onDelete={handleDelete} />
          ))}

          {completedTasks.length > 0 && (
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Completed Tasks
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          )}

          {completedTasks.map(task => (
            <TaskCard key={task._id} task={task} onDelete={handleDelete} />
          ))}
          
        </div>
      )}
      
      <div className="text-center mt-12">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm text-[#974FD0] font-medium hover:underline transition"
        >
          Back To Top
        </button>
      </div>
    </main>
  );
};

export default MyTask;