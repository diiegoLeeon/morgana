import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface TaskList {
  id: string;
  name: string;
  tasks: Task[];
  description?: string;
}

interface TaskContextType {
  taskLists: TaskList[];
  addTaskList: (name: string) => void;
  addTask: (listId: string, title: string) => void;
  toggleTask: (listId: string, taskId: string) => void;
  deleteTask: (listId: string, taskId: string) => void;
  updateTask: (listId: string, taskId: string, updates: Partial<Task>) => void;
  updateTaskList: (listId: string, updates: Partial<TaskList>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([
    {
      id: '1',
      name: 'General To Do',
      description: 'This is our main task board for general tasks.',
      tasks: [
        {
          id: '1',
          title: 'Contabilidad',
          completed: false,
          assignee: 'Diego Gamboa',
          dueDate: '2024-05-05',
          tags: ['Design'],
          priority: 'High',
          project: 'Wallet',
          status: 'To Do'
        },
        {
          id: '2',
          title: 'Marketing',
          completed: false,
          assignee: 'Ana López',
          dueDate: '2024-05-09',
          tags: ['Marketing'],
          priority: 'Medium',
          project: 'Wallet',
          status: 'In Progress'
        },
        {
          id: '3',
          title: 'Desarrollo Frontend',
          completed: true,
          assignee: 'Carlos Ruiz',
          dueDate: '2024-05-14',
          tags: ['Development'],
          priority: 'High',
          project: 'Wallet',
          status: 'Done'
        }
      ]
    }
  ]);

  const addTaskList = (name: string) => {
    setTaskLists([...taskLists, { id: Date.now().toString(), name, tasks: [] }]);
  };

  const addTask = (listId: string, title: string) => {
    setTaskLists(taskLists.map(list => 
      list.id === listId 
        ? { ...list, tasks: [...list.tasks, { id: Date.now().toString(), title, completed: false, status: 'To Do' }] }
        : list
    ));
  };

  const toggleTask = (listId: string, taskId: string) => {
    setTaskLists(taskLists.map(list => 
      list.id === listId 
        ? { ...list, tasks: list.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )}
        : list
    ));
  };

  const deleteTask = (listId: string, taskId: string) => {
    setTaskLists(taskLists.map(list => 
      list.id === listId 
        ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
        : list
    ));
  };

  const updateTask = (listId: string, taskId: string, updates: Partial<Task>) => {
    setTaskLists(taskLists.map(list =>
      list.id === listId
        ? {
            ...list,
            tasks: list.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            )
          }
        : list
    ));
  };

  const updateTaskList = (listId: string, updates: Partial<TaskList>) => {
    setTaskLists(taskLists.map(list =>
      list.id === listId ? { ...list, ...updates } : list
    ));
  };

  return (
    <TaskContext.Provider value={{ taskLists, addTaskList, addTask, toggleTask, deleteTask, updateTask, updateTaskList }}>
      {children}
    </TaskContext.Provider>
  );
};