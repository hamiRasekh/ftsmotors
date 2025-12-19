'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { API_URL } from '@/lib/utils';
import Image from 'next/image';

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  multiple?: boolean;
  accept?: string[];
  type?: 'image' | 'file';
}

interface MediaFile {
  url: string;
  filename: string;
  size?: number;
  createdAt?: Date;
}

export function MediaLibrary({ 
  onSelect, 
  multiple = false, 
  accept = ['image/*'],
  type = 'image'
}: MediaLibraryProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [libraryFiles, setLibraryFiles] = useState<MediaFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  // Fetch existing files from library
  useEffect(() => {
    fetchLibraryFiles();
  }, [type]);

  const fetchLibraryFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = type === 'image' ? '/api/upload/images' : '/api/upload/files';
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const files = await response.json();
        setLibraryFiles(files);
      }
    } catch (error) {
      console.error('Error fetching library files:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      const token = localStorage.getItem('token');

      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const endpoint = type === 'image' ? '/api/upload/image' : '/api/upload/file';
          const response = await fetch(`${API_URL}${endpoint}`, {
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
        setLibraryFiles((prev) => [...results, ...prev]); // Add to library immediately
        
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
    [onSelect, type],
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

  const allFiles = activeTab === 'library' ? libraryFiles : [...uploadedFiles, ...libraryFiles];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'library'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📚 کتابخانه ({libraryFiles.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'upload'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ⬆️ آپلود جدید
        </button>
      </div>

      {/* Upload Area */}
      {activeTab === 'upload' && (
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
              <p className="text-xs text-gray-500">
                {type === 'image' ? 'PNG, JPG, GIF, WebP تا 10MB' : 'هر نوع فایلی تا 50MB'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Library Files */}
      {activeTab === 'library' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : allFiles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>هیچ فایلی در کتابخانه وجود ندارد</p>
              <p className="text-sm mt-2">به تب &quot;آپلود جدید&quot; بروید و فایل آپلود کنید</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[500px] overflow-y-auto">
              {allFiles.map((file, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(file.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all group ${
                    selectedUrl === file.url
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  {type === 'image' ? (
                    <Image
                      src={`${API_URL}${file.url}`}
                      alt={file.filename}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
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
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Recently Uploaded Files */}
      {activeTab === 'upload' && uploadedFiles.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">فایل‌های آپلود شده اخیر:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                onClick={() => handleSelect(file.url)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedUrl === file.url
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                {type === 'image' ? (
                  <Image
                    src={`${API_URL}${file.url}`}
                    alt={file.filename}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
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
        </div>
      )}
    </div>
  );
}
