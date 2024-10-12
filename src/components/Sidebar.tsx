import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, List, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';

interface SidebarProps {
  onExpandChange: (isExpanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const { taskLists, addTaskList } = useTaskContext();
  const [newListName, setNewListName] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    setIsFixed(!isFixed);
    onExpandChange(newExpandedState);
  };

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      addTaskList(newListName.trim());
      setNewListName('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && !isFixed) {
        setIsExpanded(false);
        onExpandChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFixed, onExpandChange]);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-background/90 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden z-50 ${
        isExpanded ? 'w-64' : 'w-14'
      } ${isFixed ? 'shadow-lg' : ''}`}
      onMouseEnter={() => !isFixed && setIsExpanded(true)}
      onMouseLeave={() => !isFixed && setIsExpanded(false)}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-2 right-2 text-white hover:text-primary transition-colors duration-300"
      >
        {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>
      <div className={`p-4 ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <form onSubmit={handleAddList} className="mb-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
            className="w-full p-2 rounded futuristic-input mb-2"
          />
          <button type="submit" className="w-full futuristic-button">
            <Plus size={16} className="inline mr-2" />
            Add List
          </button>
        </form>
        <nav>
          <ul>
            {taskLists.map((list) => (
              <li key={list.id} className="mb-2">
                <Link
                  to={`/list/${list.id}`}
                  className="flex items-center p-2 rounded hover:bg-background/50 text-white transition duration-300 ease-in-out"
                >
                  <List size={16} className="mr-2" />
                  {list.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;