import React from 'react';
import { PageBranding } from './PageBranding';
import { Page } from '../../types/page';
import {
  Link2, Type, Image as ImageIcon,
  Share2, Mail, Video, Layout,
  Instagram, Twitter, Linkedin, Youtube, Facebook, Github, Globe,
  Lock, RotateCcw, BadgeCheck, MessageCircle
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
  const getProfileImageStyle = () => {
    const size = typeof theme.profileImageSize === 'number' ? `${theme.profileImageSize}px` : theme.profileImageSize === 'SM' ? '80px' : theme.profileImageSize === 'LG' ? '120px' : '96px';
    return {
      borderRadius: theme.profileImageStyle === 'CIRCLE' ? '9999px' : theme.profileImageStyle === 'ROUNDED' ? '24px' : '0px',
      width: size,
      height: size,
    };
  };

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
      <div className="w-full h-full bg-white overflow-hidden">
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

  // DESKTOP MODE (or any non-mobile)
  return (
    <div className="w-full h-full bg-white overflow-hidden flex flex-col">
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
                    <>
                      <h2 className={`text-center mt-4 mb-2 opacity-90
                              ${theme.fontWeight === 'BOLD' ? 'font-extrabold' : theme.fontWeight === 'SEMIBOLD' ? 'font-bold' : 'font-semibold'}
                          `}
                        style={{ fontSize: `${theme.baseFontSize * 1.5}px` }} // 1.5x scale
                      >{block.content.text}</h2>
                      {block.content.subTitle && (
                        <p className="text-center opacity-75 mb-4 px-4 overflow-hidden text-ellipsis"
                          style={{ fontSize: `${theme.baseFontSize * 0.9}px` }}
                        >{block.content.subTitle}</p>
                      )}
                    </>
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

                  {/* AFFILIATE */}
                  {block.type === 'AFFILIATE' && (
                    <div
                      className="bg-white overflow-hidden text-gray-900"
                      style={{
                        borderRadius: block.content.cornerRadius === 'sharp' ? '0px' : block.content.cornerRadius === 'rounded' ? '12px' : '16px',
                        boxShadow: block.content.shadow === 'none' ? 'none' : block.content.shadow === 'strong' ? '0 10px 25px -5px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
                        border: block.content.strokeColor ? `2px solid ${block.content.strokeColor}` : 'none',
                      }}
                    >
                      {block.content.imageUrl && (
                        <img src={block.content.imageUrl} alt={block.content.title} className="w-full h-32 object-cover" />
                      )}
                      <div className="p-3">
                        <h3 className="text-sm font-bold mb-0.5">{block.content.title || 'Product Title'}</h3>
                        {block.content.price && <p className="text-base font-extrabold text-green-600 mb-2">{block.content.price}</p>}
                        <span className="block w-full text-center py-2 bg-black text-white text-xs font-bold rounded-md">
                          {block.content.buttonText || 'Buy Now'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* CARD */}
                  {block.type === 'CARD' && (
                    <div
                      className="bg-white overflow-hidden text-gray-900"
                      style={{
                        borderRadius: block.content.cornerRadius === 'sharp' ? '0px' : block.content.cornerRadius === 'rounded' ? '12px' : '16px',
                        boxShadow: block.content.shadow === 'none' ? 'none' : block.content.shadow === 'strong' ? '0 10px 25px -5px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
                        border: block.content.strokeColor ? `2px solid ${block.content.strokeColor}` : 'none',
                      }}
                    >
                      {block.content.imageUrl && (
                        <img src={block.content.imageUrl} alt={block.content.title} className="w-full h-32 object-cover" />
                      )}
                      <div className="p-3">
                        <h3 className="text-sm font-bold mb-1">{block.content.title || 'Card Title'}</h3>
                        {block.content.description && <p className="text-xs text-gray-500 mb-2 leading-relaxed">{block.content.description}</p>}
                        <span className="block w-full text-center py-2 bg-black text-white text-xs font-bold rounded-md">
                          {block.content.buttonText || 'Learn More'}
                        </span>
                      </div>
                    </div>
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

        {/* Full Width WhatsApp Button Output */}
        {(page.waDisplayType === 'BUTTON' || page.waDisplayType === 'BOTH') && page.waNumber && (
          <div className="w-full max-w-[680px] mt-6 px-2">
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-sm font-bold rounded-xl hover:bg-[#1EBE5D] shadow-sm transition-all focus:outline-none">
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </button>
          </div>
        )}

        {theme.showBranding && (
          <PageBranding />
        )}

      </div>

      {/* Floating WhatsApp Button Output */}
      {(!page.waDisplayType || page.waDisplayType === 'FLOATING' || page.waDisplayType === 'BOTH') && page.waNumber && (
        <div className="absolute bottom-6 right-6 z-50 p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1EBE5D] transition-all cursor-pointer">
          <MessageCircle className="w-8 h-8 fill-current" />
        </div>
      )}
    </div>
  );
};
