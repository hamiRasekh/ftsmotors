'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { API_URL } from '@/lib/utils';
import Image from 'next/image';

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  multiple?: boolean;
  accept?: string[];
}

export function MediaLibrary({ onSelect, multiple = false, accept = ['image/*'] }: MediaLibraryProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; filename: string; size: number }>>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      const token = localStorage.getItem('token');

      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`${API_URL}/api/upload/image`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('خطا در آپلود فایل');
          }

          return response.json();
        });

        const results = await Promise.all(uploadPromises);
        setUploadedFiles((prev) => [...prev, ...results]);
        
        if (results.length === 1 && onSelect) {
          onSelect(results[0].url);
          setSelectedUrl(results[0].url);
        }
      } catch (error) {
        console.error('Error uploading files:', error);
        alert('خطا در آپلود فایل‌ها');
      } finally {
        setUploading(false);
      }
    },
    [onSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    multiple,
  });

  const handleSelect = (url: string) => {
    setSelectedUrl(url);
    if (onSelect) {
      onSelect(url);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-600">در حال آپلود...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-600">
              {isDragActive ? 'فایل را اینجا رها کنید' : 'برای آپلود کلیک کنید یا فایل را بکشید'}
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF تا 10MB</p>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              onClick={() => handleSelect(file.url)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                selectedUrl === file.url ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <Image
                src={`${API_URL}${file.url}`}
                alt={file.filename}
                fill
                className="object-cover"
              />
              {selectedUrl === file.url && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

