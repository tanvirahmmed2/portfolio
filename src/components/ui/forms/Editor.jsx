"use client";
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Reusable toolbar menu bar
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const items = [
    {
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
      icon: <span className="font-black">B</span>
    },
    {
      label: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
      icon: <span className="italic font-serif">I</span>
    },
    {
      label: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
      icon: <span className="font-extrabold text-[10px]">H2</span>
    },
    {
      label: 'Heading 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 }),
      icon: <span className="font-extrabold text-[10px]">H3</span>
    },
    {
      label: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    },
    {
      label: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
      )
    },
    {
      label: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
      icon: <span className="font-serif font-black text-sm">“</span>
    },
    {
      label: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
      icon: <span className="font-mono text-[10px]">&lt;/&gt;</span>
    },
    {
      label: 'Undo',
      action: () => editor.chain().focus().undo().run(),
      isActive: () => false,
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
        </svg>
      )
    },
    {
      label: 'Redo',
      action: () => editor.chain().focus().redo().run(),
      isActive: () => false,
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.934 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-wrap gap-1 p-1.5 bg-neutral-900 border border-neutral-800 rounded-t-xl border-b-transparent">
      {items.map((item, idx) => (
        <button
          key={idx}
          type="button"
          onClick={item.action}
          className={`p-1.5 rounded-lg text-xs font-bold flex items-center justify-center min-w-[28px] h-[28px] border transition-all duration-150
            ${item.isActive()
              ? 'bg-violet-600/20 text-violet-400 border-violet-500/20 shadow-sm'
              : 'bg-transparent text-neutral-400 border-transparent hover:bg-neutral-800/80 hover:text-white'
            }
          `}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default function Editor({ content, onChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[250px] max-h-[400px] overflow-y-auto prose prose-invert max-w-none text-sm text-neutral-300 p-4 border border-neutral-800 rounded-b-xl bg-neutral-950/40',
      },
    },
  });

  // Watch for external content updates (useful when parent data loads asynchronously)
  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!mounted) return null;

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
