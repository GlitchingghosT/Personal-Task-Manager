import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLessThan } from 'react-icons/fa6';
import { createTask } from '../services/api';
import type { CreateTaskInput } from '../types/task';

const NewTask: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    dueDate: '',
    category: 'Urgent',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null); 
    
    if (!validate()) return;

    try {
      await createTask(formData);
      navigate('/tasks');
    } catch (error: unknown) {
      console.error("Error creating task:", error);
      const response =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: unknown } } }).response
          : undefined;
      const message =
        typeof response?.data?.message === 'string'
          ? response.data.message
          : "Failed to create task. Please check if the server is running.";
      setSubmitError(message);
    }
  };

  return (
    <main className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left min-h-screen">
      <Link to="/tasks" className="inline-flex items-center gap-2 text-3xl font-semibold text-gray-800 hover:text-[#974FD0] transition mb-8">
        <FaLessThan /> New Task
      </Link>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-sm">
          <strong>Error:</strong> {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-8">
        
        <div className="relative mt-2">
          <label className="absolute -top-2 left-4 bg-white px-2 text-xs font-medium text-gray-500 z-10">
            Task Title
          </label>
          <input 
            type="text" 
            placeholder="E.g. Project Database Assignment"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className={`w-full border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#974FD0] focus:border-transparent transition ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div className="relative mt-2">
          <label className="absolute -top-2 left-4 bg-white px-2 text-xs font-medium text-gray-500 z-10">
            Description
          </label>
          <textarea 
            rows={5}
            placeholder="Briefly describe your task..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className={`w-full border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#974FD0] focus:border-transparent transition resize-none ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="relative mt-2">
          <label className="absolute -top-2 left-4 bg-white px-2 text-xs font-medium text-gray-500 z-10">
            Due Date
          </label>
          <input 
            type="date" 
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            className={`w-full border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#974FD0] focus:border-transparent transition ${errors.dueDate ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
        </div>

        <div className="relative mt-2">
          <label className="absolute -top-2 left-4 bg-white px-2 text-xs font-medium text-gray-500 z-10">
            Tags
          </label>
          
          <div 
            className="w-full border border-gray-200 rounded-md px-4 py-2.5 flex justify-between items-center cursor-pointer bg-white hover:border-gray-300 transition"
            onClick={() => setIsTagsOpen(!isTagsOpen)}
          >
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded text-xs font-medium transition ${
                formData.category === 'Urgent' ? 'bg-[#FF4D4D] text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                Urgent
              </span>
              <span className={`px-3 py-1 rounded text-xs font-medium transition ${
                formData.category === 'Important' ? 'bg-[#52B788] text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                Important
              </span>
            </div>
            <svg className={`w-4 h-4 text-gray-500 transition-transform ${isTagsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>

          {isTagsOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden">
              <div 
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2"
                onClick={() => { setFormData({...formData, category: 'Urgent'}); setIsTagsOpen(false); }}
              >
                <span className="w-3 h-3 rounded-full bg-[#FF4D4D]"></span> Urgent
              </div>
              <div 
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2"
                onClick={() => { setFormData({...formData, category: 'Important'}); setIsTagsOpen(false); }}
              >
                <span className="w-3 h-3 rounded-full bg-[#52B788]"></span> Important
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="bg-[#974FD0] text-white font-medium py-4 rounded-md hover:bg-[#833bbd] transition mt-4 shadow-sm text-sm"
        >
          Done
        </button>
      </form>

      <div className="text-center mt-12">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm text-[#974FD0] font-medium hover:underline"
        >
          Back To Top
        </button>
      </div>
    </main>
  );
};

export default NewTask;