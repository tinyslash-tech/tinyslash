import React from 'react';
import { PageTheme } from '../../../types/page';
import {
  Instagram, Twitter, Linkedin, Youtube, Facebook, Github, Globe, Video
} from 'lucide-react';

interface LinkItem {
  platform: string;
  url: string;
}

interface SocialLinksProps {
  links: LinkItem[];
  theme: PageTheme;
  className?: string;
  previewMode?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ links, theme, className = '', previewMode = false }) => {

  const getSocialPlatform = (platform: string, url: string) => {
    // 1. Explicit platform check
    if (platform) {
      switch (platform.toLowerCase()) {
        case 'instagram': return { icon: Instagram, color: '#E1306C' };
        case 'twitter': return { icon: Twitter, color: '#1DA1F2' };
        case 'x': return { icon: Twitter, color: '#000000' };
        case 'linkedin': return { icon: Linkedin, color: '#0077B5' };
        case 'youtube': return { icon: Youtube, color: '#FF0000' };
        case 'facebook': return { icon: Facebook, color: '#1877F2' };
        case 'github': return { icon: Github, color: '#333333' };
        case 'tiktok': return { icon: Video, color: '#000000' };
        default: return { icon: Globe, color: theme.textColor };
      }
    }

    // 2. URL detection fallback
    const lowerUrl = (url || '').toLowerCase();
    if (lowerUrl.includes('instagram')) return { icon: Instagram, color: '#E1306C' };
    if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) return { icon: Twitter, color: '#1DA1F2' };
    if (lowerUrl.includes('linkedin')) return { icon: Linkedin, color: '#0077B5' };
    if (lowerUrl.includes('youtube')) return { icon: Youtube, color: '#FF0000' };
    if (lowerUrl.includes('facebook')) return { icon: Facebook, color: '#1877F2' };
    if (lowerUrl.includes('github')) return { icon: Github, color: '#333333' };
    if (lowerUrl.includes('tiktok')) return { icon: Video, color: '#000000' };

    return { icon: Globe, color: theme.textColor };
  };

  // Determine Sizing Logic
  const isCustomSize = typeof theme.socialIconSize === 'number';
  const customSizeValue = isCustomSize ? theme.socialIconSize as number : 48; // Default to 48px if somehow undefined
  const standardSize = (theme.socialIconSize as string) || 'MD';

  // Mobile-first responsive sizing for standard sizes
  const containerClasses: Record<string, string> = {
    SM: 'w-8 h-8 p-1.5 sm:w-10 sm:h-10 sm:p-2',
    MD: 'w-12 h-12 p-3 sm:w-14 sm:h-14 sm:p-3',
    LG: 'w-16 h-16 p-4 sm:w-20 sm:h-20 sm:p-5'
  };

  const gapStyle = theme.socialIconSpacing ? { gap: `${theme.socialIconSpacing}px` } : {};

  return (
    <div className={`flex flex-wrap justify-center gap-4 sm:gap-6 py-4 ${className}`} style={gapStyle}>
      {links.map((link, idx) => {
        const { icon: Icon, color } = getSocialPlatform(link.platform, link.url);

        const isMonochrome = theme.socialStyle === 'MONOCHROME';
        const isOutline = theme.socialStyle === 'OUTLINE';

        // Styling Logic
        let iconColor: string;
        let backgroundColor: string;
        let border: string;

        if (isOutline) {
          iconColor = color;
          backgroundColor = 'transparent';
          border = `2px solid ${color}`;
        } else if (isMonochrome) {
          // Monochrome uses the theme's specific icon color or falls back to text color
          const monoColor = theme.socialIconColor || theme.textColor;
          iconColor = monoColor;
          backgroundColor = 'transparent';
          border = `2px solid ${monoColor}`;
        } else {
          // FILLED (Default)
          iconColor = '#ffffff';
          backgroundColor = color;
          border = 'none';
        }

        // Apply Custom Inline Styles if needed
        const style: React.CSSProperties = {
          color: iconColor,
          backgroundColor: backgroundColor,
          border: border,
          transition: 'all 0.2s ease-in-out',
        };

        if (isCustomSize) {
          style.width = `${customSizeValue}px`;
          style.height = `${customSizeValue}px`;
          style.padding = `${customSizeValue * 0.25}px`; // 25% padding
        }

        return (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className={`
              flex items-center justify-center rounded-full shadow-sm hover:shadow-md hover:scale-110
              ${!isCustomSize ? containerClasses[standardSize] : ''}
            `}
            style={style}
          >
            <Icon className="w-full h-full" />
          </a>
        );
      })}
    </div>
  );
};
