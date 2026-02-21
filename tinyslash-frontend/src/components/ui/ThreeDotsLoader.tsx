import React from 'react';

interface ThreeDotsLoaderProps {
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThreeDotsLoader: React.FC<ThreeDotsLoaderProps> = ({
  color = 'bg-black',
  size = 'md',
  className = '',
}) => {
  const sizeClass =
    size === 'xs'
      ? 'w-1.5 h-1.5'
      : size === 'sm'
        ? 'w-2 h-2'
        : size === 'lg'
          ? 'w-4 h-4'
          : 'w-3 h-3';

  const gapClass =
    size === 'xs' || size === 'sm' ? 'gap-1.5' : 'gap-2';

  return (
    <div
      className={`flex items-center justify-center ${gapClass} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
      <span
        className={`${sizeClass} ${color} rounded-full inline-block`}
        style={{ animation: 'dotBounce 1.4s ease-in-out infinite both', animationDelay: '0s' }}
      />
      <span
        className={`${sizeClass} ${color} rounded-full inline-block`}
        style={{ animation: 'dotBounce 1.4s ease-in-out infinite both', animationDelay: '0.2s' }}
      />
      <span
        className={`${sizeClass} ${color} rounded-full inline-block`}
        style={{ animation: 'dotBounce 1.4s ease-in-out infinite both', animationDelay: '0.4s' }}
      />
      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0.6) translateY(0);
            opacity: 0.4;
          }
          40% {
            transform: scale(1) translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

/** Full-screen centered loader wrapper — use this for page-level loaders */
export const PageDotsLoader: React.FC<{ text?: string; minHeight?: string }> = ({
  text,
  minHeight = 'min-h-screen',
}) => (
  <div className={`flex flex-col items-center justify-center w-full ${minHeight}`}>
    <ThreeDotsLoader size="lg" color="bg-black" />
    {text && <p className="mt-4 text-sm text-gray-500 font-medium">{text}</p>}
  </div>
);

/** Inline-card centered loader — use for section-level loading areas */
export const CardDotsLoader: React.FC<{ text?: string; className?: string }> = ({
  text,
  className = 'h-48',
}) => (
  <div className={`flex flex-col items-center justify-center w-full ${className}`}>
    <ThreeDotsLoader size="md" color="bg-black" />
    {text && <p className="mt-3 text-sm text-gray-500">{text}</p>}
  </div>
);

