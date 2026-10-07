import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { getTasks, deleteTask } from '../services/api';
import type { Task } from '../types/task';
import TaskCard from '../components/TaskCard';

const getDueDateTime = (dueDate: string): number => {
  const timestamp = new Date(dueDate).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.POSITIVE_INFINITY;
};

const MyTask: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingAll, setDeletingAll] = useState(false);
  const [deleteAllError, setDeleteAllError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleDeleteAll = async () => {
    if (tasks.length === 0 || deletingAll) return;

    const confirmed = window.confirm(`Delete all ${tasks.length} tasks? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingAll(true);
    setDeleteAllError(null);

    const results = await Promise.allSettled(tasks.map(task => deleteTask(task._id)));
    const deletedIds = new Set(
      results.flatMap((result, index) => result.status === 'fulfilled' ? [tasks[index]._id] : [])
    );
    const failedCount = results.length - deletedIds.size;

    setTasks(currentTasks => currentTasks.filter(task => !deletedIds.has(task._id)));
    if (failedCount > 0) {
      setDeleteAllError(`${failedCount} task${failedCount === 1 ? '' : 's'} could not be deleted. Please try again.`);
    }
    setDeletingAll(false);
  };

  const sortedTasks = tasks
    .filter(task => {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch = normalizedQuery === '' || [
        task.title,
        task.description,
        task.category,
      ].some(value => value.toLowerCase().includes(normalizedQuery));
      const matchCategory = filterCategory === 'All' || task.category === filterCategory;
      const matchStatus = filterStatus === 'All' || 
                          (filterStatus === 'Completed' && task.completed) || 
                          (filterStatus === 'Pending' && !task.completed);
      return matchesSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      const now = Date.now();
      const aDueDate = getDueDateTime(a.dueDate);
      const bDueDate = getDueDateTime(b.dueDate);
      const aOverdue = aDueDate < now && !a.completed;
      const bOverdue = bDueDate < now && !b.completed;

      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      if (aOverdue !== bOverdue) {
        return aOverdue ? -1 : 1;
      }

      return aDueDate - bDueDate;
    });

  const overdueTasks = sortedTasks.filter(task => getDueDateTime(task.dueDate) < Date.now() && !task.completed);
  const upcomingTasks = sortedTasks.filter(task => getDueDateTime(task.dueDate) >= Date.now() && !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);

  return (
    <main className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">My Tasks</h2>
        <div className="flex flex-wrap items-center gap-4">
          {tasks.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaTrashAlt /> {deletingAll ? 'Deleting tasks...' : 'Delete All Tasks'}
            </button>
          )}
          <Link 
            to="/tasks/new" 
            className="flex items-center gap-2 text-[#974FD0] font-medium hover:underline transition text-sm"
          >
            <FaPlus /> Add New Task
          </Link>
        </div>
      </div>

      {deleteAllError && (
        <p role="alert" className="mb-6 text-sm text-red-600">{deleteAllError}</p>
      )}

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2 shadow-sm hover:border-gray-300 transition">
          <label htmlFor="task-search" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Search:</label>
          <input
            id="task-search"
            type="search"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="Title, description, or category"
            className="min-w-0 text-sm text-gray-700 bg-transparent focus:outline-none"
          />
        </div>
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
          {tasks.length === 0 ? (
            <>
              <p className="text-gray-500 mb-4">You don't have any tasks yet.</p>
              <Link to="/tasks/new" className="text-[#974FD0] font-medium hover:underline transition">
                Create your first task
              </Link>
            </>
          ) : (
            <p className="text-gray-500">No tasks match your search and filters.</p>
          )}
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