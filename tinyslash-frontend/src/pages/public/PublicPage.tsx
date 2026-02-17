import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pageService } from '../../services/pageService';
import { Page, PageBlock } from '../../types/page';
import {
  Share2, Layout, Link2, BadgeCheck,
  Instagram, Twitter, Linkedin, Youtube, Facebook, Github, Globe, Video
} from 'lucide-react';
import { SocialLinks } from '../../components/page-builder/blocks/SocialLinks';
import { PageBranding } from '../../components/page-builder/PageBranding';
import { Helmet } from 'react-helmet-async';
import { ThreeDotsLoader } from '../../components/ui/ThreeDotsLoader';
import toast from 'react-hot-toast';

// Deep Link Utility: converts web URLs to app deep links for mobile
const getDeepLink = (url: string): string => {
  if (!url) return url;
  try {
    const u = new URL(url);
    const host = u.hostname.replace('www.', '').replace('m.', '');

    // Instagram
    if (host === 'instagram.com') {
      const path = u.pathname.replace(/^\//, '').replace(/\/$/, '');
      if (path) return `instagram://user?username=${path}`;
    }
    // WhatsApp channel / group / chat
    if (host === 'whatsapp.com' || host === 'chat.whatsapp.com' || host === 'wa.me') {
      return `whatsapp://send?text=&phone=` + u.pathname.replace('/', '') || url;
    }
    // YouTube
    if (host === 'youtube.com' || host === 'youtu.be') {
      const videoId = u.searchParams.get('v') || u.pathname.replace('/', '');
      if (videoId) return `vnd.youtube://${videoId}`;
    }
    // Twitter / X
    if (host === 'twitter.com' || host === 'x.com') {
      return `twitter://user?screen_name=${u.pathname.replace('/', '')}`;
    }
    // LinkedIn
    if (host === 'linkedin.com') {
      return `linkedin://in/${u.pathname.split('/in/')[1] || ''}`;
    }
    // Facebook
    if (host === 'facebook.com' || host === 'fb.com') {
      return `fb://profile/${u.pathname.replace('/', '')}`;
    }
    // Telegram
    if (host === 't.me' || host === 'telegram.me') {
      return `tg://resolve?domain=${u.pathname.replace('/', '')}`;
    }
    // Amazon
    if (host.includes('amazon.')) {
      return `com.amazon.mobile.shopping://www.amazon.com${u.pathname}`;
    }
    // Flipkart
    if (host.includes('flipkart.com')) {
      return `flipkart://fk${u.pathname}`;
    }
  } catch {
    // Invalid URL, return as-is
  }
  return url;
};

const PublicPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['public-page', slug],
    queryFn: () => pageService.getBySlug(slug!), // We need to add getBySlug to service
    enabled: !!slug,
    retry: false
  });

  useEffect(() => {
    if (page?.id) {
      pageService.recordView(page.id);
    }
  }, [page?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <ThreeDotsLoader size="lg" />
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
            <div className="flex items-center gap-2 mb-3 justify-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">{page.title}</h1>
              {page.verified && (
                <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500 text-white" />
              )}
            </div>
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

              return groupedBlocks.map(block => {

                // SOCIAL BLOCK
                if (block.type === 'SOCIAL') {
                  // Check for links array or fallback to single url
                  const links = block.content.links || [];
                  const displayLinks = links.length > 0 ? links : (block.content.url ? [{ platform: block.content.platform, url: block.content.url }] : []);

                  return <SocialLinks key={block.id} links={displayLinks} theme={theme} />;
                }

                return (
                  <div key={block.id} className="w-full animate-fade-in-up">

                    {/* LINK */}
                    {block.type === 'LINK' && (
                      <a
                        href={getDeepLink(block.content.url)}
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
                      <>
                        <h2 className={`text-center mt-6 mb-2 opacity-95
                          ${theme.fontWeight === 'BOLD' ? 'font-extrabold' : theme.fontWeight === 'SEMIBOLD' ? 'font-bold' : 'font-bold'}
                      `}
                          style={{ fontSize: `${baseFontSize * 1.5}px` }}
                        >{block.content.text}</h2>
                        {block.content.subTitle && (
                          <p className="text-center opacity-75 mb-4 px-4 overflow-hidden text-ellipsis"
                            style={{ fontSize: `${baseFontSize * 0.9}px` }}
                          >{block.content.subTitle}</p>
                        )}
                      </>
                    )}

                    {/* TEXT */}
                    {
                      block.type === 'TEXT' && (
                        <p className="text-center opacity-85 leading-relaxed px-4"
                          style={{ fontSize: `${baseFontSize}px` }}
                        >{block.content.text}</p>
                      )
                    }

                    {/* IMAGE */}
                    {
                      block.type === 'IMAGE' && block.content.url && (
                        <div className="rounded-2xl overflow-hidden shadow-lg mx-auto max-w-full">
                          <img src={block.content.url} alt={block.content.alt || ''} className="w-full h-auto" />
                        </div>
                      )
                    }

                    {/* FORM */}
                    {
                      block.type === 'FORM' && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-900 mx-auto w-full max-w-sm">
                          <h3 className="text-lg font-bold mb-1">{block.content.title}</h3>
                          <p className="text-xs text-gray-500 mb-4">Subscribe to our newsletter</p>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                            const name = block.content.collectName ? (form.elements.namedItem('name') as HTMLInputElement)?.value : undefined;
                            if (email) {
                              pageService.submitLead(page.id, page.userId, { email, name, type: 'FORM' })
                                .then(() => {
                                  toast.success('Thanks for subscribing!');
                                  form.reset();
                                })
                                .catch(() => toast.error('Something went wrong. Please try again.'));
                            }
                          }} className="flex flex-col gap-3">
                            {block.content.collectName && (
                              <input
                                name="name"
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder:text-gray-400"
                              />
                            )}
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
                      )
                    }

                    {/* EMAIL */}
                    {
                      block.type === 'EMAIL' && (
                        <div className="max-w-md mx-auto">
                          {block.content.title && (
                            <h3 className="text-lg font-bold mb-3 text-center">{block.content.title}</h3>
                          )}
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                            if (email) {
                              pageService.submitLead(page.id, page.userId, { email, type: 'EMAIL' })
                                .then(() => {
                                  toast.success('Thanks for signing up!');
                                  form.reset();
                                })
                                .catch(() => toast.error('Something went wrong. Please try again.'));
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
                      )
                    }
                    {/* AFFILIATE */}
                    {
                      block.type === 'AFFILIATE' && (
                        (() => {
                          const cardStyle: React.CSSProperties = {
                            borderRadius: block.content.cornerRadius === 'sharp' ? '0px' : block.content.cornerRadius === 'rounded' ? '12px' : '16px',
                            boxShadow: block.content.shadow === 'none' ? 'none' : block.content.shadow === 'strong' ? '0 10px 25px -5px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
                            border: block.content.strokeColor ? `2px solid ${block.content.strokeColor}` : 'none',
                          };
                          const inner = (
                            <>
                              {block.content.imageUrl && (
                                <img src={block.content.imageUrl} alt={block.content.title} className="w-full h-48 object-cover" />
                              )}
                              <div className="p-4">
                                <h3 className="text-base font-bold text-gray-900 mb-1">{block.content.title}</h3>
                                {block.content.price && (
                                  <p className="text-lg font-extrabold text-green-600 mb-3">{block.content.price}</p>
                                )}
                                <span className="block w-full text-center py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-900 transition-colors">
                                  {block.content.buttonText || 'Buy Now'}
                                </span>
                              </div>
                            </>
                          );
                          return block.content.url ? (
                            <a href={getDeepLink(block.content.url)} target="_blank" rel="noreferrer"
                              className="block bg-white overflow-hidden hover:shadow-xl transition-all hover:scale-[1.01] mx-auto w-full max-w-sm"
                              style={cardStyle}
                            >{inner}</a>
                          ) : (
                            <div className="bg-white overflow-hidden mx-auto w-full max-w-sm" style={cardStyle}>{inner}</div>
                          );
                        })()
                      )
                    }

                    {/* CARD */}
                    {
                      block.type === 'CARD' && (
                        <div
                          className="bg-white overflow-hidden mx-auto w-full max-w-sm"
                          style={{
                            borderRadius: block.content.cornerRadius === 'sharp' ? '0px' : block.content.cornerRadius === 'rounded' ? '12px' : '16px',
                            boxShadow: block.content.shadow === 'none' ? 'none' : block.content.shadow === 'strong' ? '0 10px 25px -5px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
                            border: block.content.strokeColor ? `2px solid ${block.content.strokeColor}` : 'none',
                          }}
                        >
                          {block.content.imageUrl && (
                            <img src={block.content.imageUrl} alt={block.content.title} className="w-full h-48 object-cover" />
                          )}
                          <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{block.content.title}</h3>
                            {block.content.description && (
                              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{block.content.description}</p>
                            )}
                            {block.content.url ? (
                              <a
                                href={getDeepLink(block.content.url)}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full text-center py-3 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-900 shadow-sm transition-all hover:scale-[1.01]"
                              >
                                {block.content.buttonText || 'Learn More'}
                              </a>
                            ) : (
                              <span className="block w-full text-center py-3 bg-black text-white text-sm font-bold rounded-lg">
                                {block.content.buttonText || 'Learn More'}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    }

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
