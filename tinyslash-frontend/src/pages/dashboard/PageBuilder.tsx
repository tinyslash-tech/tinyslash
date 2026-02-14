import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pageService } from '../../services/pageService';
import { Page } from '../../types/page';
import {
  Loader2, Save, ChevronLeft,
  User, Palette, Layers, Settings,
  Monitor, Smartphone, BarChart3, LayoutTemplate
} from 'lucide-react';
import { TemplatesTab } from '../../components/page-builder/tabs/TemplatesTab';
import { TEMPLATES, Template } from '../../config/templates/index';
import toast from 'react-hot-toast';
import { ProfileTab } from '../../components/page-builder/tabs/ProfileTab';
import { DesignTab } from '../../components/page-builder/tabs/DesignTab';
import { ContentTab } from '../../components/page-builder/tabs/ContentTab';
import { SettingsTab } from '../../components/page-builder/tabs/SettingsTab';
import { AnalyticsTab } from '../../components/page-builder/tabs/AnalyticsTab';
import { Preview } from '../../components/page-builder/Preview';

import { useDebounce } from '../../hooks/useDebounce';

type Tab = 'TEMPLATES' | 'PROFILE' | 'CONTENT' | 'DESIGN' | 'SETTINGS' | 'ANALYTICS';

// Device Presets Definition
const DEVICE_PRESETS = [
  { name: 'iPhone 16 Pro Max', width: 430, height: 932, type: 'mobile', brand: 'apple' },
  { name: 'iPhone 16 / 15 Pro', width: 393, height: 852, type: 'mobile', brand: 'apple' },
  { name: 'iPhone 15 / 14', width: 390, height: 844, type: 'mobile', brand: 'apple' },
  { name: 'iPhone SE (3rd Gen)', width: 375, height: 667, type: 'mobile', brand: 'apple' },
  { name: 'Pixel 9 Pro XL', width: 412, height: 915, type: 'mobile', brand: 'google' },
  { name: 'Pixel 8 / 7', width: 412, height: 915, type: 'mobile', brand: 'google' },
  { name: 'Galaxy S24 Ultra', width: 412, height: 915, type: 'mobile', brand: 'samsung' },
  { name: 'Galaxy S24+', width: 384, height: 854, type: 'mobile', brand: 'samsung' },
  { name: 'iPad Mini (6th Gen)', width: 744, height: 1133, type: 'tablet', brand: 'apple' },
  { name: 'iPad (10th Gen)', width: 820, height: 1180, type: 'tablet', brand: 'apple' },
  { name: 'iPad Pro 11"', width: 834, height: 1194, type: 'tablet', brand: 'apple' },
  { name: 'iPad Pro 12.9"', width: 1024, height: 1366, type: 'tablet', brand: 'apple' },
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080, type: 'desktop', brand: 'generic' },
  { name: 'Laptop (1440x900)', width: 1440, height: 900, type: 'desktop', brand: 'generic' },
  { name: 'Laptop (1366x768)', width: 1366, height: 768, type: 'desktop', brand: 'generic' },
];

const PageBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isNewPage = searchParams.get('new') === 'true';
  const queryClient = useQueryClient();
  const [page, setPage] = useState<Page | null>(null);
  // const [showTemplates, setShowTemplates] = useState(isNewPage); // No longer needed
  const [activeTab, setActiveTab] = useState<Tab>(isNewPage ? 'TEMPLATES' : 'PROFILE');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  // Preview State
  const [selectedDevice, setSelectedDevice] = useState(DEVICE_PRESETS[2]); // Default to iPhone 15/14
  const [scale, setScale] = useState(1);
  const [isDevicePickerOpen, setIsDevicePickerOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      // setShowTemplates(true);
      setActiveTab('TEMPLATES');
    }
  }, [searchParams]);

  // Debounce the page object updates by 1000ms (1 second)
  const debouncedPage = useDebounce(page, 1000);

  // Fetch Page Data
  const { data: fetchedPage, isLoading } = useQuery({
    queryKey: ['page', id],
    queryFn: () => pageService.getById(id!),
    enabled: !!id
  });

  useEffect(() => {
    if (fetchedPage && !page) {
      setPage(fetchedPage);
    }
  }, [fetchedPage]);

  // Adjust scale to fit screen automatically
  useEffect(() => {
    const handleResize = () => {
      const containerHeight = window.innerHeight - 180; // Approximate available height
      const hScale = containerHeight / selectedDevice.height;
      // Cap scale at 1 to prevent making it huge on large screens, or allow it.
      // Usually users want to see it fit.
      const newScale = Math.min(1, Math.max(0.4, hScale - 0.05)); // 5% padding
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedDevice]);

  // Save Mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Page>) => pageService.update(id!, data),
    onSuccess: (data) => {
      // Don't update full page state to avoid cursor jumps, just confirm save
      setLastSaved(new Date());
      setIsSaving(false);
      queryClient.invalidateQueries({ queryKey: ['page', id] });
    },
    onError: () => {
      setIsSaving(false);
      toast.error('Failed to auto-save');
    }
  });

  // Auto-Save Effect
  useEffect(() => {
    if (debouncedPage) {
      // Sanitize payload: Remove read-only fields
      const {
        id: _id,
        userId: _userId,
        views: _views,
        uniqueVisitors: _unique,
        createdAt: _created,
        updatedAt: _updated,
        ...editableData
      } = debouncedPage;

      updateMutation.mutate(editableData);
    }
  }, [debouncedPage]);



  const handleUpdate = (updates: Partial<Page>) => {
    if (!page) return;
    setPage(prev => prev ? ({ ...prev, ...updates }) : null);
  };

  const handleTemplateSelect = (template: Template) => {
    if (!page) return;

    // Generate IDs for blocks
    const newBlocks = template.blocks.map(block => ({
      ...block,
      id: Math.random().toString(36).substr(2, 9),
    }));

    const updates: Partial<Page> = {
      bio: template.profile.bio || page.bio,
      theme: {
        ...page.theme,
        ...template.theme,
        profileImageStyle: template.profile.profileImageStyle || page.theme.profileImageStyle,
        profileImageSize: template.profile.profileImageSize || page.theme.profileImageSize,
        nameSize: template.profile.nameSize || page.theme.nameSize,
      },
      blocks: newBlocks,
      avatarUrl: template.profile.avatarUrl || page.avatarUrl,
      metaTitle: template.settings.metaTitle || page.metaTitle,
      metaDescription: template.settings.metaDescription || page.metaDescription,
    };

    handleUpdate(updates);

    // Auto-save will be triggered by handleUpdate -> debouncedPage -> useEffect
    // updateMutation.mutate(updates);

    // Transition away from templates
    // setShowTemplates(false);
    setSearchParams({});
    setActiveTab('PROFILE');
    toast.success(`Applied ${template.name} template`);
  };

  if (isLoading || !page) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  const tabs = [
    { id: 'TEMPLATES', label: 'Templates', icon: LayoutTemplate },
    { id: 'PROFILE', label: 'Profile', icon: User },
    { id: 'CONTENT', label: 'Content', icon: Layers },
    { id: 'DESIGN', label: 'Design', icon: Palette },
    { id: 'ANALYTICS', label: 'Analytics', icon: BarChart3 },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 overflow-hidden">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/pages')}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{page.title}</h1>
            <p className="text-xs text-gray-500">/{page.slug}</p>
          </div>
        </div>



        <div className="flex items-center gap-4">
          {/* Saving Indicator */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <span className="text-green-600">Saved</span>
                <span className="text-gray-400">• {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </>
            ) : (
              <span>All changes saved</span>
            )}
          </div>

          {/* Publish Toggle */}
          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${page.published ? 'text-green-600' : 'text-gray-400'}`}>
              {page.published ? 'Published' : 'Draft'}
            </span>
            <button
              onClick={() => handleUpdate({ published: !page.published })}
              className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-offset-2
                      ${page.published ? 'bg-green-500' : 'bg-gray-200'}
                  `}
            >
              <span className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                      ${page.published ? 'translate-x-5' : 'translate-x-0'}
                  `} />
            </button>
          </div>

          <a
            href={`/p/${page.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors ml-2"
          >
            <Monitor className="w-4 h-4" />
            Go Live
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar Tabs */}
        <div className="w-[500px] bg-white border-r border-gray-200 flex flex-col z-10">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-1 flex flex-col items-center justify-center py-3 border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-black text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {activeTab === 'TEMPLATES' && <TemplatesTab onSelect={handleTemplateSelect} />}
            {activeTab === 'PROFILE' && <ProfileTab page={page} onChange={handleUpdate} />}
            {activeTab === 'CONTENT' && <ContentTab page={page} onChange={handleUpdate} />}
            {activeTab === 'DESIGN' && <DesignTab page={page} onChange={handleUpdate} />}
            {activeTab === 'ANALYTICS' && <AnalyticsTab page={page} onChange={handleUpdate} />}
            {activeTab === 'SETTINGS' && <SettingsTab page={page} onChange={handleUpdate} />}
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100/50 flex flex-col relative overflow-hidden">
          <div className="h-14 flex items-center px-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm z-20 relative shadow-sm">
            {/* Left Spacer */}
            <div className="flex-1"></div>

            {/* Centered Device Selector */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Device:</span>
              <div className="relative">
                <button
                  onClick={() => setIsDevicePickerOpen(!isDevicePickerOpen)}
                  onBlur={() => setTimeout(() => setIsDevicePickerOpen(false), 200)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${isDevicePickerOpen ? 'bg-blue-50 border-blue-200 text-blue-700 ring-4 ring-blue-50' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm'}`}
                >
                  {selectedDevice.type === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                  <span>{selectedDevice.name}</span>
                  <ChevronLeft className={`w-3 h-3 transition-transform duration-200 ${isDevicePickerOpen ? 'rotate-90' : '-rotate-90'}`} />
                </button>

                {/* Dropdown Menu */}
                {isDevicePickerOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-2 mb-1 border-b border-gray-100 flex justify-between items-center">
                      <span>Select Device</span>
                      <span className="text-gray-300">{DEVICE_PRESETS.length} Available</span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto space-y-1 scrollbar-thin">
                      {DEVICE_PRESETS.map(device => (
                        <button
                          key={device.name}
                          onMouseDown={() => {
                            setSelectedDevice(device);
                            setIsDevicePickerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors text-left group
                                ${selectedDevice.name === device.name ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-md ${selectedDevice.name === device.name ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-white'}`}>
                              {device.type === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                            </div>
                            <span className="font-medium">{device.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{device.width}x{device.height}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Scale Indicator */}
            <div className="flex-1 flex justify-end">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100/50 px-3 py-1.5 rounded-full border border-gray-100">
                {Math.round(scale * 100)}%
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute inset-0 pattern-grid-lg text-gray-100/50" />

            {/* Device Frame */}
            <div
              style={{
                width: selectedDevice.width,
                height: selectedDevice.height,
                transform: `scale(${scale})`,
                transition: 'all 0.3s ease'
              }}
              className={`relative bg-white shadow-2xl overflow-hidden ring-1 ring-black/5 transition-all
                ${selectedDevice.type === 'mobile' ? 'rounded-[3rem] border-[8px] border-gray-900' : 'rounded-lg border border-gray-300'}
              `}
            >
              {/* Dynamic Island / Notch Simulation for iPhones */}
              {selectedDevice.brand === 'apple' && selectedDevice.type === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-2xl z-50 pointer-events-none"></div>
              )}
              {/* Camera Hole for Androids */}
              {(selectedDevice.brand === 'google' || selectedDevice.brand === 'samsung') && selectedDevice.type === 'mobile' && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 pointer-events-none"></div>
              )}
              {/* Desktop Browser Bar Mockup */}
              {selectedDevice.type === 'desktop' && (
                <div className="h-6 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                </div>
              )}

              <div className="w-full h-full overflow-y-auto scrollbar-hide bg-white">
                <Preview page={page} mode={selectedDevice.type === 'mobile' ? 'MOBILE' : 'DESKTOP'} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PageBuilder;
