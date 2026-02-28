import React from 'react';
import { Template } from '../../config/templates/index';
import { Page } from '../../types/page';
import { Check } from 'lucide-react';

interface LivePreviewCardProps {
  data: Template | Page;
  selected?: boolean;
  onClick?: () => void;
  actions?: React.ReactNode;
}

export const LivePreviewCard: React.FC<LivePreviewCardProps> = ({ data, selected, onClick, actions }) => {
  // Normalize data between Template and Page
  const isPage = 'slug' in data;
  const theme = data.theme;
  const blocks = data.blocks;

  // Profile data mapping
  const profile = isPage ? {
    bio: (data as Page).bio,
    avatarUrl: (data as Page).avatarUrl,
    profileImageStyle: (data as Page).theme.profileImageStyle,
    nameSize: (data as Page).theme.nameSize,
  } : (data as Template).profile;

  const name = isPage ? (data as Page).title : (data as Template).name;

  // Background Style
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

  // Button Style (Simplified for preview)
  const getButtonStyle = () => ({
    backgroundColor: theme.buttonStyle === 'OUTLINE' ? 'transparent' : theme.buttonStyle === 'SOFT' ? `${theme.buttonColor}20` : theme.buttonColor,
    color: theme.buttonStyle === 'OUTLINE' || theme.buttonStyle === 'SOFT' ? theme.buttonColor : theme.buttonTextColor,
    border: theme.buttonStyle === 'OUTLINE' ? `2px solid ${theme.buttonColor}` : 'none',
    borderRadius: theme.buttonShape === 'ROUNDED' ? '6px' : theme.buttonShape === 'PILL' ? '999px' : '0px',
    boxShadow: theme.buttonShadow !== 'NONE' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
    fontFamily: theme.buttonFont || theme.font || 'inherit',
  });

  return (
    <div className={`group relative flex flex-col items-center text-left transition-all duration-300 w-full mb-2 ${onClick ? 'cursor-pointer' : ''}`}>
      {/* Mobile Screen Container */}
      <div
        onClick={onClick}
        className={`
          w-full aspect-[9/16] rounded-[2rem] overflow-hidden shadow-sm relative border-[6px] 
          ${selected ? 'border-blue-600 shadow-blue-200 shadow-lg' : 'border-gray-100 group-hover:border-blue-100 group-hover:shadow-md'}
          transition-all duration-300 bg-white
        `}
      >
        {/* Inner Content Scroller */}
        <div
          className="w-full h-full overflow-hidden p-4 flex flex-col items-center gap-3 relative"
          style={{
            ...getBackgroundStyle(),
            color: theme.textColor,
            fontFamily: theme.font
          }}
        >
          {/* Banner (Mini) */}
          {theme.bannerType && theme.bannerType !== 'NONE' && (
            <div className="absolute top-0 left-0 right-0 h-16 opacity-80"
              style={{
                background: theme.bannerType === 'GRADIENT'
                  ? `linear-gradient(to right, ${theme.bannerGradientStart || '#ff00cc'}, ${theme.bannerGradientEnd || '#333399'})`
                  : `url(${theme.bannerImage})`,
                backgroundSize: 'cover'
              }}
            />
          )}

          {/* Profile Section */}
          <div className="flex flex-col items-center z-10 w-full mt-4">
            {profile.avatarUrl && (
              <div
                className="w-12 h-12 shadow-sm mb-2 object-cover bg-white/20 backdrop-blur-sm"
                style={{
                  borderRadius: profile.profileImageStyle === 'CIRCLE' ? '50%' : profile.profileImageStyle === 'ROUNDED' ? '8px' : '0px',
                  backgroundImage: `url(${profile.avatarUrl})`,
                  backgroundSize: 'cover'
                }}
              />
            )}
            {/* Fake Name/Bio lines */}
            <div className={`h-2.5 w-24 mb-1.5 rounded-full opacity-90`} style={{ backgroundColor: theme.textColor }} />
            <div className={`h-1.5 w-32 rounded-full opacity-60`} style={{ backgroundColor: theme.textColor }} />
          </div>

          {/* Blocks (Miniatures) */}
          <div className="w-full flex flex-col gap-2 z-10 px-1 items-center">
            {blocks.slice(0, 5).map((block: any, i) => {
              // LINK
              if (block.type === 'LINK') {
                return (
                  <div key={i} className="w-full h-8 flex items-center justify-center text-[8px] font-medium px-2 truncate"
                    style={getButtonStyle()}
                  >
                    {block.content.title}
                  </div>
                );
              }

              // SOCIAL
              if (block.type === 'SOCIAL') {
                // Simplified social row
                return (
                  <div key={i} className="flex gap-1.5 justify-center py-1 bg-transparent">
                    {[1, 2, 3].map(k => (
                      <div key={k} className="w-5 h-5 rounded-full opacity-80"
                        style={{
                          backgroundColor: theme.socialStyle === 'FILLED' ? (theme.socialIconColor || theme.textColor) : 'transparent',
                          border: theme.socialStyle !== 'FILLED' ? `1px solid ${theme.socialIconColor || theme.textColor}` : 'none'
                        }}
                      />
                    ))}
                  </div>
                )
              }

              // AFFILIATE
              if (block.type === 'AFFILIATE') {
                return (
                  <div key={i} className="w-full bg-white/50 backdrop-blur-sm rounded-lg p-1 mt-1 border border-black/5" style={{ borderColor: block.content.strokeColor }}>
                    <div className="w-16 h-2 rounded-full mb-1 opacity-80" style={{ backgroundColor: theme.textColor }} />
                    <div className="flex gap-1">
                      <div className="flex-1 h-3 rounded bg-white" />
                      <div className="flex-1 h-3 rounded bg-white" />
                    </div>
                  </div>
                );
              }

              // IMAGE OR MEDIA BLOCKS (Card, Countdown)
              if (['IMAGE', 'CARD', 'COUNTDOWN'].includes(block.type) && block.content.imageUrl || block.type === 'IMAGE' && block.content.url) {
                const imageUrl = block.type === 'IMAGE' ? block.content.url : block.content.imageUrl;
                return (
                  <div key={i} className="w-full h-16 rounded-lg bg-cover bg-center shadow-sm opacity-90"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                )
              }

              return null;
            })}
          </div>
        </div>

        {/* Selected Overlay Indicator */}
        {selected && (
          <div className="absolute inset-0 bg-blue-600/10 z-20 pointer-events-none flex items-center justify-center">
            <div className="bg-blue-600 text-white rounded-full p-2 shadow-lg scale-110">
              <Check size={20} strokeWidth={3} />
            </div>
          </div>
        )}

        {/* Actions Overlay */}
        {actions && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-center justify-center backdrop-blur-[2px]">
            {actions}
          </div>
        )}
      </div>

      {/* Label Below */}
      <div className="mt-3 text-center px-1 w-full">
        <h3 className={`text-sm font-bold truncate ${selected ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-500'}`}>
          {name}
        </h3>
      </div>
    </div>
  );
};
