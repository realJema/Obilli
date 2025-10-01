"use client";

import Image from "next/image";
import { useState } from "react";
import { SyntheticEvent } from "react";

interface DefaultImageProps {
  src: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function DefaultImage({ src, alt, fill, width, height, className, priority, onError }: DefaultImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    onError?.(e);
  };

  // Determine if image should be unoptimized to reduce transformations
  const shouldUnoptimize = () => {
    // Unoptimize SVGs
    if (src?.endsWith('.svg')) return true;
    
    // Unoptimize GIFs (animated images)
    if (src?.endsWith('.gif')) return true;
    
    // Unoptimize small images (under 50KB equivalent - roughly 224x224 pixels)
    if (width && height && width * height < 50000) return true;
    
    // Unoptimize thumbnail-sized images
    if (width && height && (width < 200 || height < 200)) return true;
    
    return false;
  };

  if (hasError) {
    // Default fallback with logo - unoptimized since it's small
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`} role="img" aria-label={alt || "Default image placeholder"}>
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-2 rounded-md flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Obilli Logo" 
              width={48} 
              height={48} 
              className="rounded-md"
              unoptimized
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">Obilli</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || "Image"}
      className={className}
      onError={handleError}
      {...(fill ? { fill: true } : { width, height })}
      {...(priority ? { priority: true } : {})}
      {...(shouldUnoptimize() ? { unoptimized: true } : {})}
    />
  );
}
