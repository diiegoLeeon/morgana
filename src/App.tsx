import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import Dashboard from './components/Dashboard';
import { TaskProvider } from './contexts/TaskContext';
import ErrorBoundary from './components/ErrorBoundary';
import LottieBackground from './components/LottieBackground';
import Navbar from './components/Navbar';

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <TaskProvider>
      <Router>
        <div className="flex flex-col h-screen text-white">
          <LottieBackground />
          <Navbar isSidebarExpanded={isSidebarExpanded} />
          <div className="flex flex-1 overflow-hidden pt-16">
            <Sidebar onExpandChange={setIsSidebarExpanded} />
            <main className={`flex-1 overflow-y-auto bg-background/30 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-14'}`}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/list/:id" element={<TaskList />} />
                </Routes>
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App;