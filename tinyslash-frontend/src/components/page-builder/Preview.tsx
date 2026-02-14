import React from 'react';
import { PageBranding } from './PageBranding';
import { Page } from '../../types/page';
import {
  Link2, Type, Image as ImageIcon,
  Share2, Mail, Video, Layout,
  Instagram, Twitter, Linkedin, Youtube, Facebook, Github, Globe,
  Lock, RotateCcw, BadgeCheck
} from 'lucide-react';
import { SocialLinks } from './blocks/SocialLinks';

interface PreviewProps {
  page: Page;
  mode: 'MOBILE' | 'DESKTOP';
}

export const Preview: React.FC<PreviewProps> = ({ page, mode }) => {
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

  /* Update theme-based styles */
  const getButtonStyle = () => {
    // Helper to get button padding based on numeric scale (0-100) or legacy ENUM
    const getPadding = () => {
      // Legacy fallback
      if (typeof theme.buttonSize === 'string') return theme.buttonSize === 'SM' ? '0.75rem 1.25rem' : theme.buttonSize === 'LG' ? '1.25rem 2rem' : '1rem 1.5rem';

      // Numeric scale (0-100) -> map to padding
      const scale = typeof theme.buttonSize === 'number' ? theme.buttonSize : 50;
      const vPad = 0.5 + (scale / 100) * 1.0; // 0.5rem - 1.5rem
      const hPad = 1.0 + (scale / 100) * 2.0; // 1rem - 3rem
      return `${vPad}rem ${hPad}rem`;
    };

    const base: React.CSSProperties = {
      backgroundColor: theme.buttonStyle === 'OUTLINE' ? 'transparent' : theme.buttonStyle === 'SOFT' ? `${theme.buttonColor}20` : theme.buttonColor,
      color: theme.buttonStyle === 'OUTLINE' || theme.buttonStyle === 'SOFT' ? theme.buttonColor : theme.buttonTextColor,
      border: theme.buttonStyle === 'OUTLINE' ? `2px solid ${theme.buttonColor}` : 'none',
      borderRadius: theme.buttonShape === 'ROUNDED' ? '12px' : theme.buttonShape === 'PILL' ? '999px' : '0px',
      boxShadow: theme.buttonShadow === 'STRONG' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' :
        theme.buttonShadow === 'SUBTLE' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : 'none',

      // Dynamic Sizing
      padding: getPadding(),
      fontSize: theme.buttonTextSize ? `${theme.buttonTextSize}px` : 'inherit',
      fontFamily: theme.buttonFont || 'inherit',
    };
    return base;
  };

  const socialIconMap: Record<string, any> = {
    instagram: Share2,
    twitter: Share2,
    linkedin: Share2,
    youtube: Share2,
    github: Share2
  };

  // Content Container Style
  const getContentStyle = () => ({
    maxWidth: `${theme.pageMaxWidth || 680}px`,
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.contentSpacing === 'COMPACT' ? '12px' : theme.contentSpacing === 'RELAXED' ? '32px' : '20px',
  });

  // Profile Image Style
  const getProfileImageStyle = () => ({
    borderRadius: theme.profileImageStyle === 'CIRCLE' ? '9999px' : theme.profileImageStyle === 'ROUNDED' ? '24px' : '0px',
    width: theme.profileImageSize === 'SM' ? '80px' : theme.profileImageSize === 'LG' ? '120px' : '96px',
    height: theme.profileImageSize === 'SM' ? '80px' : theme.profileImageSize === 'LG' ? '120px' : '96px',
  });

  // Helper to handle font size standardizing
  const getBaseFontSize = () => {
    if (typeof theme.fontSize === 'number') return theme.fontSize;
    // Legacy map
    if (theme.fontSize === 'SM') return 14;
    if (theme.fontSize === 'LG') return 18;
    return 16;
  };

  const baseFontSize = getBaseFontSize();

  // Frame Containers
  if (mode === 'MOBILE') {
    return (
      <div className="relative w-[375px] h-[700px] bg-black rounded-[40px] shadow-2xl border-8 border-black overflow-hidden ring-4 ring-gray-900/10 transition-all duration-500 ease-in-out">
        {/* Status Bar Mockup */}
        <div className="absolute top-0 w-full h-8 bg-black z-20 flex justify-between items-center px-6">
          <div className="w-12 h-3 rounded-full bg-gray-800/50"></div>
        </div>
        <PreviewContent
          page={page}
          theme={{ ...theme, baseFontSize }} // Pass processed font size
          getBackgroundStyle={getBackgroundStyle}
          getButtonStyle={getButtonStyle}
          getContentStyle={getContentStyle}
          getProfileImageStyle={getProfileImageStyle}
        />
      </div>
    );
  }

  // DESKTOP MODE
  return (
    <div className="relative w-full h-full max-w-[1024px] max-h-[700px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-500 ease-in-out">
      {/* Browser Chrome */}
      <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-4 shrink-0">
        {/* Traffic Lights */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/20" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center justify-center px-2">
          <div className="max-w-xl w-full h-7 bg-white rounded-md border border-gray-200 flex items-center px-3 gap-2 text-xs text-gray-500 shadow-sm">
            <Lock className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">tinyslash.com/p/</span>
            <span className="text-gray-900 font-medium">{page.slug}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-14 flex justify-end">
          <RotateCcw className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-hidden w-full h-full relative">
        <PreviewContent
          page={page}
          theme={{ ...theme, baseFontSize }}
          getBackgroundStyle={getBackgroundStyle}
          getButtonStyle={getButtonStyle}
          getContentStyle={getContentStyle}
          getProfileImageStyle={getProfileImageStyle}
        />
      </div>
    </div>
  );
};

// Extracted Content Component for reuse
const PreviewContent: React.FC<any> = ({ page, theme, getBackgroundStyle, getButtonStyle, getContentStyle, getProfileImageStyle }) => {
  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar bg-white" style={{
      ...getBackgroundStyle(),
      color: theme.textColor,
      fontFamily: theme.font
    }}>
      {/* Banner */}
      {theme.bannerType && theme.bannerType !== 'NONE' && (
        <div
          className="w-full bg-cover bg-center bg-no-repeat"
          style={{
            height: `${theme.bannerHeight || 150}px`,
            background: theme.bannerType === 'GRADIENT'
              ? `linear-gradient(to right, ${theme.bannerGradientStart || '#ff00cc'}, ${theme.bannerGradientEnd || '#333399'})`
              : `url(${theme.bannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      <div className={`px-6 flex flex-col items-center min-h-full ${theme.bannerType && theme.bannerType !== 'NONE' ? '-mt-12' : 'pt-16 pb-12'}`}>
        {/* Avatar */}
        {page.avatarUrl && (
          <img
            src={page.avatarUrl}
            alt=""
            className="object-cover mb-4 ring-4 ring-white shadow-lg bg-white relative z-10"
            style={getProfileImageStyle()}
          />
        )}

        <h1 className="text-xl font-bold mb-1 drop-shadow-sm text-center flex items-center justify-center gap-2">
          {page.title}
          {page.verified && (
            <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500 text-white" />
          )}
        </h1>
        {page.bio && <p className="text-sm opacity-90 text-center mb-8 max-w-[85%] leading-relaxed">{page.bio}</p>}

        {/* Blocks Container with Dynamic Width and Spacing */}
        <div style={getContentStyle()}>
          {/* Blocks */}
          {(() => {
            const visibleBlocks = page.blocks.filter((b: any) => b.visible).sort((a: any, b: any) => a.order - b.order);
            const groupedBlocks: any[] = [];
            let currentSocialGroup: any = null;

            visibleBlocks.forEach((block: any) => {
              groupedBlocks.push(block);
            });

            return groupedBlocks.map((block: any) => {

              // SOCIAL BLOCK (New Structure: list of links)
              if (block.type === 'SOCIAL') {
                const links = block.content.links || [];
                // Fallback for old structure (single url) - wrap in array
                const displayLinks = links.length > 0 ? links : (block.content.url ? [{ platform: block.content.platform, url: block.content.url }] : []);

                return <SocialLinks key={block.id} links={displayLinks} theme={theme} previewMode={true} />;
              }

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
                            ${theme.fontWeight === 'BOLD' ? 'font-bold' : theme.fontWeight === 'SEMIBOLD' ? 'font-semibold' : 'font-medium'}
                          `}
                      style={{
                        ...getButtonStyle(),
                        fontSize: theme.baseFontSize ? `${theme.baseFontSize}px` : undefined // fallback handled in getButton or globally
                      }}
                    >
                      {block.content.title}
                    </a>
                  )}

                  {/* HEADER */}
                  {block.type === 'HEADER' && (
                    <h2 className={`text-center mt-4 mb-2 opacity-90
                            ${theme.fontWeight === 'BOLD' ? 'font-extrabold' : theme.fontWeight === 'SEMIBOLD' ? 'font-bold' : 'font-semibold'}
                        `}
                      style={{ fontSize: `${theme.baseFontSize * 1.5}px` }} // 1.5x scale
                    >{block.content.text}</h2>
                  )}

                  {/* TEXT */}
                  {block.type === 'TEXT' && (
                    <p className="text-center opacity-80 px-2 leading-relaxed"
                      style={{ fontSize: `${theme.baseFontSize}px` }}
                    >{block.content.text}</p>
                  )}

                  {/* IMAGE */}
                  {block.type === 'IMAGE' && block.content.url && (
                    <div className="rounded-2xl overflow-hidden shadow-md my-2">
                      <img src={block.content.url} alt={block.content.alt} className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {/* FORM */}
                  {block.type === 'FORM' && (
                    <div className="bg-white p-4 rounded-xl shadow-sm text-gray-900 border border-gray-100">
                      <h3 className="text-sm font-bold mb-3">{block.content.title}</h3>
                      {block.content.collectName && (
                        <input type="text" placeholder="Name" className="w-full text-sm border border-gray-200 bg-gray-50 rounded-md px-3 py-2 mb-2 outline-none" />
                      )}
                      <input type="email" placeholder="Email Address" className="w-full text-sm border border-gray-200 bg-gray-50 rounded-md px-3 py-2 mb-3 outline-none" />
                      <button className="w-full py-2 bg-black text-white text-xs font-bold rounded-md">{block.content.buttonText || 'Subscribe'}</button>
                    </div>
                  )}

                  {/* EMAIL */}
                  {block.type === 'EMAIL' && (
                    <div className="bg-white p-4 rounded-xl shadow-sm text-gray-900 flex flex-col items-center text-center">
                      <Mail className="w-6 h-6 text-gray-400 mb-2" />
                      <h3 className="text-sm font-bold mb-3">{block.content.title}</h3>
                      <button className="w-full py-2 bg-black text-white text-xs font-bold rounded-lg">{block.content.buttonText || 'Sign Up'}</button>
                    </div>
                  )}

                  {/* DIVIDER */}
                  {block.type === 'DIVIDER' && (
                    <div className={`w-full flex items-center justify-center py-${block.content.spacing === 'large' ? '8' : block.content.spacing === 'medium' ? '6' : '4'}`}>
                      {block.content.style !== 'empty' && (
                        <div className={`w-full border-t ${block.content.style === 'dotted' ? 'border-dotted' : 'border-solid'} border-current opacity-20`} />
                      )}
                    </div>
                  )}

                  {/* PAYMENT */}
                  {block.type === 'PAYMENT' && (
                    <a
                      href={block.content.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full bg-white text-gray-900 border border-gray-200 shadow-sm rounded-xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                        <div className="font-bold text-lg">₹</div>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-sm font-bold">{block.content.label}</h3>
                        <p className="text-xs text-gray-500">Secure Payment</p>
                      </div>
                    </a>
                  )}

                  {/* VIDEO */}
                  {block.type === 'VIDEO' && block.content.url && (
                    <div className="rounded-2xl overflow-hidden shadow-md my-2 aspect-video bg-black">
                      {/* Basic YouTube Embed Handler */}
                      <iframe
                        src={block.content.url.replace('watch?v=', 'embed/').split('&')[0]}
                        title="Video"
                        className="w-full h-full"
                        allowFullScreen
                        frameBorder="0"
                      />
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
  );
};
