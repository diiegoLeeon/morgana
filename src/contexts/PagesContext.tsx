import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Descendant } from 'slate';

interface Page {
  id: string;
  title: string;
  content: Descendant[];
}

interface PagesContextType {
  pages: Page[];
  addPage: () => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
}

const PagesContext = createContext<PagesContextType | undefined>(undefined);

export const usePagesContext = () => {
  const context = useContext(PagesContext);
  if (!context) {
    throw new Error('usePagesContext must be used within a PagesProvider');
  }
  return context;
};

const initialPage: Page = {
  id: '1',
  title: 'Welcome to Notion Clone',
  content: [
    {
      type: 'paragraph',
      children: [{ text: 'Welcome to Notion Clone! Start editing this page or create a new one.' }],
    },
  ],
};

export const PagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Page[]>([initialPage]);

  const addPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ],
    };
    setPages((prevPages) => [...prevPages, newPage]);
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
    setPages((prevPages) =>
      prevPages.map((page) => (page.id === id ? { ...page, ...updates } : page))
    );
  };

  return (
    <PagesContext.Provider value={{ pages, addPage, updatePage }}>
      {children}
    </PagesContext.Provider>
  );
};