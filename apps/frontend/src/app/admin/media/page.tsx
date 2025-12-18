'use client';

import { useState, useEffect } from 'react';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
import Image from 'next/image';
import { API_URL } from '@/lib/utils';

export default function MediaLibraryPage() {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; filename: string; size: number }>>([]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">کتابخانه رسانه</h1>
        <p className="text-muted-foreground">مدیریت فایل‌ها و تصاویر آپلود شده</p>
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm">
        <MediaLibrary
          onSelect={(url) => setSelectedUrl(url)}
          multiple={true}
        />
      </div>

      {selectedUrl && (
        <div className="mt-6 bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">تصویر انتخاب شده</h2>
          <div className="relative w-full h-64 rounded-lg overflow-hidden border">
            <Image
              src={selectedUrl.startsWith('http') ? selectedUrl : `${API_URL}${selectedUrl}`}
              alt="Selected"
              fill
              className="object-contain"
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2 font-semibold">URL تصویر:</label>
            <input
              type="text"
              value={selectedUrl}
              readOnly
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 font-mono text-sm"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

