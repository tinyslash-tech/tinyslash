import React from 'react';
import { PageBranding } from './PageBranding';
import { Page } from '../../types/page';
import {
  Link2, Type, Image as ImageIcon,
  Share2, Mail, Video, Layout,
  Instagram, Twitter, Linkedin, Youtube, Facebook, Github, Globe
} from 'lucide-react';

interface PreviewProps {
  page: Page;
}

export const Preview: React.FC<PreviewProps> = ({ page }) => {
  const theme = page.theme;

  const getBackgroundStyle = () => {
    switch (theme.backgroundType) {
      case 'GRADIENT':
        return { backgroundImage: `linear-gradient(${theme.gradientDirection || 'to bottom'}, ${theme.gradientStart}, ${theme.gradientEnd})` };
      case 'IMAGE':
        return {
          backgroundImage: `url(${theme.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      default:
        return { backgroundColor: theme.background };
    }
  };

  const getButtonStyle = () => {
    const base = {
      backgroundColor: theme.buttonStyle === 'OUTLINE' ? 'transparent' : theme.buttonColor,
      color: theme.buttonStyle === 'OUTLINE' ? theme.buttonColor : theme.buttonTextColor,
      border: theme.buttonStyle === 'OUTLINE' ? `2px solid ${theme.buttonColor}` : 'none',
      borderRadius: theme.buttonStyle === 'ROUNDED' ? '999px' : theme.buttonStyle === 'SHARP' ? '0px' : '12px'
    };
    return base;
  };

  const socialIconMap: Record<string, any> = {
    instagram: Share2, // Replace with actual social icons later
    twitter: Share2,
    linkedin: Share2,
    youtube: Share2,
    github: Share2
  };

  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 overflow-hidden">
      <div className="relative w-[375px] h-[700px] bg-black rounded-[40px] shadow-2xl border-8 border-black overflow-hidden ring-4 ring-gray-900/10">
        {/* Status Bar Mockup */}
        <div className="absolute top-0 w-full h-8 bg-black z-20 flex justify-between items-center px-6">
          <div className="w-12 h-3 rounded-full bg-gray-800/50"></div>
        </div>

        {/* Page Content */}
        <div className="w-full h-full overflow-y-auto hide-scrollbar bg-white" style={{
          ...getBackgroundStyle(),
          color: theme.textColor,
          fontFamily: theme.font
        }}>
          <div className="pt-16 pb-12 px-6 flex flex-col items-center min-h-full">
            {/* Avatar */}
            {page.avatarUrl && (
              <img src={page.avatarUrl} alt="" className="w-24 h-24 rounded-full object-cover mb-4 ring-2 ring-white/20 shadow-lg" />
            )}

            <h1 className="text-xl font-bold mb-1 drop-shadow-sm text-center">{page.title}</h1>
            {page.bio && <p className="text-sm opacity-90 text-center mb-8 max-w-[85%] leading-relaxed">{page.bio}</p>}

            {/* Blocks */}
            <div className="w-full space-y-4">
              {/* Blocks */}
              {(() => {
                const visibleBlocks = page.blocks.filter(b => b.visible).sort((a, b) => a.order - b.order);
                const groupedBlocks: any[] = [];
                let currentSocialGroup: any = null;

                visibleBlocks.forEach(block => {
                  if (block.type === 'SOCIAL') {
                    if (!currentSocialGroup) {
                      currentSocialGroup = {
                        id: `group-${block.id}`,
                        type: 'SOCIAL_GROUP',
                        blocks: [block]
                      };
                      groupedBlocks.push(currentSocialGroup);
                    } else {
                      currentSocialGroup.blocks.push(block);
                    }
                  } else {
                    currentSocialGroup = null;
                    groupedBlocks.push(block);
                  }
                });

                const getSocialPlatform = (url: string) => {
                  const lowerUrl = url.toLowerCase();
                  if (lowerUrl.includes('instagram')) return { icon: Instagram, color: '#E1306C' };
                  if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) return { icon: Twitter, color: '#1DA1F2' };
                  if (lowerUrl.includes('linkedin')) return { icon: Linkedin, color: '#0077B5' };
                  if (lowerUrl.includes('youtube')) return { icon: Youtube, color: '#FF0000' };
                  if (lowerUrl.includes('facebook')) return { icon: Facebook, color: '#1877F2' };
                  if (lowerUrl.includes('github')) return { icon: Github, color: '#333333' };
                  return { icon: Globe, color: theme.textColor };
                };

                const socialSizeMap = {
                  SM: 'w-8 h-8 p-1.5',
                  MD: 'w-12 h-12 p-3',
                  LG: 'w-16 h-16 p-4'
                };
                const iconSizeMap = {
                  SM: 'w-4 h-4',
                  MD: 'w-6 h-6',
                  LG: 'w-8 h-8'
                }
                const currentSize = theme.socialIconSize || 'MD';

                return groupedBlocks.map(group => {
                  if (group.type === 'SOCIAL_GROUP') {
                    return (
                      <div key={group.id} className="flex flex-wrap justify-center gap-4 py-2">
                        {group.blocks.map((block: any) => {
                          const { icon: Icon, color } = getSocialPlatform(block.content.url);
                          // Default background is #e8e8e8 (light gray)
                          const bgStyle = { backgroundColor: theme.socialBackgroundColor || '#e8e8e8' };

                          return (
                            <a
                              key={block.id}
                              href={block.content.url}
                              target="_blank"
                              rel="noreferrer"
                              className={`flex items-center justify-center rounded-full shadow-sm hover:scale-110 transition-all hover:shadow-md ${socialSizeMap[currentSize]}`}
                              style={{ color: color, ...bgStyle }}
                            >
                              <Icon className={iconSizeMap[currentSize]} />
                            </a>
                          );
                        })}
                      </div>
                    );
                  }

                  const block = group;
                  return (
                    <div key={block.id} className="w-full">
                      {/* LINK */}
                      {block.type === 'LINK' && (
                        <a
                          href={block.content.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`
                            block w-full text-center transition-transform hover:scale-[1.02] active:scale-95
                            shadow-sm backdrop-blur-sm
                            ${theme.fontSize === 'SM' ? 'py-3 px-5 text-sm' : theme.fontSize === 'LG' ? 'py-5 px-8 text-lg' : 'py-4 px-6 text-base'}
                            ${theme.fontWeight === 'BOLD' ? 'font-bold' : theme.fontWeight === 'SEMIBOLD' ? 'font-semibold' : 'font-medium'}
                          `}
                          style={getButtonStyle()}
                        >
                          {block.content.title}
                        </a>
                      )}

                      {/* HEADER */}
                      {block.type === 'HEADER' && (
                        <h2 className={`text-center mt-4 mb-2 opacity-90 
                            ${theme.fontSize === 'SM' ? 'text-base' : theme.fontSize === 'LG' ? 'text-2xl' : 'text-lg'}
                            ${theme.fontWeight === 'BOLD' ? 'font-extrabold' : theme.fontWeight === 'SEMIBOLD' ? 'font-bold' : 'font-semibold'}
                        `}>{block.content.text}</h2>
                      )}

                      {/* TEXT */}
                      {block.type === 'TEXT' && (
                        <p className={`text-center opacity-80 px-2 leading-relaxed
                            ${theme.fontSize === 'SM' ? 'text-xs' : theme.fontSize === 'LG' ? 'text-base' : 'text-sm'}
                        `}>{block.content.text}</p>
                      )}

                      {/* IMAGE */}
                      {block.type === 'IMAGE' && block.content.url && (
                        <div className="rounded-2xl overflow-hidden shadow-md my-2">
                          <img src={block.content.url} alt={block.content.alt} className="w-full h-auto object-cover" />
                        </div>
                      )}

                      {/* FORM */}
                      {block.type === 'FORM' && (
                        <div className="bg-white p-4 rounded-xl shadow-sm text-gray-900">
                          <h3 className="text-sm font-bold mb-3">{block.content.title}</h3>
                          <input type="email" placeholder="Email Address" className="w-full text-sm border-gray-200 bg-gray-50 rounded-lg mb-2" />
                          <button className="w-full py-2 bg-black text-white text-xs font-bold rounded-lg">Subscribe</button>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {theme.showBranding && (
              <PageBranding />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
