import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Employees from './pages/Employees';
import History from './pages/History';

const ProtectedLayout = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div class="flex flex-1">
        <Sidebar />
        <main class="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/assets"
        element={
          <ProtectedLayout>
            <Assets />
          </ProtectedLayout>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedLayout>
            <Employees />
          </ProtectedLayout>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedLayout>
            <History />
          </ProtectedLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
