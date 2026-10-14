import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Homepage from './pages/Homepage';
import MyTask from './pages/MyTask';
import NewTask from './pages/NewTask';
import EditTask from './pages/EditTask';
import { useAuth } from './context/AuthContext';

const AppShell: React.FC = () => (
  <main className="min-h-screen w-full bg-gray-50">
    <Navbar />
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Outlet />
    </div>
  </main>
);

const RequireAuth: React.FC = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const App: React.FC = () => (
  <Routes>
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/signup" element={<AuthPage mode="signup" />} />
    <Route element={<AppShell />}>
      <Route path="/" element={<Homepage />} />
      <Route element={<RequireAuth />}>
        <Route path="/tasks" element={<MyTask />} />
        <Route path="/tasks/new" element={<NewTask />} />
        <Route path="/tasks/edit/:id" element={<EditTask />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default App;
