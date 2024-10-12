import React, { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { usePagesContext } from '../contexts/PagesContext';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pages, updatePage } = usePagesContext();
  const page = pages.find((p) => p.id === id) || pages[0];

  const editor = useMemo(() => withReact(createEditor()), []);

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'paragraph':
        return <p {...props.attributes}>{props.children}</p>;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const handleChange = (value: Descendant[]) => {
    const title = value[0]?.children[0]?.text || 'Untitled';
    updatePage(page.id, { content: value, title });
  };

  // Ensure that page.content is always a valid array of Descendant
  const initialValue: Descendant[] = Array.isArray(page?.content) && page.content.length > 0
    ? page.content
    : [{ type: 'paragraph', children: [{ text: '' }] }];

  return (
    <div className="p-8 dark:bg-gray-900 dark:text-white min-h-screen">
      <Slate editor={editor} value={initialValue} onChange={handleChange}>
        <Editable
          renderElement={renderElement}
          placeholder="Start typing here..."
          className="outline-none"
        />
      </Slate>
    </div>
  );
};

export default Editor;