import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, X, CheckCircle, Clock, AlertCircle, LayoutDashboard } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  isSidebarExpanded: boolean;
}

interface Notification {
  id: string;
  type: 'task' | 'deadline' | 'completed';
  message: string;
  time: string;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarExpanded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { taskLists } = useTaskContext();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'task', message: 'New task assigned: Update documentation', time: '5m ago' },
    { id: '2', type: 'deadline', message: 'Project deadline tomorrow: UI Redesign', time: '1h ago' },
    { id: '3', type: 'completed', message: 'Task completed: Fix login bug', time: '2h ago' },
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const filteredLists = taskLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleListSelect = (listId: string) => {
    navigate(`/list/${listId}`);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <AlertCircle size={16} className="text-blue-400" />;
      case 'deadline':
        return <Clock size={16} className="text-yellow-400" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      default:
        return <Bell size={16} className="text-gray-400" />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 flex justify-between items-center z-50">
      <div className="flex items-center">
        <img src="https://havane.shop/wp-content/uploads/2024/09/logo.png" alt="Logo" className="h-8 mr-4" />
        <div className="relative" ref={searchRef}>
          <input
            type="text"
            placeholder="Search lists..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-gray-700 text-white px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          {showSearchResults && (
            <div className="absolute mt-2 w-64 bg-gray-800 rounded-md shadow-lg overflow-hidden z-10">
              {filteredLists.length > 0 ? (
                filteredLists.map(list => (
                  <div
                    key={list.id}
                    className="p-2 hover:bg-gray-700 cursor-pointer text-white"
                    onClick={() => handleListSelect(list.id)}
                  >
                    {list.name}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-400">No lists found</div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => navigate('/')}
          className="ml-4 text-gray-300 hover:text-white transition-colors duration-300"
          title="Dashboard"
        >
          <LayoutDashboard size={24} />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationClick}
            className="relative text-gray-300 hover:text-white transition-colors duration-300"
          >
            <Bell size={24} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg overflow-hidden z-10">
              <div className="p-2 bg-gray-700 text-white font-semibold flex justify-between items-center">
                <span>Notifications</span>
                <button
                  onClick={() => setNotifications([])}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Clear all
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">No new notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className="p-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-300">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm text-white">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveNotification(notif.id)}
                          className="text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="relative group">
          <button className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition-colors duration-300">
            <User size={24} />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg overflow-hidden z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-2">
              <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Settings</a>
              <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;