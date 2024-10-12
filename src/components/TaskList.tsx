import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import { Plus, Trash2, Edit2, Check, X, CheckSquare, User, Calendar, Tag, Flag, Briefcase, BarChart2, Search, Clipboard, Edit3 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  priority?: 'Low' | 'Medium' | 'High';
  project?: string;
  status?: 'To Do' | 'In Progress' | 'Done';
}

const TaskList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { taskLists, addTask, toggleTask, deleteTask, updateTask, updateTaskList } = useTaskContext();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  const currentList = taskLists.find(list => list.id === id);

  if (!currentList) {
    return <div className="p-8 text-white">List not found</div>;
  }

  const filteredTasks = useMemo(() => {
    return currentList.tasks.filter(task => {
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        (task.assignee && task.assignee.toLowerCase().includes(searchLower)) ||
        (task.dueDate && task.dueDate.includes(searchTerm)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
        (task.priority && task.priority.toLowerCase().includes(searchLower)) ||
        (task.status && task.status.toLowerCase().includes(searchLower))
      );
    });
  }, [currentList.tasks, searchTerm]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(currentList.id, newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id);
    setEditedTask({ ...task });
  };

  const handleSaveEdit = () => {
    if (editedTask) {
      updateTask(currentList.id, editedTask.id, editedTask);
      setEditingTask(null);
      setEditedTask(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditedTask(null);
  };

  const handleEditChange = (field: keyof Task, value: any) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [field]: value });
    }
  };

  const handleToggleTask = (taskId: string) => {
    const task = currentList.tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.completed ? 'To Do' : 'Done';
      const updatedTask = { ...task, completed: !task.completed, status: newStatus };
      updateTask(currentList.id, taskId, updatedTask);
    }
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
    setEditedDescription(currentList.description || '');
  };

  const handleSaveDescription = () => {
    updateTaskList(currentList.id, { description: editedDescription });
    setIsEditingDescription(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'low':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'to do':
        return 'bg-red-600';
      case 'in progress':
        return 'bg-yellow-600';
      case 'done':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
  };

  return (
    <div className="p-8 glass-card m-4">
      <div className="flex items-center mb-4">
        <Clipboard size={32} className="text-[#004AEC] mr-4" />
        <h2 className="text-2xl font-bold text-white">{currentList.name}</h2>
      </div>
      {isEditingDescription ? (
        <div className="mb-4 flex items-center">
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 rounded futuristic-input mr-2"
            placeholder="Enter board description"
          />
          <button onClick={handleSaveDescription} className="futuristic-button">
            <Check size={16} className="mr-2" />
            Save
          </button>
        </div>
      ) : (
        <div className="mb-4 flex items-center">
          <p className="text-white mr-2">{currentList.description || 'No description'}</p>
          <button onClick={handleEditDescription} className="text-[#004AEC] hover:text-[#0056FF] transition duration-300">
            <Edit3 size={16} />
          </button>
        </div>
      )}
      <div className="mb-4 flex items-center">
        <Search size={20} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded futuristic-input"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800/50 shadow-md rounded-lg overflow-hidden neon-border">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="py-2 px-4 text-left text-white"><CheckSquare size={16} className="inline mr-2" />Task</th>
              <th className="py-2 px-4 text-left text-white"><User size={16} className="inline mr-2" />Assignee</th>
              <th className="py-2 px-4 text-left text-white"><Calendar size={16} className="inline mr-2" />Due Date</th>
              <th className="py-2 px-4 text-left text-white"><Tag size={16} className="inline mr-2" />Tags</th>
              <th className="py-2 px-4 text-left text-white"><Flag size={16} className="inline mr-2" />Priority</th>
              <th className="py-2 px-4 text-left text-white"><Briefcase size={16} className="inline mr-2" />Project</th>
              <th className="py-2 px-4 text-left text-white"><BarChart2 size={16} className="inline mr-2" />Status</th>
              <th className="py-2 px-4 text-left text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition duration-300 ease-in-out">
                {editingTask === task.id ? (
                  <>
                    <td colSpan={8} className="py-2 px-4">
                      <div className="flex flex-wrap -mx-2">
                        <div className="w-full sm:w-1/2 px-2 mb-2">
                          <input
                            type="text"
                            value={editedTask?.title || ''}
                            onChange={(e) => handleEditChange('title', e.target.value)}
                            className="w-full p-2 rounded futuristic-input"
                            placeholder="Task title"
                          />
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-2">
                          <input
                            type="text"
                            value={editedTask?.assignee || ''}
                            onChange={(e) => handleEditChange('assignee', e.target.value)}
                            className="w-full p-2 rounded futuristic-input"
                            placeholder="Assignee"
                          />
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-2">
                          <input
                            type="date"
                            value={editedTask?.dueDate || ''}
                            onChange={(e) => handleEditChange('dueDate', e.target.value)}
                            className="w-full p-2 rounded futuristic-input"
                          />
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-2">
                          <input
                            type="text"
                            value={editedTask?.tags?.join(', ') || ''}
                            onChange={(e) => handleEditChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                            className="w-full p-2 rounded futuristic-input"
                            placeholder="Tags (comma-separated)"
                          />
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-2">
                          <select
                            value={editedTask?.priority || ''}
                            onChange={(e) => handleEditChange('priority', e.target.value)}
                            className="w-full p-2 rounded futuristic-input"
                          >
                            <option value="">Select Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-2">
                          <input
                            type="text"
                            value={editedTask?.project || ''}
                            onChange={(e) => handleEditChange('project', e.target.value)}
                            className="w-full p-2 rounded futuristic-input"
                            placeholder="Project"
                          />
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-2">
                          <select
                            value={editedTask?.status || ''}
                            onChange={(e) => handleEditChange('status', e.target.value)}
                            className="w-full p-2 rounded futuristic-input"
                          >
                            <option value="">Select Status</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                        <div className="w-full px-2 flex justify-end">
                          <button onClick={handleSaveEdit} className="futuristic-button mr-2">
                            <Check size={16} className="mr-2" />
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="futuristic-button bg-red-500 hover:bg-red-600">
                            <X size={16} className="mr-2" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4">
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 border-[#004AEC] mr-2 cursor-pointer transition-all duration-300 ${
                            task.completed ? 'bg-[#004AEC]' : 'bg-transparent'
                          }`}
                          onClick={() => handleToggleTask(task.id)}
                        >
                          {task.completed && <Check size={12} className="text-white" />}
                        </div>
                        <span className={task.completed ? 'line-through text-gray-500' : 'text-white'}>
                          {task.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-white">
                      <div className="flex items-center">
                        <img
                          src={getAvatarUrl(task.assignee || '')}
                          alt={task.assignee}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        {task.assignee}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-white">{task.dueDate || '-'}</td>
                    <td className="py-2 px-4">
                      {task.tags?.map(tag => (
                        <span key={tag} className="bg-[#004AEC]/50 text-white px-2 py-1 rounded-full text-xs mr-1">
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td className="py-2 px-4">
                      <span className={`${getPriorityColor(task.priority || 'low')} text-white px-2 py-1 rounded-full text-xs`}>
                        {task.priority || 'Low'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-white">{task.project || '-'}</td>
                    <td className="py-2 px-4">
                      <span className={`${getStatusColor(task.status || 'to do')} text-white px-2 py-1 rounded-full text-xs`}>
                        {task.status || 'To Do'}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-[#004AEC] hover:text-[#0056FF] mr-2 transition duration-300"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTask(currentList.id, task.id)}
                        className="text-red-400 hover:text-red-300 transition duration-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleAddTask} className="mt-4">
        <div className="flex">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="New task"
            className="flex-grow p-2 rounded-l futuristic-input"
          />
          <button type="submit" className="futuristic-button rounded-r">
            <Plus size={16} className="inline mr-2" />
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskList;