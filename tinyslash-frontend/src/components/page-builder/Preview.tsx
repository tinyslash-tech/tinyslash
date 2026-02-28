import React from 'react';
import { PageBranding } from './PageBranding';
import { Page } from '../../types/page';
import {
  Link2, Type, Image as ImageIcon,
  Share2, Mail, Video, Layout,
  Instagram, Twitter, Linkedin, Youtube, Facebook, Github, Globe,
  Lock, RotateCcw, BadgeCheck, MessageCircle, ShoppingCart, QrCode, Star, FileText, Send, MessageSquare, Hash, MapPin, Clock, Calendar, Download
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
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed' // Parallax effect
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
      boxShadow: theme.buttonShadow === 'GLOW' ? `0 0 20px ${theme.buttonColor}80` :
        theme.buttonShadow === 'STRONG' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' :
          theme.buttonShadow === 'SUBTLE' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : 'none',

      // Dynamic Sizing
      padding: getPadding(),
      fontSize: theme.buttonTextSize ? `${theme.buttonTextSize}px` : 'inherit',
      fontFamily: theme.buttonFont || 'inherit',
      fontWeight: theme.fontWeight === 'SEMIBOLD' ? 600 : theme.fontWeight === 'BOLD' ? 700 : 400,
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

  // Unified Blueprint Block Container Style
  const getBlockContainerStyle = (contentOverrideBg?: string, contentOverrideStroke?: string, contentOverrideRadius?: string, contentOverrideShadow?: string) => {
    // 1. Background
    // Priority: Explicit Override -> Theme Container Setting -> Default (Frosted glass)
    const bgColor = contentOverrideBg || theme.blockBackgroundColor || 'rgba(255, 255, 255, 0.5)';

    // 2. Border
    // Priority: Explicit Override -> Theme Border Setting -> Default (None)
    const strokeColor = contentOverrideStroke || theme.blockBorderColor || 'transparent';

    // 3. Radius
    // Priority: Explicit Override -> Theme Radius Setting -> Default (Theme Button Shape logic or fallback)
    let radius = '16px';
    if (contentOverrideRadius === 'sharp' || theme.blockCornerRadius === 'SHARP') radius = '0px';
    else if (contentOverrideRadius === 'rounded' || theme.blockCornerRadius === 'ROUNDED') radius = '12px';
    else if (theme.blockCornerRadius === 'PILL') radius = '9999px';
    else if (theme.blockCornerRadius === 'XL') radius = '24px';

    // 4. Shadow
    // Priority: Explicit Override -> Theme Shadow
    const shadowType = contentOverrideShadow || theme.blockShadow || 'SM';
    let boxShadow = 'none';
    if (shadowType === 'SM') boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    else if (shadowType === 'MD') boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    else if (shadowType === 'LG' || shadowType === 'strong') boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    else if (shadowType === 'GLOW') boxShadow = `0 0 15px ${strokeColor !== 'transparent' ? strokeColor : 'rgba(255,255,255,0.5)'}`;

    const isTranslucent = bgColor.includes('rgba') && parseFloat(bgColor.split(',')[3]) < 1;

    return {
      backgroundColor: bgColor,
      border: strokeColor !== 'transparent' ? `2px solid ${strokeColor}` : 'none',
      borderRadius: radius,
      boxShadow: boxShadow,
      backdropFilter: isTranslucent ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: isTranslucent ? 'blur(12px)' : 'none',
      overflow: 'hidden' as const
    };
  };

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
          getBlockContainerStyle={getBlockContainerStyle}
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
          getBlockContainerStyle={getBlockContainerStyle}
        />
      </div>
    </div>
  );
};

// Extracted Content Component for reuse
const PreviewContent: React.FC<any> = ({ page, theme, getBackgroundStyle, getButtonStyle, getContentStyle, getProfileImageStyle, getBlockContainerStyle }) => {
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

      <div
        className={`flex flex-col items-center min-h-full ${theme.bannerType && theme.bannerType !== 'NONE' ? '-mt-12' : 'pb-12'}`}
        style={{
          paddingTop: theme.bannerType && theme.bannerType !== 'NONE' ? undefined : `${theme.marginTop ?? 64}px`,
          paddingLeft: `${theme.marginX ?? 24}px`,
          paddingRight: `${theme.marginX ?? 24}px`
        }}
      >
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
                            ${block.content.animation === 'pulse' ? 'animate-pulse' : ''}
                            ${block.content.animation === 'bounce' ? 'animate-bounce' : ''}
                            ${block.content.animation === 'wiggle' ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''}
                          `}
                      style={{
                        ...getButtonStyle(),
                        fontSize: theme.baseFontSize ? `${theme.baseFontSize}px` : undefined, // fallback handled in getButton or globally
                        ...(block.content.overrideBgColor && {
                          backgroundColor: block.content.overrideBgColor,
                          border: theme.buttonStyle === 'OUTLINE' ? `2px solid ${block.content.overrideBgColor}` : 'none'
                        }),
                        ...(block.content.overrideTextColor && { color: block.content.overrideTextColor })
                      }}
                    >
                      {block.content.title}
                    </a>
                  )}

                  {/* HEADER */}
                  {block.type === 'HEADER' && (
                    <>
                      <h2 className={`text-center mt-4 opacity-90
                              ${theme.fontWeight === 'BOLD' ? 'font-extrabold' : theme.fontWeight === 'SEMIBOLD' ? 'font-bold' : 'font-semibold'}
                          `}
                        style={{
                          fontSize: `${theme.baseFontSize * 1.5}px`,
                          marginBottom: block.content.subTitle ? `${block.content.spacing ?? 8}px` : '0px'
                        }}
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
                    <p className={`opacity-80 px-2 leading-relaxed whitespace-pre-wrap
                        ${block.content.align === 'left' ? 'text-left' : block.content.align === 'right' ? 'text-right' : block.content.align === 'justify' ? 'text-justify' : 'text-center'}
                        ${block.content.isBold ? 'font-bold' : ''}
                        ${block.content.isItalic ? 'italic' : ''}
                        ${block.content.isUnderline ? 'underline' : ''}
                      `}
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
                    <div className="p-4 text-gray-900" style={getBlockContainerStyle()}>
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
                    <div className="p-4 text-gray-900 flex flex-col items-center text-center" style={getBlockContainerStyle()}>
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
                      className="block w-full text-gray-900 p-4 flex items-center gap-4 hover:opacity-90 transition-opacity"
                      style={getBlockContainerStyle()}
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
                      className="w-full mb-2 mt-2"
                      style={getBlockContainerStyle(block.content.backgroundColor, block.content.strokeColor, block.content.cornerRadius, block.content.shadow)}
                    >
                      <div className="p-4">
                        <h3
                          className="text-base font-bold mb-4"
                          style={{ color: block.content.textColor || '#111827' }}
                        >
                          {block.content.mainTitle || 'Affiliate Links'}
                        </h3>

                        {(block.content.links || []).length > 0 ? (
                          <div className="space-y-3">
                            {(block.content.links || []).map((link: any, idx: number) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg border transition-all hover:opacity-80"
                                style={{
                                  borderColor: block.content.strokeColor || '#e5e7eb',
                                  backgroundColor: 'rgba(255,255,255,0.5)'
                                }}
                              >
                                <span
                                  className="font-semibold text-sm truncate pr-4"
                                  style={{ color: block.content.textColor || '#374151' }}
                                >
                                  {link.title || 'Product Link'}
                                </span>
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                    <polyline points="7 7 17 7 17 17"></polyline>
                                  </svg>
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No links added yet.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CARD */}
                  {block.type === 'CARD' && (
                    <div
                      className="text-gray-900"
                      style={getBlockContainerStyle(block.content.backgroundColor, block.content.strokeColor, block.content.cornerRadius, block.content.shadow)}
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

                  {/* COUNTDOWN */}
                  {block.type === 'COUNTDOWN' && (
                    <div
                      className="w-full mb-2 mt-2"
                      style={getBlockContainerStyle(block.content.backgroundColor, block.content.strokeColor, block.content.cornerRadius, block.content.shadow)}
                    >
                      {block.content.imageUrl && (
                        <img src={block.content.imageUrl} alt={block.content.title} className="w-full h-32 object-cover" />
                      )}
                      <div className="p-4 flex flex-col items-center">
                        {block.content.title && (
                          <h3
                            className="text-sm font-bold mb-1 text-center"
                            style={{ color: block.content.textColor || '#111827' }}
                          >
                            {block.content.title}
                          </h3>
                        )}
                        {block.content.description && (
                          <p
                            className="text-xs mb-3 text-center leading-relaxed"
                            style={{ color: block.content.textColor || '#4b5563' }}
                          >
                            {block.content.description}
                          </p>
                        )}
                        <div className="grid grid-cols-4 gap-2 w-full max-w-[240px]">
                          {['Days', 'Hours', 'Mins', 'Secs'].map(label => (
                            <div key={label} className="flex flex-col items-center bg-gray-50 rounded-lg py-1.5 border border-gray-100 shadow-sm">
                              <span className="text-sm font-extrabold text-blue-600">00</span>
                              <span className="text-[9px] text-gray-500 uppercase font-semibold">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VOICE */}
                  {block.type === 'VOICE' && (
                    <div className="p-3 text-gray-900 flex items-center gap-3 my-2" style={getBlockContainerStyle()}>
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shrink-0">
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
                      </div>
                      <div className="flex-1">
                        <div className="h-1.5 bg-gray-200 rounded-full w-full overflow-hidden relative">
                          <svg className="absolute inset-0 w-full h-full text-gray-400 opacity-50 preserve-3d" preserveAspectRatio="none" viewBox="0 0 100 10">
                            <path d="M0 5 Q 5 0, 10 5 T 20 5 T 30 5 T 40 5 T 50 5 T 60 5 T 70 5 T 80 5 T 90 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1.5 font-semibold tracking-wide uppercase">{block.content.title || 'Tap to hear from me'}</p>
                      </div>
                    </div>
                  )}

                  {/* VIDEO */}
                  {block.type === 'VIDEO' && block.content.url && (
                    <div className="my-2 aspect-video bg-black" style={getBlockContainerStyle()}>
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

                  {/* WA CATALOG (PREVIEW) */}
                  {block.type === 'WA_CATALOG' && (
                    <div className="my-2" style={getBlockContainerStyle()}>
                      <div className="bg-[#25D366] text-white p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          <h3 className="font-bold text-sm">Order via WhatsApp</h3>
                        </div>
                      </div>

                      <div className="p-0 divide-y divide-gray-100">
                        {(!block.content.items || block.content.items.length === 0) ? (
                          <div className="p-6 text-center text-sm text-gray-400">Products will appear here</div>
                        ) : (
                          block.content.items.map((item: any, idx: number) => (
                            <div key={item.id || idx} className="p-4 flex gap-3">
                              {item.imageUrl ? (
                                <img src={typeof item.imageUrl === 'object' ? item.imageUrl.url : item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-100 shrink-0" />
                              ) : (
                                <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 shrink-0 flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-gray-300" />
                                </div>
                              )}

                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name || 'Unnamed Product'}</h4>
                                <p className="text-[#25D366] font-bold text-sm mt-0.5">₹{item.price || '0'}</p>
                              </div>

                              <div className="shrink-0 flex items-center">
                                {item.inStock !== false ? (
                                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 h-8 px-1">
                                    <button className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded">-</button>
                                    <span className="text-xs font-semibold w-3 text-center">0</span>
                                    <button className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded">+</button>
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded">OUT OF STOCK</span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-3 pointer-events-none opacity-50">
                        <button className="w-full py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                          <MessageCircle className="w-5 h-5" /> Checkout via WhatsApp
                        </button>
                      </div>
                    </div>
                  )}

                  {/* UPI PAY (PREVIEW) */}
                  {block.type === 'UPI_PAY' && (
                    <div className="my-2 p-4 flex flex-col items-center justify-center text-center" style={getBlockContainerStyle()}>
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <QrCode className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{block.content.payeeName || 'TinySlash Store'}</h4>
                      <p className="text-xs text-gray-500 mb-4">{block.content.upiId || 'yourname@okhdfcbank'}</p>

                      {block.content.amountMode === 'FIXED' && block.content.fixedAmount ? (
                        <div className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">
                          ₹{block.content.fixedAmount}
                        </div>
                      ) : (
                        <div className="px-4 py-2 border border-gray-200 rounded-lg text-gray-400 text-xs font-semibold tracking-wider bg-gray-50 mb-4">
                          OPEN AMOUNT
                        </div>
                      )}

                      <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg pointer-events-none opacity-50">
                        {block.content.buttonText || 'Pay via UPI App'}
                      </button>
                    </div>
                  )}

                  {/* MAPS HUB (PREVIEW) */}
                  {block.type === 'MAPS_HUB' && (
                    <div className="my-4 relative" style={getBlockContainerStyle()}>
                      <div className="w-full h-[200px] bg-gray-100 relative">
                        {block.content.googleMapsUrl ? (
                          <div className="absolute inset-0 z-10 bg-black/5 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                            <div className="bg-white px-4 py-2 rounded-full shadow-md text-xs font-bold text-gray-800 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-600" /> Interactive Map Hidden in Preview
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 gap-2 text-sm font-medium">
                            <MapPin className="w-5 h-5" /> No Google Maps URL provided
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        {block.content.businessHours && (
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                            <Clock className="w-4 h-4 text-green-600" />
                            {block.content.businessHours}
                          </div>
                        )}

                        {(block.content.deliveryLinks || []).length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {block.content.deliveryLinks.map((link: any, idx: number) => {
                              const isSwiggy = link.platform === 'SWIGGY';
                              const isZomato = link.platform === 'ZOMATO';
                              const isUber = link.platform === 'UBEREATS';

                              const bgClass = isSwiggy ? 'bg-[#fc8019] text-white' :
                                isZomato ? 'bg-[#cb202d] text-white' :
                                  isUber ? 'bg-[#000000] text-white' :
                                    'bg-gray-100 text-gray-800 border border-gray-200';

                              const label = isSwiggy ? 'Swiggy' :
                                isZomato ? 'Zomato' :
                                  isUber ? 'UberEats' : 'Order Now';

                              return (
                                <div key={idx} className={`py-2 px-3 rounded-lg text-xs font-bold text-center flex items-center justify-center opacity-90 ${bgClass}`}>
                                  Order on {label}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* COMMUNITY JOIN (PREVIEW) */}
                  {block.type === 'COMMUNITY_JOIN' && (
                    <div className="my-4" style={getBlockContainerStyle(
                      block.content.platform === 'DISCORD' ? '#5865F2' :
                        block.content.platform === 'WHATSAPP' ? '#25D366' :
                          block.content.platform === 'SLACK' ? '#4A154B' : '#0088cc'
                    )}>
                      <div className="p-6 flex flex-col items-center text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                          {block.content.platform === 'DISCORD' ? <MessageSquare className="w-8 h-8 text-white fill-current" /> :
                            block.content.platform === 'WHATSAPP' ? <MessageCircle className="w-8 h-8 text-white fill-current" /> :
                              block.content.platform === 'SLACK' ? <Hash className="w-8 h-8 text-white" /> :
                                <Send className="w-8 h-8 text-white fill-current ml-[-4px] mt-[2px]" />}
                        </div>
                        <h3 className="font-bold text-xl mb-1">{block.content.communityName || 'Community Name'}</h3>
                        {block.content.memberCount && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-full text-xs font-semibold mb-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            {block.content.memberCount} Members
                          </div>
                        )}
                        {block.content.pitch && (
                          <p className="text-sm text-white/90 mb-6 max-w-sm">{block.content.pitch}</p>
                        )}
                        <button className="w-full sm:w-auto sm:min-w-[200px] px-6 py-3 bg-white text-gray-900 font-bold rounded-xl shadow-md cursor-default pointer-events-none">
                          {block.content.buttonText || 'Join Now'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MONETIZATION (PREVIEW) */}
                  {block.type === 'MONETIZATION' && (
                    <div className="my-4 flex flex-col relative overflow-hidden" style={getBlockContainerStyle(block.content.backgroundColor, block.content.strokeColor, block.content.cornerRadius, block.content.shadow)}>
                      <div className="p-5 flex flex-col justify-center flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="bg-gray-100/80 text-gray-600 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-gray-200 backdrop-blur-sm">
                            {block.content.monetizationType === 'DIGITAL_FILE' ? (
                              <><FileText className="w-3 h-3" /> Digital Download</>
                            ) : block.content.monetizationType === 'SERVICE_LIVE' ? (
                              <><Calendar className="w-3 h-3" /> Live Session</>
                            ) : (
                              <><Mail className="w-3 h-3" /> Service</>
                            )}
                          </div>
                          <div className="text-xl font-black text-gray-900 tracking-tight ml-2">
                            {block.content.price ? `₹${block.content.price}` : 'Free'}
                          </div>
                        </div>

                        <h3 className="font-bold text-gray-900 text-lg mb-1.5 leading-tight">
                          {block.content.title || 'Monetization Block'}
                        </h3>
                        {block.content.description && (
                          <p className="text-sm text-gray-500 leading-relaxed mb-4 whitespace-pre-wrap">
                            {block.content.description}
                          </p>
                        )}

                        <div className="mt-2 text-xs py-2 px-3 bg-blue-50/80 text-blue-700 border border-blue-100 rounded-lg flex items-center gap-2 mb-4 font-medium backdrop-blur-sm">
                          {block.content.monetizationType === 'DIGITAL_FILE' ? (
                            <><Download className="w-4 h-4 shrink-0" /> Instant download after payment</>
                          ) : block.content.monetizationType === 'SERVICE_LIVE' ? (
                            <><Calendar className="w-4 h-4 shrink-0" /> Book slot after payment</>
                          ) : (
                            <><Send className="w-4 h-4 shrink-0" /> Provide details after payment</>
                          )}
                        </div>

                        <span className="w-full text-center mt-auto cursor-pointer block pointer-events-none opacity-90 transition-opacity" style={getButtonStyle()}>
                          <div className="flex items-center justify-center gap-2">
                            {block.content.monetizationType === 'DIGITAL_FILE' ? (
                              <><Download className="w-4 h-4" /> Get It Now</>
                            ) : block.content.monetizationType === 'SERVICE_LIVE' ? (
                              <><Calendar className="w-4 h-4" /> Book Call</>
                            ) : (
                              <><Send className="w-4 h-4" /> Request Service</>
                            )}
                          </div>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* DIGITAL PRODUCT (PREVIEW) */}
                  {block.type === 'DIGITAL_PRODUCT' && (
                    <div className="my-4 flex flex-col sm:flex-row relative" style={getBlockContainerStyle()}>
                      <div className="w-full sm:w-2/5 aspect-video sm:aspect-square bg-gray-100 flex-shrink-0 relative">
                        {block.content.coverImageUrl ? (
                          <img src={block.content.coverImageUrl} alt={block.content.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Digital Download
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 flex flex-col justify-center flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight line-clamp-2">
                          {block.content.title || 'Digital Product Title'}
                        </h3>
                        {block.content.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                            {block.content.description}
                          </p>
                        )}

                        <div className="mt-auto pt-2 flex items-center justify-between">
                          <div className="text-xl font-black text-gray-900">
                            {block.content.price ? `₹${block.content.price}` : 'Free'}
                          </div>
                          <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                            {block.content.buttonText || 'Buy Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NATIVE BOOKING (PREVIEW) */}
                  {block.type === 'NATIVE_BOOKING' && (
                    <div className="my-4 relative" style={getBlockContainerStyle()}>
                      {block.content.title && (
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <h3 className="font-bold text-gray-900 text-sm">{block.content.title}</h3>
                        </div>
                      )}

                      <div className="w-full h-[400px] bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                          <Layout className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {block.content.provider === 'CALENDLY' ? 'Calendly' : block.content.provider === 'CAL_COM' ? 'Cal.com' : block.content.provider === 'TIDYCAL' ? 'Tidycal' : 'Booking'} Embed
                        </h4>
                        <p className="text-xs text-gray-500 max-w-xs break-all">
                          {block.content.bookingUrl || 'No URL configured. Add a link in the editor to see your calendar here.'}
                        </p>
                        <div className="mt-4 px-3 py-1.5 bg-gray-200 text-gray-600 rounded text-[10px] font-medium tracking-wider uppercase">
                          Interactive in public view
                        </div>
                      </div>
                    </div>
                  )}

                  {/* REVIEW CAROUSEL (PREVIEW) */}
                  {block.type === 'REVIEW_CAROUSEL' && (
                    <div className="my-3">
                      {(!block.content.reviews || block.content.reviews.length === 0) ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center text-sm text-gray-400">
                          Add verified reviews to see preview
                        </div>
                      ) : (
                        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide snap-x px-1">
                          {block.content.reviews.map((review: any, idx: number) => (
                            <div key={review.id || idx} className="p-4 flex flex-col shrink-0 snap-center w-[260px]" style={getBlockContainerStyle()}>

                              <div className="flex items-start gap-3 mb-3">
                                {review.avatarUrl ? (
                                  <div className="relative">
                                    <img src={review.avatarUrl} alt={review.authorName} className="w-10 h-10 rounded-full object-cover" />
                                    {review.platformIcon !== 'custom' && (
                                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
                                        {review.platformIcon === 'google' && <Globe className="w-3 h-3 text-blue-500" />}
                                        {review.platformIcon === 'whatsapp' && <MessageCircle className="w-3 h-3 text-green-500 fill-current" />}
                                        {review.platformIcon === 'instagram' && <Instagram className="w-3 h-3 text-pink-500" />}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {(review.authorName || 'A').charAt(0).toUpperCase()}
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 text-sm truncate">{review.authorName || 'Happy Customer'}</h4>
                                  <div className="flex items-center gap-2">
                                    {review.authorRole && <span className="text-[10px] text-gray-500 truncate">{review.authorRole}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-0.5 mb-2">
                                {[...Array(review.rating || 5)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                ))}
                              </div>

                              {review.text && (
                                <p className="text-gray-600 text-sm italic leading-relaxed line-clamp-4">
                                  "{review.text}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STORY HIGHLIGHT (PREVIEW) */}
                  {block.type === 'STORY_HIGHLIGHT' && (
                    <div className="my-2 py-4" style={getBlockContainerStyle()}>

                      {(!block.content.stories || block.content.stories.length === 0) ? (
                        <div className="px-4 text-center text-sm text-gray-400">Add stories to see preview</div>
                      ) : (
                        <div className="flex overflow-x-auto gap-4 px-4 pb-2 scrollbar-hide snap-x">
                          {block.content.stories.map((story: any, idx: number) => (
                            <div key={story.id || idx} className="flex flex-col items-center gap-2 shrink-0 snap-start w-[72px]">
                              <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex-shrink-0">
                                <div className="w-full h-full rounded-full border-2 border-white bg-white overflow-hidden flex items-center justify-center">
                                  {story.coverImageUrl ? (
                                    <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <Video className="w-6 h-6 text-gray-300" />
                                  )}
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold text-gray-900 truncate w-full text-center leading-tight">
                                {story.title || `Story ${idx + 1}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
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
