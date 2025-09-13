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

  if (hasError) {
    // Default fallback with logo
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`} role="img" aria-label={alt || "Default image placeholder"}>
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-2 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">B</span>
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
    />
  );
}
