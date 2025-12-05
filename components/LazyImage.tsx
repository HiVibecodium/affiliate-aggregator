'use client';

import { useState, useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  fallback?: string;
  threshold?: number;
  blur?: boolean;
}

/**
 * Lazy loading image component with intersection observer
 * Loads images only when they enter the viewport
 */
export function LazyImage({
  src,
  alt,
  fallback = '/images/placeholder.png',
  threshold = 0.1,
  blur = true,
  className = '',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const imageSrc = error ? fallback : src;

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: props.height || 100 }}
    >
      {isInView ? (
        <>
          <Image
            src={imageSrc}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${blur && !isLoaded ? 'blur-sm scale-105' : ''}`}
            {...props}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  );
}

/**
 * Skeleton placeholder for images
 */
export function ImageSkeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`} />;
}
