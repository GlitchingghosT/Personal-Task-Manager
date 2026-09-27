import React from 'react';
import { Link } from 'react-router-dom';
import home from '../assets/home.png';

const Homepage: React.FC = () => {
  return (
    // Removed bg-white to let your #FAF9FB background show
    <main className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10 text-left">
      <div className="flex flex-col items-start gap-6 w-full md:w-1/2">
        <div className="flex flex-col items-start">
          <h1 className="text-4xl text-[#292929] font-medium leading-tight">
            Manage your Tasks on
          </h1>
          <span className="text-5xl font-semibold text-[#974FD0] mt-1">
            TaskDuty
          </span>
        </div>
        <p className="text-[#737171] text-base font-normal text-start md:pr-10 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non tellus, sapien, morbi ante nunc euismod ac felis ac. Massa et, at platea tempus duis non eget. Hendrerit tortor fermentum bibendum mi nisl semper porttitor. Nec accumsan.
        </p>
        <Link 
          to="/tasks" 
          className="bg-[#974FD0] text-white text-base font-medium rounded-md py-3 px-8 hover:bg-[#833bbd] transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Go to My Tasks
        </Link>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <img src={home} alt="Task Management Illustration" className="w-full max-w-lg object-contain" />
      </div>
    </main>
  );
};

export default Homepage;