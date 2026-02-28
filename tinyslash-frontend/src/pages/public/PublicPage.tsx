import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pageService } from '../../services/pageService';
import { Page, PageBlock } from '../../types/page';
import {
  Share2, Layout, Link2, BadgeCheck,
  Instagram, Twitter, Linkedin, Youtube, Facebook, Github, Globe, Video, MessageCircle, ShoppingCart, Image as ImageIcon, QrCode, Star, FileText, Send, MessageSquare, Hash, MapPin, Clock, Calendar, Download, Mail
} from 'lucide-react';
import { SocialLinks } from '../../components/page-builder/blocks/SocialLinks';
import { PageBranding } from '../../components/page-builder/PageBranding';
import { Helmet } from 'react-helmet-async';
import { ThreeDotsLoader } from '../../components/ui/ThreeDotsLoader';
import toast from 'react-hot-toast';
import * as api from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Type for pending interaction batch
interface PendingInteraction {
  type: string;
  meta: Record<string, any>;
}

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

  // Analytics State
  const [visitorId, setVisitorId] = useState<string>('');
  const [sessionId] = useState<string>(() => uuidv4());

  // Refs for tracking
  const pendingInteractions = React.useRef<PendingInteraction[]>([]);
  const scrollDepthsHit = React.useRef<Set<number>>(new Set());

  // Initialize Visitor ID
  useEffect(() => {
    let vid: string | null = localStorage.getItem('ts_anonymous_id');
    if (!vid) {
      vid = uuidv4();
      localStorage.setItem('ts_anonymous_id', vid);
      localStorage.setItem('ts_first_seen', new Date().toISOString());
    }
    localStorage.setItem('ts_last_seen', new Date().toISOString());
    setVisitorId(vid as string);
  }, []);

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['public-page', slug],
    queryFn: () => pageService.getBySlug(slug!), // We need to add getBySlug to service
    enabled: !!slug,
    retry: false
  });

  useEffect(() => {
    if (page?.id && visitorId) {

      // Parse UTMs from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');

      pageService.recordView(page.id, {
        visitorId,
        sessionId,
        utmSource,
        utmMedium,
        utmCampaign
      });

      // Record initial PAGE_VIEW interaction
      pendingInteractions.current.push({
        type: 'PAGE_VIEW',
        meta: {}
      });
    }
  }, [page?.id, visitorId, sessionId]);

  // Scroll Tracking
  useEffect(() => {
    if (!page?.id) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Throttle scroll events
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        // Calculate Scroll Depth %
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const documentHeight = document.documentElement.scrollHeight;

        let percentage = 0;
        if (documentHeight > windowHeight) {
          percentage = Math.min(100, Math.round((scrollTop / (documentHeight - windowHeight)) * 100));
        } else {
          percentage = 100; // Page is shorter than screen
        }

        const milestones = [25, 50, 75, 100];

        milestones.forEach(m => {
          if (percentage >= m && !scrollDepthsHit.current.has(m)) {
            scrollDepthsHit.current.add(m);
            pendingInteractions.current.push({
              type: 'SCROLL',
              meta: { depth: m }
            });
          }
        });
      }, 500); // 500ms debounce
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup and send batch on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);

      if (pendingInteractions.current.length > 0) {
        pageService.recordInteractionsBatch(page.id, {
          visitorId,
          sessionId,
          interactions: pendingInteractions.current
        });
        // Clear array
        pendingInteractions.current = [];
      }
    };
  }, [page?.id, visitorId, sessionId]);

  const handleWhatsAppClick = async (pageId: string) => {
    const linkId = sessionStorage.getItem('ts_last_link');
    try {
      const res = await fetch(`/api/public/pages/${pageId}/wa-init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId: linkId || null, visitorId })
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.removeItem('ts_last_link');
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        }
      }
    } catch (error) {
      console.error('Failed WA tap', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <ThreeDotsLoader size="sm" />
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
      fontWeight: theme.fontWeight === 'SEMIBOLD' ? 600 : theme.fontWeight === 'BOLD' ? 700 : 400,
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

  // Unified Blueprint Block Container Style
  const getBlockContainerStyle = (contentOverrideBg?: string, contentOverrideStroke?: string, contentOverrideRadius?: string, contentOverrideShadow?: string) => {
    // 1. Background
    const bgColor = contentOverrideBg || theme.blockBackgroundColor || 'rgba(255, 255, 255, 0.5)';

    // 2. Border
    const strokeColor = contentOverrideStroke || theme.blockBorderColor || 'transparent';

    // 3. Radius
    let radius = '16px';
    if (contentOverrideRadius === 'sharp' || theme.blockCornerRadius === 'SHARP') radius = '0px';
    else if (contentOverrideRadius === 'rounded' || theme.blockCornerRadius === 'ROUNDED') radius = '12px';
    else if (theme.blockCornerRadius === 'PILL') radius = '9999px';
    else if (theme.blockCornerRadius === 'XL') radius = '24px';

    // 4. Shadow
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

        {/* --- INTEGRATIONS --- */}
        {page.googleAnalyticsId && (
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${page.googleAnalyticsId}`}></script>
        )}
        {page.googleAnalyticsId && (
          <script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${page.googleAnalyticsId}');
            `}
          </script>
        )}

        {page.fbPixelId && (
          <script id="facebook-pixel">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${page.fbPixelId}');
              fbq('track', 'PageView');
            `}
          </script>
        )}

        {page.customScripts && (
          <script id="custom-scripts" type="text/javascript">
            {page.customScripts.replace(/<script[^>]*>|<\/script>/gi, '')}
          </script>
        )}
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

        <div
          className={`w-full flex flex-col items-center min-h-[calc(100vh-40px)] ${theme.bannerType && theme.bannerType !== 'NONE' ? '-mt-12' : ''}`}
          style={{
            paddingTop: theme.bannerType && theme.bannerType !== 'NONE' ? undefined : `${theme.marginTop ?? 64}px`,
            paddingLeft: `${theme.marginX ?? 24}px`,
            paddingRight: `${theme.marginX ?? 24}px`
          }}
        >

          {/* Profile Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            {page.avatarUrl && (
              <img
                src={page.avatarUrl}
                alt={page.title}
                className="object-cover mb-6 shadow-xl ring-4 ring-white bg-white relative z-10"
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
                        onClick={() => {
                          sessionStorage.setItem('ts_last_link', block.id);
                          pendingInteractions.current.push({
                            type: 'CLICK',
                            meta: { linkUrl: block.content.url, title: block.content.title }
                          });
                        }}
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
                        <h2 className={`text-center mt-6 opacity-95
                          ${theme.fontWeight === 'BOLD' ? 'font-extrabold' : theme.fontWeight === 'SEMIBOLD' ? 'font-bold' : 'font-bold'}
                      `}
                          style={{
                            fontSize: `${baseFontSize * 1.5}px`,
                            marginBottom: block.content.subTitle ? `${block.content.spacing ?? 8}px` : '0px'
                          }}
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
                        <p className={`opacity-85 leading-relaxed px-4 whitespace-pre-wrap
                            ${block.content.align === 'left' ? 'text-left' : block.content.align === 'right' ? 'text-right' : block.content.align === 'justify' ? 'text-justify' : 'text-center'}
                            ${block.content.isBold ? 'font-bold' : ''}
                            ${block.content.isItalic ? 'italic' : ''}
                            ${block.content.isUnderline ? 'underline' : ''}
                          `}
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
                        <div className="p-6 text-gray-900 mx-auto w-full max-w-sm" style={getBlockContainerStyle()}>
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
                          }} className="flex gap-2 p-1.5 max-w-md mx-auto" style={{ ...getBlockContainerStyle(), borderRadius: '12px' }}>
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
                        <div
                          className="w-full mb-2 mt-2 mx-auto max-w-sm"
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
                                    href={getDeepLink(link.url)}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => {
                                      sessionStorage.setItem('ts_last_link', block.id);
                                      pendingInteractions.current.push({
                                        type: 'CLICK',
                                        meta: { linkUrl: link.url, title: link.title }
                                      });
                                    }}
                                    className="flex items-center justify-between p-3 rounded-lg border transition-all hover:opacity-80 hover:shadow-md hover:scale-[1.02]"
                                    style={{
                                      borderColor: block.content.strokeColor || '#e5e7eb',
                                      backgroundColor: 'rgba(255,255,255,0.8)'
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
                      )
                    }

                    {/* CARD */}
                    {
                      block.type === 'CARD' && (
                        <div
                          className="mx-auto w-full max-w-sm"
                          style={getBlockContainerStyle(block.content.backgroundColor, block.content.strokeColor, block.content.cornerRadius, block.content.shadow)}
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
                                onClick={() => sessionStorage.setItem('ts_last_link', block.id)}
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

                    {/* COUNTDOWN */}
                    {
                      block.type === 'COUNTDOWN' && (
                        <CountdownBlock block={block} getBlockContainerStyle={getBlockContainerStyle} />
                      )
                    }

                    {/* VOICE */}
                    {
                      block.type === 'VOICE' && (
                        <VoiceBlock block={block} getBlockContainerStyle={getBlockContainerStyle} />
                      )
                    }

                    {/* MAPS_HUB */}
                    {block.type === 'MAPS_HUB' && <MapsHubBlock block={block} getBlockContainerStyle={getBlockContainerStyle} />}

                    {/* COMMUNITY_JOIN */}
                    {block.type === 'COMMUNITY_JOIN' && <CommunityJoinBlock block={block} getBlockContainerStyle={getBlockContainerStyle} />}

                    {/* MONETIZATION */}
                    {block.type === 'MONETIZATION' && <MonetizationBlock block={{ ...block, pageId: page.id, creatorId: page.userId }} getBlockContainerStyle={getBlockContainerStyle} getButtonStyle={getButtonStyle} />}

                    {/* DIGITAL_PRODUCT */}
                    {block.type === 'DIGITAL_PRODUCT' && <DigitalProductBlock block={block} getBlockContainerStyle={getBlockContainerStyle} />}

                    {/* NATIVE_BOOKING */}
                    {block.type === 'NATIVE_BOOKING' && <NativeBookingBlock block={block} getBlockContainerStyle={getBlockContainerStyle} />}

                    {/* REVIEW_CAROUSEL */}
                    {block.type === 'REVIEW_CAROUSEL' && <ReviewCarouselBlock block={block} getBlockContainerStyle={getBlockContainerStyle} />}

                    {/* STORY_HIGHLIGHT */}
                    {block.type === 'STORY_HIGHLIGHT' && <StoryHighlightBlock block={block} getBlockContainerStyle={getBlockContainerStyle} />}

                    {/* WA_CATALOG */}
                    {block.type === 'WA_CATALOG' && <WaCatalogBlock block={block} getBlockContainerStyle={getBlockContainerStyle} />}

                    {/* UPI_PAY */}
                    {block.type === 'UPI_PAY' && <UpiPayBlock block={block} getBlockContainerStyle={getBlockContainerStyle} />}

                  </div>
                );
              });
            })()}
          </div>

        </div>

        {/* Full-width WhatsApp Button Output */}
        {(page.waDisplayType === 'BUTTON' || page.waDisplayType === 'BOTH') && page.waNumber && (
          <div className="w-full max-w-[680px] mx-auto mt-6 px-4">
            <button
              onClick={() => handleWhatsAppClick(page.id)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-[16px] font-bold rounded-xl hover:bg-[#1EBE5D] shadow-sm transition-all focus:outline-none"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </button>
          </div>
        )}

        {/* Floating WhatsApp Button */}
        {(!page.waDisplayType || page.waDisplayType === 'FLOATING' || page.waDisplayType === 'BOTH') && page.waNumber && (
          <button
            onClick={() => handleWhatsAppClick(page.id)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1EBE5D] hover:scale-105 transition-all"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-8 h-8 fill-current" />
          </button>
        )}

        {/* Footer Branding */}
        {theme.showBranding && <PageBranding />}
      </div >
    </>
  );
};

const CountdownBlock = ({ block, getBlockContainerStyle }: { block: any; getBlockContainerStyle: any }) => {
  const getRemaining = () => Math.max(0, block.content.endDateUTC - Date.now());
  const [timeLeft, setTimeLeft] = React.useState(getRemaining());

  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(getRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const d = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const h = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const m = Math.floor((timeLeft / 1000 / 60) % 60);
  const s = Math.floor((timeLeft / 1000) % 60);

  const isExpired = timeLeft <= 0;

  if (isExpired && block.content.hideAfterExpiry) {
    return null;
  }

  return (
    <div
      className="mx-auto w-full max-w-sm mb-4"
      style={getBlockContainerStyle(block.content.backgroundColor, block.content.strokeColor, block.content.cornerRadius, block.content.shadow)}
    >
      {block.content.imageUrl && (
        <img src={block.content.imageUrl} alt={block.content.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-5 flex flex-col items-center">
        {block.content.title && (
          <h3
            className="text-lg font-bold mb-2 text-center"
            style={{ color: block.content.textColor || '#111827' }}
          >
            {block.content.title}
          </h3>
        )}
        {block.content.description && (
          <p
            className="text-sm mb-4 text-center leading-relaxed"
            style={{ color: block.content.textColor || '#4b5563' }}
          >
            {block.content.description}
          </p>
        )}

        {isExpired ? (
          <div className="bg-red-50 text-red-600 font-bold px-6 py-3 rounded-lg w-full text-center">
            {block.content.endMessage || 'Offer Ended'}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 w-full max-w-[280px]">
            {[{ label: 'Days', val: d }, { label: 'Hours', val: h }, { label: 'Mins', val: m }, { label: 'Secs', val: s }].map(item => (
              <div key={item.label} className="flex flex-col items-center bg-gray-50 rounded-lg py-2 border border-gray-100 shadow-sm">
                <span className="text-xl font-extrabold text-blue-600">{item.val.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const VoiceBlock = ({ block, getBlockContainerStyle }: { block: any; getBlockContainerStyle: any }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnd = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    return () => {
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <div className="p-4 flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity mb-4" style={getBlockContainerStyle()} onClick={togglePlay}>
      <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
        {isPlaying ? (
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        ) : (
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
        )}
      </button>
      <div className="flex-1">
        <div className="h-2 bg-gray-200 rounded-full w-full overflow-hidden relative">
          <div className={`absolute top-0 left-0 h-full bg-blue-500 transition-all ${isPlaying ? 'w-full duration-[30000ms] ease-linear' : 'w-0'}`}></div>
          <svg className="absolute inset-0 w-full h-full text-gray-400 opacity-50 preserve-3d" preserveAspectRatio="none" viewBox="0 0 100 10">
            <path d="M0 5 Q 5 0, 10 5 T 20 5 T 30 5 T 40 5 T 50 5 T 60 5 T 70 5 T 80 5 T 90 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-xs text-gray-500 mt-2 font-semibold tracking-wide uppercase">{block.content.title || 'Tap to hear from me'}</p>
      </div>
      {block.content.audioUrl && (
        <audio ref={audioRef} src={block.content.audioUrl} className="hidden" preload="metadata" />
      )}
    </div>
  );
}

const WaCatalogBlock = ({ block, getBlockContainerStyle }: { block: any; getBlockContainerStyle: any }) => {
  const [cart, setCart] = useState<Record<string, number>>({});

  const items = block.content.items || [];
  if (items.length === 0) return null;

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev };
      if (next === 0) delete newCart[itemId];
      else newCart[itemId] = next;
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((sum, [itemId, qty]) => {
      const item = items.find((i: any) => (i.id || i.name) === itemId);
      return sum + (Number(item?.price || 0) * qty);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const handleCheckout = () => {
    if (getTotalItems() === 0) return;

    let orderDetails = '';
    Object.entries(cart).forEach(([itemId, qty]) => {
      const item = items.find((i: any) => (i.id || i.name) === itemId);
      if (item) {
        orderDetails += `- ${item.name} x${qty} — ₹${Number(item.price || 0) * qty}\n`;
      }
    });

    const total = getCartTotal();

    // As per the specification format
    const messageTemplate = `Hi! I'd like to place an order:

━━━━━━━━━━━━━━━
🛍️ MY ORDER
━━━━━━━━━━━━━━━
${orderDetails}━━━━━━━━━━━━━━━
💰 Total: ₹${total}
━━━━━━━━━━━━━━━

Please confirm availability and 
delivery details. Thank you!`;

    const encodedMessage = encodeURIComponent(messageTemplate);
    const phoneNumber = block.content.phoneNumber?.replace(/\D/g, ''); // strip non-digits

    if (!phoneNumber) {
      toast.error('Store owner has not configured a valid WhatsApp number.');
      return;
    }

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="my-4 relative" style={getBlockContainerStyle()}>
      <div className="bg-[#25D366] text-white p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <h3 className="font-bold">Order via WhatsApp</h3>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {items.map((item: any, idx: number) => {
          const itemId = item.id || item.name;
          const qty = cart[itemId] || 0;
          const isOutOfStock = item.inStock === false;

          return (
            <div key={itemId || idx} className={`p-4 flex gap-4 transition-opacity ${isOutOfStock ? 'opacity-60' : ''}`}>
              {item.imageUrl ? (
                <img src={typeof item.imageUrl === 'object' ? item.imageUrl.url : item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gray-100 shrink-0" />
              ) : (
                <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 shrink-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name || 'Unnamed Product'}</h4>
                <p className="text-[#25D366] font-bold text-sm mt-0.5">₹{item.price || '0'}</p>
              </div>

              <div className="shrink-0 flex items-center">
                {!isOutOfStock ? (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 h-8 px-1">
                    <button
                      onClick={() => updateQuantity(itemId, -1)}
                      className={`w-6 h-full flex items-center justify-center text-gray-500 rounded ${qty > 0 ? 'hover:text-black hover:bg-gray-100' : 'opacity-50 pointer-events-none'}`}
                    >
                      -
                    </button>
                    <span className="text-xs font-semibold w-3 text-center">{qty}</span>
                    <button
                      onClick={() => updateQuantity(itemId, 1)}
                      className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded">OUT OF STOCK</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Checkout Bar inside the block matching Preview */}
      <div className="p-3">
        <button
          onClick={handleCheckout}
          disabled={getTotalItems() === 0}
          className={`w-full py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#1EBE5D] transition-colors ${getTotalItems() === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <MessageCircle className="w-5 h-5" /> Checkout via WhatsApp
        </button>
      </div>
    </div>
  );
};

const UpiPayBlock = ({ block, getBlockContainerStyle }: { block: any; getBlockContainerStyle: any }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!block.content.upiId || !block.content.payeeName) return;

    let uri = `upi://pay?pa=${block.content.upiId}&pn=${encodeURIComponent(block.content.payeeName)}&cu=INR`;
    if (block.content.amountMode === 'FIXED' && block.content.fixedAmount) {
      uri += `&am=${block.content.fixedAmount}`;
    }

    QRCode.toDataURL(uri, { errorCorrectionLevel: 'H', margin: 1, width: 250 })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR:', err));
  }, [block.content]);

  const handleMobilePay = () => {
    let uri = `upi://pay?pa=${block.content.upiId}&pn=${encodeURIComponent(block.content.payeeName || 'Store')}&cu=INR`;
    if (block.content.amountMode === 'FIXED' && block.content.fixedAmount) {
      uri += `&am=${block.content.fixedAmount}`;
    }
    window.location.href = uri;
  };

  return (
    <div className="my-4" style={getBlockContainerStyle()}>
      {/* Desktop View: Scan to Pay */}
      <div className="hidden md:flex flex-col items-center justify-center p-8 text-center border-b border-gray-50">
        <h3 className="font-bold text-gray-900 text-lg mb-2">Scan to Pay via UPI</h3>
        <p className="text-gray-500 text-sm mb-6">Scan using Google Pay, PhonePe, Paytm, etc.</p>

        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-2xl mb-6">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="UPI QR Code" className="w-48 h-48 rounded-xl object-contain" />
          ) : (
            <div className="w-48 h-48 bg-gray-50 rounded-xl flex items-center justify-center">
              <span className="text-sm text-gray-400">Generating QR...</span>
            </div>
          )}
        </div>

        <h4 className="font-bold text-gray-900 text-base mb-1">{block.content.payeeName || 'Store'}</h4>
        <p className="text-xs text-gray-400 mb-4">{block.content.upiId}</p>

        {block.content.amountMode === 'FIXED' && block.content.fixedAmount ? (
          <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
            ₹{block.content.fixedAmount}
          </div>
        ) : (
          <div className="px-4 py-2 border border-gray-200 rounded-lg text-gray-400 text-xs font-semibold tracking-wider bg-gray-50">
            OPEN AMOUNT (TIPS/DONATIONS)
          </div>
        )}
      </div>

      {/* Mobile View: Tap to Pay */}
      <div className="md:hidden flex flex-col p-6 text-center">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-7 h-7" />
        </div>

        <h4 className="font-bold text-gray-900 text-lg mb-1">{block.content.payeeName || 'Store'}</h4>
        <p className="text-sm text-gray-500 mb-6">{block.content.upiId}</p>

        {block.content.amountMode === 'FIXED' && block.content.fixedAmount ? (
          <div className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
            ₹{block.content.fixedAmount}
          </div>
        ) : (
          <div className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-400 text-sm font-semibold tracking-wider bg-gray-50 mb-8 w-max mx-auto">
            OPEN AMOUNT
          </div>
        )}

        <button
          onClick={handleMobilePay}
          className="w-full py-4 bg-gray-900 text-white text-base font-bold rounded-xl hover:bg-black hover:scale-[1.02] shadow-md transition-all flex items-center justify-center gap-2"
        >
          {block.content.buttonText || 'Pay via UPI Apps'}
          <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const StoryHighlightBlock = ({ block, getBlockContainerStyle }: { block: any; getBlockContainerStyle: any }) => {
  if (!block.content.stories || block.content.stories.length === 0) return null;

  return (
    <div className="my-4 py-6" style={getBlockContainerStyle()}>
      <div className="flex overflow-x-auto gap-5 px-6 pb-2 scrollbar-hide snap-x">
        {block.content.stories.map((story: any, idx: number) => (
          <a
            key={story.id || idx}
            href={getDeepLink(story.sourceUrl) || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 shrink-0 snap-start w-[84px] group"
          >
            <div className="w-[84px] h-[84px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex-shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-md">
              <div className="w-full h-full rounded-full border-[3px] border-white bg-white overflow-hidden flex items-center justify-center">
                {story.coverImageUrl ? (
                  <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
                ) : (
                  <Video className="w-8 h-8 text-gray-300" />
                )}
              </div>
            </div>
            <span className="text-xs font-bold text-gray-900 truncate w-full text-center leading-tight tracking-tight">
              {story.title || `Story ${idx + 1}`}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

const ReviewCarouselBlock = ({ block, getBlockContainerStyle }: { block: any; getBlockContainerStyle: any }) => {
  if (!block.content.reviews || block.content.reviews.length === 0) return null;

  return (
    <div className="my-6">
      <div className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide snap-x px-2">
        {block.content.reviews.map((review: any, idx: number) => (
          <div key={review.id || idx} className="p-6 flex flex-col shrink-0 snap-center w-[300px]" style={getBlockContainerStyle()}>

            <div className="flex items-start gap-3 mb-4">
              {review.avatarUrl ? (
                <div className="relative">
                  <img src={review.avatarUrl} alt={review.authorName} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  {review.platformIcon !== 'custom' && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center">
                      {review.platformIcon === 'google' && <Globe className="w-3.5 h-3.5 text-blue-500" />}
                      {review.platformIcon === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5 text-green-500 fill-current" />}
                      {review.platformIcon === 'instagram' && <Instagram className="w-3.5 h-3.5 text-pink-500" />}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shadow-inner">
                  {(review.authorName || 'A').charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0 flex flex-col justify-center h-12">
                <h4 className="font-bold text-gray-900 text-sm truncate">{review.authorName || 'Happy Customer'}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  {review.authorRole && <span className="text-xs text-gray-500 truncate font-medium">{review.authorRole}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {[...Array(review.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>

            {review.text && (
              <p className="text-gray-700 text-sm italic leading-relaxed">
                "{review.text}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const NativeBookingBlock = ({ block, getBlockContainerStyle }: { block: any; getBlockContainerStyle: any }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!block.content.bookingUrl) {
    return null;
  }

  // Handle URL manipulations based on provider
  let embedUrl = block.content.bookingUrl;

  if (block.content.provider === 'CALENDLY') {
    // Append standard Calendly inline embed params
    const sep = embedUrl.includes('?') ? '&' : '?';
    embedUrl = `${embedUrl}${sep}hide_gdpr_banner=1&hide_landing_page_details=1`;
  } else if (block.content.provider === 'CAL_COM') {
    // Cal.com standard params
    const sep = embedUrl.includes('?') ? '&' : '?';
    embedUrl = `${embedUrl}${sep}layout=column_view`;
  }

  return (
    <div className="my-6" style={getBlockContainerStyle()}>
      {block.content.title && (
        <div className="px-6 py-4 border-b border-gray-50 bg-white">
          <h3 className="font-bold text-gray-900 text-lg">{block.content.title}</h3>
        </div>
      )}

      <div className="relative w-full min-h-[500px] sm:min-h-[600px] bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3"></div>
            <p className="text-sm font-medium text-gray-500">Loading Calendar...</p>
          </div>
        )}
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 'none', minHeight: '600px' }}
          className="absolute inset-0 z-20"
          onLoad={() => setIsLoading(false)}
          title={block.content.title || "Booking Calendar"}
        />
      </div>
    </div>
  );
};

const DigitalProductBlock = ({ block, getBlockContainerStyle }: { block: any; getBlockContainerStyle: any }) => {
  if (!block.content.title) return null;

  return (
    <div className="my-6 flex flex-col sm:flex-row relative" style={getBlockContainerStyle()}>
      <div className="w-full sm:w-2/5 aspect-video sm:aspect-square bg-gray-50 flex-shrink-0 relative group">
        {block.content.coverImageUrl ? (
          <img src={block.content.coverImageUrl} alt={block.content.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-gray-300" />
          </div>
        )}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm hover:bg-black/80 transition-colors">
          <FileText className="w-3.5 h-3.5" /> Digital Download
        </div>
      </div>

      <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
        <h3 className="font-bold text-gray-900 text-xl sm:text-2xl mb-2 leading-tight">
          {block.content.title}
        </h3>
        {block.content.description && (
          <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
            {block.content.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {block.content.price ? `₹${block.content.price}` : 'Free'}
          </div>
          <a
            href={block.content.fileUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 break-keep text-center"
            onClick={(e) => {
              if (!block.content.fileUrl) {
                e.preventDefault();
                alert('No file attached to this product.');
              }
            }}
          >
            {block.content.buttonText || 'Buy Now'}
          </a>
        </div>
      </div>
    </div>
  );
};

const CommunityJoinBlock = ({ block, getBlockContainerStyle }: { block: any; getBlockContainerStyle: any }) => {
  return (
    <div className="my-6" style={getBlockContainerStyle()}>
      <div className={`p-8 sm:p-10 flex flex-col items-center text-center text-white ${block.content.platform === 'DISCORD' ? 'bg-[#5865F2]' :
        block.content.platform === 'WHATSAPP' ? 'bg-[#25D366]' :
          block.content.platform === 'SLACK' ? 'bg-[#4A154B]' : 'bg-[#0088cc]' // TELEGRAM target
        }`}>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-5 backdrop-blur-sm shadow-inner">
          {block.content.platform === 'DISCORD' ? <MessageSquare className="w-10 h-10 text-white fill-current" /> :
            block.content.platform === 'WHATSAPP' ? <MessageCircle className="w-10 h-10 text-white fill-current" /> :
              block.content.platform === 'SLACK' ? <Hash className="w-10 h-10 text-white" /> :
                <Send className="w-10 h-10 text-white fill-current ml-[-4px] mt-[2px]" />}
        </div>
        <h3 className="font-bold text-2xl sm:text-3xl mb-2">{block.content.communityName || 'Community Name'}</h3>
        {block.content.memberCount && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/20 rounded-full text-sm font-semibold mb-4 border border-white/10 shadow-sm">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
            {block.content.memberCount} Members
          </div>
        )}
        {block.content.pitch && (
          <p className="text-base text-white/90 mb-8 max-w-md mx-auto leading-relaxed">{block.content.pitch}</p>
        )}
        <a
          href={block.content.inviteUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto sm:min-w-[240px] px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all text-center text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
          onClick={(e) => {
            if (!block.content.inviteUrl) {
              e.preventDefault();
            }
          }}
        >
          {block.content.buttonText || 'Join Now'}
        </a>
      </div>
    </div>
  );
};

const MapsHubBlock = ({ block, getBlockContainerStyle }: { block: any; getBlockContainerStyle: any }) => {
  return (
    <div className="my-6" style={getBlockContainerStyle()}>
      <div className="w-full h-[300px] sm:h-[400px] bg-gray-100 relative">
        {block.content.googleMapsUrl ? (
          <iframe
            src={(() => {
              let url = block.content.googleMapsUrl || '';
              // Self-heal: If the saved string is a raw iframe tag, extract the src on the fly
              if (url.toLowerCase().includes('<iframe') && url.toLowerCase().includes('src=')) {
                const match = url.match(/src=["'](.*?)["']/i);
                if (match && match[1]) {
                  url = match[1];
                }
              }
              // Clean up any stray HTML entities from copy-pasting
              url = url.replace(/&amp;/g, '&');
              if (url.startsWith('//')) {
                return `https:${url}`;
              }
              return url;
            })()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
            className="absolute inset-0"
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 gap-2 text-sm font-medium">
            <MapPin className="w-5 h-5" /> No Google Maps URL provided
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8">
        {block.content.businessHours && (
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-5 font-medium bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
            <Clock className="w-5 h-5 text-green-600" />
            {block.content.businessHours}
          </div>
        )}

        {(block.content.deliveryLinks || []).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {block.content.deliveryLinks.map((link: any, idx: number) => {
              const isSwiggy = link.platform === 'SWIGGY';
              const isZomato = link.platform === 'ZOMATO';
              const isUber = link.platform === 'UBEREATS';

              const bgClass = isSwiggy ? 'bg-[#fc8019] text-white' :
                isZomato ? 'bg-[#cb202d] text-white' :
                  isUber ? 'bg-[#000000] text-white' :
                    'bg-gray-100 text-gray-800 hover:bg-gray-200';

              const label = isSwiggy ? 'Order on Swiggy' :
                isZomato ? 'Order on Zomato' :
                  isUber ? 'Order on UberEats' : 'Order Here';

              return (
                <a
                  key={idx}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-3.5 px-4 rounded-xl text-sm font-bold text-center flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 ${bgClass}`}
                  onClick={(e) => {
                    if (!link.url) e.preventDefault();
                  }}
                >
                  {label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const MonetizationBlock = ({ block, getBlockContainerStyle, getButtonStyle }: { block: any; getBlockContainerStyle: any; getButtonStyle: any }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Date, 2: Time, 3: Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [requirements, setRequirements] = useState('');

  // Booking specific state
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Parse duration from preset/content if available (assume 30 mins as default)
  const duration = 30;

  useEffect(() => {
    if (showModal) {
      // Reset state on open
      setCheckoutStep(block.content.monetizationType === 'SERVICE_LIVE' ? 1 : 3);
      setSelectedDate('');
      setSelectedSlot(null);
    }
  }, [showModal, block.content.monetizationType]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || block.content.monetizationType !== 'SERVICE_LIVE') return;
      setIsLoadingSlots(true);
      try {
        const slots = await api.getPublicSlots(block.creatorId, selectedDate, duration);
        setAvailableSlots(slots);
      } catch (err) {
        toast.error('Failed to load slots for this date');
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate, block.creatorId, duration]);

  const loadRazorpayScript = () => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      toast.error('Please provide name and email');
      return;
    }

    if (block.content.monetizationType === 'SERVICE_LIVE') {
      if (!selectedDate || !selectedSlot) {
        toast.error('Please select a date and time slot first');
        return;
      }
    }

    setIsProcessing(true);
    const toastId = toast.loading('Initializing payment...');

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Compute UTC times if booking
      let bookingStartUtc = null;
      let bookingEndUtc = null;
      if (block.content.monetizationType === 'SERVICE_LIVE' && selectedSlot) {
        // Create local Date object
        // The selectedSlot comes in "HH:MM" format (24h)
        const [hours, mins] = selectedSlot.split(':').map(Number);

        const startDt = new Date(selectedDate);
        startDt.setHours(hours, mins, 0, 0);

        const endDt = new Date(startDt.getTime() + duration * 60000);

        bookingStartUtc = startDt.toISOString();
        bookingEndUtc = endDt.toISOString();
      }

      // Create Order
      const res = await api.apiClient.post('/v1/monetization/create-order', {
        pageId: block.pageId, // Assumes parent passes down pageId via block object
        blockId: block.id,
        customerEmail,
        customerName,
        answers: { requirements },
        bookingDate: selectedDate || undefined,
        bookingStartUtc,
        bookingEndUtc
      });

      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to create order');
      }

      toast.dismiss(toastId);
      setShowModal(false);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: res.data.currency,
        name: block.content.title || 'TinySlash Checkout',
        description: block.content.description || 'Payment for digital product/service',
        order_id: res.data.orderId,
        handler: async function (response: any) {
          const verifyToast = toast.loading('Verifying payment...');
          try {
            const verifyRes = await api.apiClient.post('/v1/monetization/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success('Payment successful!', { id: verifyToast });
              alert('Payment Verification Successful! Check your email for fulfillment details.');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err: any) {
            toast.error(err.message || 'Error verifying payment', { id: verifyToast });
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
        },
        theme: {
          color: block.content.buttonColor || '#000000',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error('Payment failed. Please try again.');
      });
      rzp.open();

    } catch (error: any) {
      toast.error(error.message || 'Checkout failed', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  // UI Helpers
  const nextStep = () => setCheckoutStep(prev => prev + 1);
  const prevStep = () => setCheckoutStep(prev => prev - 1);

  // Generate an array of the next 14 days
  const upcomingDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    // YYYY-MM-DD local format
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return { dateObj: d, dateStr: `${year}-${month}-${day}` };
  });

  return (
    <div className="my-6 flex flex-col relative overflow-hidden" style={getBlockContainerStyle(block.content.backgroundColor, block.content.strokeColor, block.content.cornerRadius, block.content.shadow)}>
      <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gray-100/80 text-gray-600 text-[10px] sm:text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-gray-200 backdrop-blur-sm">
            {block.content.monetizationType === 'DIGITAL_FILE' ? (
              <><FileText className="w-3.5 h-3.5" /> Digital Download</>
            ) : block.content.monetizationType === 'SERVICE_LIVE' ? (
              <><Calendar className="w-3.5 h-3.5" /> Live Session</>
            ) : (
              <><Mail className="w-3.5 h-3.5" /> Service</>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight ml-4 shrink-0">
            {block.content.price ? `₹${block.content.price}` : 'Free'}
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-xl sm:text-2xl mb-2 leading-tight">
          {block.content.title || 'Monetization Block'}
        </h3>

        {block.content.description && (
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">
            {block.content.description}
          </p>
        )}

        <div className="mt-2 text-xs sm:text-sm py-3 px-4 bg-blue-50/80 text-blue-700 border border-blue-100 rounded-xl flex items-center gap-3 mb-6 font-medium backdrop-blur-sm">
          {block.content.monetizationType === 'DIGITAL_FILE' ? (
            <><Download className="w-5 h-5 shrink-0" /> Immediate download link provided after checkout.</>
          ) : block.content.monetizationType === 'SERVICE_LIVE' ? (
            <><Calendar className="w-5 h-5 shrink-0" /> Pick your preferred slot instantly after payment.</>
          ) : (
            <><Send className="w-5 h-5 shrink-0" /> Secure payment. Delivery via email/dashboard.</>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={isProcessing}
          className="w-full text-center mt-auto transition-transform hover:scale-[1.02] active:scale-95 shadow-sm backdrop-blur-sm"
          style={getButtonStyle()}
        >
          <div className="flex items-center justify-center gap-2">
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : block.content.monetizationType === 'DIGITAL_FILE' ? (
              <><Download className="w-5 h-5" /> Get It Now</>
            ) : block.content.monetizationType === 'SERVICE_LIVE' ? (
              <><Calendar className="w-5 h-5" /> Book Call</>
            ) : (
              <><Send className="w-5 h-5" /> Request Service</>
            )}
          </div>
        </button>
      </div>

      {/* Checkout Modal via Portal to escape overflow-hidden */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md:p-0">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative md:rounded-r-none md:rounded-l-2xl md:h-full md:absolute md:right-0 md:max-w-md flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {checkoutStep === 1 ? 'Select Date' : checkoutStep === 2 ? 'Select Time' : 'Checkout Details'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {checkoutStep === 1 ? 'Pick a date for your session' : checkoutStep === 2 ? `Available slots for ${new Date(selectedDate).toLocaleDateString()}` : 'Enter your details to proceed'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full">
              {/* STEP 1: Date Selection */}
              {checkoutStep === 1 && (
                <div className="p-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {upcomingDates.map((item) => (
                    <button
                      key={item.dateStr}
                      onClick={() => {
                        setSelectedDate(item.dateStr);
                        nextStep();
                      }}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 group-hover:text-blue-600">
                        {item.dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="text-2xl font-black text-gray-900 group-hover:text-blue-700">
                        {item.dateObj.getDate()}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {item.dateObj.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 2: Time Slot Selection */}
              {checkoutStep === 2 && (
                <div className="p-6">
                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No slots available.</h3>
                      <p className="text-sm text-gray-500">The creator is fully booked on this date.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.map(slot => {
                        // slot is usually "09:00"
                        // let's format it for display
                        const [h, m] = slot.split(':');
                        const date = new Date();
                        date.setHours(Number(h));
                        date.setMinutes(Number(m));
                        const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

                        return (
                          <button
                            key={slot}
                            onClick={() => {
                              setSelectedSlot(slot);
                              nextStep();
                            }}
                            className="py-3 px-4 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
                          >
                            {formattedTime}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Details & Payment */}
              {checkoutStep === 3 && (
                <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
                  {block.content.monetizationType === 'SERVICE_LIVE' && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm flex gap-3 text-blue-900 mb-6">
                      <Clock className="w-5 h-5 shrink-0 text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-800">Your Booking Context</div>
                        <div>Date: {new Date(selectedDate).toLocaleDateString()}</div>
                        <div>Time: {selectedSlot} ({Intl.DateTimeFormat().resolvedOptions().timeZone})</div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  {block.content.monetizationType !== 'DIGITAL_FILE' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                      <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                        placeholder="Provide any details needed for this service..."
                      />
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-2 gap-3 shrink-0">
              {checkoutStep > 1 && block.content.monetizationType === 'SERVICE_LIVE' ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-bold transition-colors"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
              )}

              {checkoutStep === 3 ? (
                <button
                  type="submit"
                  onClick={handleCheckoutSubmit}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition flex items-center justify-center shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: block.content.buttonColor || '#2563eb' }}
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    `Pay ₹${block.content.price}`
                  )}
                </button>
              ) : (
                <div className="flex items-center justify-center text-sm font-medium text-gray-400">
                  Step {checkoutStep} of 3
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PublicPage;
