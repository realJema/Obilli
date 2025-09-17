import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function SkeletonLoader({ className = '', width, height }: SkeletonLoaderProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;
  
  return (
    <div 
      className={`bg-muted animate-pulse rounded-md ${className}`}
      style={style}
    >
      {/* Add a subtle shine effect */}
      <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
    </div>
  );
}