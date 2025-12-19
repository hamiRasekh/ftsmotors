'use client';

import { useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get quill instance after component mounts
  useEffect(() => {
    if (containerRef.current) {
      const quillEditor = containerRef.current.querySelector('.ql-editor');
      if (quillEditor) {
        const quillContainer = quillEditor.closest('.ql-container');
        if (quillContainer) {
          // Access quill instance from the container
          quillRef.current = (quillContainer as any).__quill || (quillEditor as any).__quill;
        }
      }
    }
  }, [value]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          image: function () {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append('file', file);

              try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/upload/image`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  body: formData,
                });

                if (response.ok) {
                  const data = await response.json();
                  // Get quill instance from ref
                  const quill = quillRef.current;
                  if (quill) {
                    const range = quill.getSelection();
                    const index = range ? range.index : 0;
                    quill.insertEmbed(index, 'image', data.url);
                  } else {
                    // Fallback: try to get from DOM
                    const quillEditor = containerRef.current?.querySelector('.ql-editor');
                    if (quillEditor) {
                      const quillContainer = quillEditor.closest('.ql-container');
                      const quillInstance = (quillContainer as any)?.__quill || (quillEditor as any)?.__quill;
                      if (quillInstance) {
                        const range = quillInstance.getSelection();
                        const index = range ? range.index : 0;
                        quillInstance.insertEmbed(index, 'image', data.url);
                      }
                    }
                  }
                }
              } catch (error) {
                console.error('Error uploading image:', error);
                alert('خطا در آپلود تصویر');
              }
            };
          },
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'direction',
    'color',
    'background',
    'align',
    'link',
    'image',
    'video',
  ];

  return (
    <div ref={containerRef} className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'محتوا را اینجا بنویسید...'}
        style={{ direction: 'rtl' }}
      />
      <style jsx global>{`
        .ql-editor {
          min-height: 300px;
          direction: rtl;
          text-align: right;
        }
        .ql-container {
          font-family: 'Vazir', sans-serif;
        }
        .ql-toolbar {
          direction: rtl;
        }
      `}</style>
    </div>
  );
}

