import React from 'react';

interface ThreeDotsLoaderProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThreeDotsLoader: React.FC<ThreeDotsLoaderProps> = ({
  color = 'bg-black',
  size = 'md',
  className = ''
}) => {
  const sizeClass = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-5 h-5' : 'w-3 h-3';

  return (
    <div className={`flex space-x-2 items-center justify-center ${className}`}>
      <span className="sr-only">Loading...</span>
      <div className={`${sizeClass} ${color} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
      <div className={`${sizeClass} ${color} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
      <div className={`${sizeClass} ${color} rounded-full animate-bounce`}></div>
    </div>
  );
};
