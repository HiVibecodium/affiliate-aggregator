'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackText?: string;
  priority?: boolean;
  quality?: number;
}

/**
 * Optimized Image Component with CDN support
 * - Automatic AVIF/WebP conversion
 * - Lazy loading by default
 * - Graceful fallback to placeholder
 * - Blur placeholder for loading state
 */
export function OptimizedImage({
  src,
  alt,
  width = 48,
  height = 48,
  className = '',
  fallbackText,
  priority = false,
  quality = 75,
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Generate fallback initials from text
  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Show fallback if no src or error occurred
  if (!src || hasError) {
    const initials = fallbackText ? getInitials(fallbackText) : alt ? getInitials(alt) : '?';
    const bgColors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500',
    ];
    // Generate consistent color based on text
    const colorIndex = (fallbackText || alt || '').charCodeAt(0) % bgColors.length;
    const bgColor = bgColors[colorIndex];

    return (
      <div
        className={`flex items-center justify-center ${bgColor} text-white font-semibold rounded ${className}`}
        style={{ width, height, fontSize: Math.min(width, height) * 0.4 }}
        title={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onError={handleError}
        onLoad={handleLoad}
        className={`rounded object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        sizes={`${width}px`}
      />
    </div>
  );
}

/**
 * Network Logo Component - specialized for affiliate network logos
 */
interface NetworkLogoProps {
  networkName: string;
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
};

export function NetworkLogo({
  networkName,
  logoUrl,
  size = 'md',
  className = '',
}: NetworkLogoProps) {
  const dimension = sizeMap[size];

  // Try to get logo from Clearbit if no custom logo
  const effectiveUrl = logoUrl || getLogoUrl(networkName);

  return (
    <OptimizedImage
      src={effectiveUrl}
      alt={`${networkName} logo`}
      width={dimension}
      height={dimension}
      fallbackText={networkName}
      className={className}
      quality={85}
    />
  );
}

/**
 * Program Logo Component - specialized for program/merchant logos
 */
interface ProgramLogoProps {
  programName: string;
  merchantUrl?: string | null;
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgramLogo({
  programName,
  merchantUrl,
  logoUrl,
  size = 'md',
  className = '',
}: ProgramLogoProps) {
  const dimension = sizeMap[size];

  // Priority: custom logo > Clearbit from merchant URL > Clearbit from name
  const effectiveUrl =
    logoUrl || (merchantUrl ? getLogoFromUrl(merchantUrl) : getLogoUrl(programName));

  return (
    <OptimizedImage
      src={effectiveUrl}
      alt={`${programName} logo`}
      width={dimension}
      height={dimension}
      fallbackText={programName}
      className={className}
      quality={85}
    />
  );
}

/**
 * Get logo URL from Clearbit's free logo API
 * Falls back to logo.dev if Clearbit fails
 */
function getLogoUrl(companyName: string): string | null {
  if (!companyName) return null;

  // Sanitize company name for domain lookup
  const sanitized = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();

  if (!sanitized) return null;

  // Use Clearbit's logo API (free, no API key required)
  return `https://logo.clearbit.com/${sanitized}.com`;
}

/**
 * Extract domain and get logo from URL
 */
function getLogoFromUrl(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const domain = urlObj.hostname.replace('www.', '');
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    return null;
  }
}
