import React from 'react';

// Wireframe Cross Box Helper (Image Placeholder with Diagonal 'X')
export function WireframeCrossBox({ 
  className = '', 
  aspect = 'aspect-video' 
}: { 
  className?: string; 
  aspect?: string; 
}) {
  return (
    <div data-ui="wireframe-cross-box" className={`relative bg-[#E8EAEF] border border-[#CBD5E1] rounded overflow-hidden flex items-center justify-center ${aspect} ${className}`}>
      <svg className="absolute inset-0 w-full h-full text-[#CBD5E1] stroke-current" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100" y2="100" strokeWidth="0.8" />
        <line x1="100" y1="0" x2="0" y2="100" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

// Wireframe Skeleton Bar Helper
export function WireframeBar({ 
  w = 'w-full', 
  h = 'h-2', 
  rounded = 'rounded-xs', 
  className = '' 
}: { 
  w?: string; 
  h?: string; 
  rounded?: string; 
  className?: string; 
}) {
  return <div className={`bg-[#CBD5E1] ${w} ${h} ${rounded} ${className}`} />;
}

// Wireframe Skeleton Pill / Button Helper
export function WireframePill({ 
  w = 'w-14', 
  h = 'h-5', 
  className = '' 
}: { 
  w?: string; 
  h?: string; 
  className?: string; 
}) {
  return <div className={`bg-[#94A3B8] rounded-full ${w} ${h} ${className}`} />;
}
