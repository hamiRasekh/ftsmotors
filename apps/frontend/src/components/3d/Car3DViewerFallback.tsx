'use client';

interface Car3DViewerFallbackProps {
  className?: string;
}

export function Car3DViewerFallback({ className = '' }: Car3DViewerFallbackProps) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
      <div className="text-center">
        <div className="text-gray-400 mb-2">مدل 3D</div>
        <div className="text-sm text-gray-500">در حال بارگذاری...</div>
      </div>
    </div>
  );
}

