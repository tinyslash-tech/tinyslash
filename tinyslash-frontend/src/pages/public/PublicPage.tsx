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

  const getButtonStyle = () => {
    return {
      backgroundColor: theme.buttonStyle === 'OUTLINE' ? 'transparent' : theme.buttonColor,
      color: theme.buttonStyle === 'OUTLINE' ? theme.buttonColor : theme.buttonTextColor,
      border: theme.buttonStyle === 'OUTLINE' ? `2px solid ${theme.buttonColor}` : 'none',
      borderRadius: theme.buttonStyle === 'ROUNDED' ? '999px' : theme.buttonStyle === 'SHARP' ? '0px' : '12px'
    };
  };

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
        <div className="w-full max-w-[680px] px-6 py-16 flex flex-col items-center min-h-[calc(100vh-40px)]">

          {/* Profile Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            {page.avatarUrl && (
              <img
                src={page.avatarUrl}
                alt={page.title}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mb-6 shadow-xl ring-4 ring-white/20"
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
          {/* Blocks */}
          <div className="w-full space-y-4 sm:space-y-6">
            {(() => {
              const visibleBlocks = page.blocks.filter((b: PageBlock) => b.visible).sort((a: PageBlock, b: PageBlock) => a.order - b.order);
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
                SM: 'p-1.5 sm:p-2',
                MD: 'p-3 sm:p-4',
                LG: 'p-4 sm:p-5'
              };
              const iconSizeMap = {
                SM: 'w-4 h-4 sm:w-5 sm:h-5',
                MD: 'w-6 h-6 sm:w-7 sm:h-7',
                LG: 'w-8 h-8 sm:w-10 sm:h-10'
              }
              const currentSize = theme.socialIconSize || 'MD';

              return groupedBlocks.map(group => {
                if (group.type === 'SOCIAL_GROUP') {
                  return (
                    <div key={group.id} className="w-full animate-fade-in-up flex flex-wrap justify-center gap-4 sm:gap-6 py-4">
                      {group.blocks.map((block: PageBlock) => {
                        const { icon: Icon, color } = getSocialPlatform(block.content.url);
                        // Default background is #e8e8e8 (light gray)
                        const bgStyle = { backgroundColor: theme.socialBackgroundColor || '#e8e8e8' };

                        return (
                          <a
                            key={block.id}
                            href={block.content.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`rounded-full shadow-sm hover:shadow-md hover:scale-110 transition-all ${socialSizeMap[currentSize]}`}
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
                                ${theme.fontSize === 'SM' ? 'py-3 sm:py-4 px-5 sm:px-6 text-sm sm:text-base' : theme.fontSize === 'LG' ? 'py-5 sm:py-6 px-8 sm:px-10 text-lg sm:text-xl' : 'py-4 sm:py-5 px-6 text-base sm:text-lg'}
                                ${theme.fontWeight === 'BOLD' ? 'font-bold' : theme.fontWeight === 'SEMIBOLD' ? 'font-semibold' : 'font-semibold'}
                            `}
                        style={getButtonStyle()}
                      >
                        {block.content.title}
                      </a>
                    )}

                    {/* HEADER */}
                    {block.type === 'HEADER' && (
                      <h2 className={`text-center mt-6 mb-2 opacity-95
                          ${theme.fontSize === 'SM' ? 'text-lg' : theme.fontSize === 'LG' ? 'text-3xl' : 'text-xl'}
                          ${theme.fontWeight === 'BOLD' ? 'font-extrabold' : theme.fontWeight === 'SEMIBOLD' ? 'font-bold' : 'font-bold'}
                      `}>{block.content.text}</h2>
                    )}

                    {/* TEXT */}
                    {block.type === 'TEXT' && (
                      <p className={`text-center opacity-85 leading-relaxed px-4
                          ${theme.fontSize === 'SM' ? 'text-xs sm:text-sm' : theme.fontSize === 'LG' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}
                      `}>{block.content.text}</p>
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
                        <div className="flex gap-2">
                          <input type="email" placeholder="Email Address" className="flex-1 text-sm border-gray-200 bg-gray-50 rounded-lg px-3 outline-none focus:ring-2 focus:ring-black" />
                          <button className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800">Join</button>
                        </div>
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
      </div>
    </>
  );
};

export default PublicPage;
