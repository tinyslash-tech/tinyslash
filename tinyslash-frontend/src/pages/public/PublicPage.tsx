import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pageService } from '../../services/pageService';
import { Page, PageBlock } from '../../types/page';
import {
  Loader2, Share2, Layout, Link2,
  Instagram, Twitter, Linkedin, Youtube, Facebook, Github, Globe
} from 'lucide-react';
import { PageBranding } from '../../components/page-builder/PageBranding';
import { Helmet } from 'react-helmet-async';

const PublicPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['public-page', slug],
    queryFn: () => pageService.getBySlug(slug!), // We need to add getBySlug to service
    enabled: !!slug,
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-gray-900 animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The page you are looking for does not exist or has been removed.</p>
        <a href="/" className="px-4 py-2 bg-black text-white rounded-lg font-medium text-sm">
          Create your own page
        </a>
      </div>
    );
  }

  // Theme Helpers
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
    };
    return base;
  };

  // Content Container Style
  const getContentStyle = () => ({
    maxWidth: `${theme.pageMaxWidth || 680}px`,
    width: '100%',
    // Center horizontally in container
    margin: '0 auto',
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

  return (
    <>
      <Helmet>
        <title>{page.metaTitle || page.title || 'TinySlash Page'}</title>
        <meta name="description" content={page.metaDescription || page.bio || ''} />
      </Helmet>

      <div
        className="min-h-screen w-full flex flex-col items-center transition-colors duration-500"
        style={{
          ...getBackgroundStyle(),
          color: theme.textColor,
          fontFamily: theme.font
        }}
      >
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

        <div className={`w-full px-6 flex flex-col items-center min-h-[calc(100vh-40px)] ${theme.bannerType && theme.bannerType !== 'NONE' ? '-mt-12' : 'py-16'}`}>

          {/* Profile Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            {page.avatarUrl && (
              <img
                src={page.avatarUrl}
                alt={page.title}
                className={`object-cover mb-6 shadow-xl ring-4 ${theme.bannerType && theme.bannerType !== 'NONE' ? 'ring-white bg-white relative z-10' : 'ring-white/20'}`}
                style={getProfileImageStyle()}
              />
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight drop-shadow-sm">{page.title}</h1>
            {page.bio && (
              <p className="text-base sm:text-lg opacity-90 max-w-md leading-relaxed font-medium">
                {page.bio}
              </p>
            )}
          </div>

          {/* Blocks */}
          <div style={getContentStyle()}>
            {(() => {
              const visibleBlocks = page.blocks.filter((b: PageBlock) => b.visible).sort((a: PageBlock, b: PageBlock) => a.order - b.order);
              const groupedBlocks: any[] = [];
              let currentSocialGroup: any = null;

              visibleBlocks.forEach(block => {
                groupedBlocks.push(block);
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

              const getSocialSizeClass = () => {
                // Return exact dimensions if number (new style), else legacy classes
                if (typeof theme.socialIconSize === 'number') return 'custom-size';
                return theme.socialIconSize || 'MD';
              };

              const socialSizeValue = typeof theme.socialIconSize === 'number' ? theme.socialIconSize : 48; // fallback px
              const socialSizeMap: any = {
                SM: 'p-1.5 sm:p-2',
                MD: 'p-3 sm:p-4',
                LG: 'p-4 sm:p-5'
              };
              const iconSizeMap: any = {
                SM: 'w-4 h-4 sm:w-5 sm:h-5',
                MD: 'w-6 h-6 sm:w-7 sm:h-7',
                LG: 'w-8 h-8 sm:w-10 sm:h-10'
              }
              const currentSize = getSocialSizeClass();

              return groupedBlocks.map(block => {

                // SOCIAL BLOCK
                if (block.type === 'SOCIAL') {
                  // Check for links array or fallback to single url
                  const links = block.content.links || [];
                  const displayLinks = links.length > 0 ? links : (block.content.url ? [{ platform: block.content.platform, url: block.content.url }] : []);

                  return (
                    <div key={block.id} className="w-full animate-fade-in-up flex flex-wrap justify-center gap-4 sm:gap-6 py-4">
                      {displayLinks.map((link: any, idx: number) => {
                        const { icon: Icon, color } = getSocialPlatform(link.url);

                        const isMonochrome = theme.socialStyle === 'MONOCHROME';
                        const isOutline = theme.socialStyle === 'OUTLINE';

                        const iconColor = isMonochrome ? (theme.socialIconColor || theme.textColor) : isOutline ? color : '#ffffff';
                        const backgroundColor = isOutline ? 'transparent' : isMonochrome ? 'transparent' : color;
                        const border = isOutline ? `2px solid ${color}` : isMonochrome ? `2px solid ${theme.socialIconColor || theme.textColor}` : 'none';

                        return (
                          <a
                            key={`${block.id}-${idx}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center justify-center rounded-full shadow-sm hover:shadow-md hover:scale-110 transition-all ${currentSize !== 'custom-size' ? socialSizeMap[currentSize] : ''}`}
                            style={currentSize === 'custom-size' ? {
                              width: `${socialSizeValue}px`,
                              height: `${socialSizeValue}px`,
                              padding: `${socialSizeValue * 0.25}px`, // 25% padding
                              color: iconColor,
                              backgroundColor: backgroundColor,
                              border: border
                            } : {
                              color: iconColor,
                              backgroundColor: backgroundColor,
                              border: border
                            }}
                          >
                            <Icon className={currentSize !== 'custom-size' ? iconSizeMap[currentSize] : 'w-full h-full'} />
                          </a>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div key={block.id} className="w-full animate-fade-in-up">

                    {/* LINK */}
                    {block.type === 'LINK' && (
                      <a
                        href={block.content.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`
                                block w-full text-center transition-all hover:scale-[1.02] active:scale-[0.98]
                                shadow-md hover:shadow-xl backdrop-blur-sm
                                ${theme.fontWeight === 'BOLD' ? 'font-bold' : theme.fontWeight === 'SEMIBOLD' ? 'font-semibold' : 'font-semibold'}
                            `}
                        style={{
                          ...getButtonStyle(),
                          fontSize: baseFontSize ? `${baseFontSize}px` : undefined
                        }}
                      >
                        {block.content.title}
                      </a>
                    )}

                    {/* HEADER */}
                    {block.type === 'HEADER' && (
                      <h2 className={`text-center mt-6 mb-2 opacity-95
                          ${theme.fontWeight === 'BOLD' ? 'font-extrabold' : theme.fontWeight === 'SEMIBOLD' ? 'font-bold' : 'font-bold'}
                      `}
                        style={{ fontSize: `${baseFontSize * 1.5}px` }}
                      >{block.content.text}</h2>
                    )}

                    {/* TEXT */}
                    {block.type === 'TEXT' && (
                      <p className="text-center opacity-85 leading-relaxed px-4"
                        style={{ fontSize: `${baseFontSize}px` }}
                      >{block.content.text}</p>
                    )}

                    {/* IMAGE */}
                    {block.type === 'IMAGE' && block.content.url && (
                      <div className="rounded-2xl overflow-hidden shadow-lg mx-auto max-w-full">
                        <img src={block.content.url} alt={block.content.alt || ''} className="w-full h-auto" />
                      </div>
                    )}

                    {/* FORM */}
                    {block.type === 'FORM' && (
                      <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-900 mx-auto w-full max-w-sm">
                        <h3 className="text-lg font-bold mb-1">{block.content.title}</h3>
                        <p className="text-xs text-gray-500 mb-4">Subscribe to our newsletter</p>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                          if (email) {
                            pageService.submitLead(page.id, page.userId, { email, type: 'FORM' })
                              .then(() => {
                                alert('Thanks for subscribing!'); // Replace with better toast
                                form.reset();
                              })
                              .catch(() => alert('Something went wrong.'));
                          }
                        }} className="flex flex-col gap-3">
                          <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder:text-gray-400"
                          />
                          <button
                            type="submit"
                            className="w-full px-4 py-3 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-900 shadow-sm transition-all hover:scale-[1.01]"
                          >
                            {block.content.buttonText || 'Join'}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* EMAIL */}
                    {/* EMAIL */}
                    {block.type === 'EMAIL' && (
                      <div className="max-w-md mx-auto">
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                          if (email) {
                            pageService.submitLead(page.id, page.userId, { email, type: 'EMAIL' })
                              .then(() => {
                                alert('Thanks for signing up!');
                                form.reset();
                              })
                              .catch(() => alert('Something went wrong.'));
                          }
                        }} className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-md shadow-sm max-w-md mx-auto">
                          <input
                            name="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-sm"
                          />
                          <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-900 transition-colors"
                          >
                            {block.content.buttonText || 'Sign Up'}
                          </button>
                        </form>
                      </div>
                    )}

                  </div>
                );
              });
            })()}
          </div>

        </div>

        {/* Footer Branding */}
        {theme.showBranding && <PageBranding />}
      </div >
    </>
  );
};

export default PublicPage;
