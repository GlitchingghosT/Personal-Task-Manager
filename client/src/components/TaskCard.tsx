import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  // A task is overdue if the due date is in the past AND it's not completed
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`p-6 rounded-lg border flex flex-col gap-3 shadow-sm transition-all duration-300 text-left ${
      task.completed 
        ? 'bg-gray-50 border-gray-200 opacity-80' 
        : isOverdue
          ? 'bg-white border-red-200 border-l-4 border-l-red-500 hover:shadow-lg transform hover:-translate-y-1' // Overdue style
          : 'bg-white border-gray-100 hover:shadow-lg transform hover:-translate-y-1'
    }`}>
      
      {/* Top Row: Badges & Actions with Bolder Border */}
      <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold tracking-wide ${
            task.category === 'Urgent' ? 'text-[#FF4D4D]' : 'text-[#52B788]'
          }`}>
            {task.category}
          </span>
          
          {/* Visual Indicator for Overdue Tasks */}
          {isOverdue && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              Overdue
            </span>
          )}

          {/* Visual Indicator for Completed Tasks */}
          {task.completed && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
              Completed
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Link 
            to={`/tasks/edit/${task._id}`} 
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#974FD0] hover:bg-[#833bbd] rounded-md transition shadow-sm"
          >
            <FaRegEdit /> Edit
          </Link>
          <button 
            onClick={() => onDelete(task._id)} 
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-[#974FD0] bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-md transition shadow-sm"
          >
            <FaTrashAlt /> Delete
          </button>
        </div>
      </div>

      {/* Middle: Title & Description */}
      <div>
        <h3 className={`text-lg font-bold tracking-tight ${
          task.completed ? 'line-through text-gray-400' : 'text-gray-800'
        }`}>
          {task.title}
        </h3>
        <p className={`text-sm mt-2 leading-relaxed ${
          task.completed ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {task.description}
        </p>
      </div>

      {/* Bottom: Due Date */}
      <div className="text-xs font-medium mt-2 border-t border-gray-100 pt-3">
        <span className="text-gray-400">Due: </span>
        <span className={isOverdue ? 'text-red-500 font-bold' : 'text-gray-600'}>
          {new Date(task.dueDate).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric' 
          })}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;