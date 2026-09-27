import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import MyTask from './pages/MyTask';
import NewTask from './pages/NewTask';
import EditTask from './pages/EditTask';

export const App: React.FC = () => {
  return (
    <main className='min-h-screen w-full bg-gray-50'>
      <Navbar/>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/tasks' element={<MyTask/>} />
          <Route path='/tasks/new' element={<NewTask/>} />
          <Route path='/tasks/edit/:id' element={<EditTask/>} />
          <Route path='*' element={<Homepage/>} />
        </Routes>
      </div>
    </main>
  );
};

export default App;