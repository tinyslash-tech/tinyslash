import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pageService } from '../../services/pageService';
import { Page } from '../../types/page';
import {
  Loader2, Save, ChevronLeft,
  User, Palette, Layers, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { IdentityTab } from '../../components/page-builder/tabs/IdentityTab';
import { ThemeTab } from '../../components/page-builder/tabs/ThemeTab';
import { ContentTab } from '../../components/page-builder/tabs/ContentTab';
import { SettingsTab } from '../../components/page-builder/tabs/SettingsTab';
import { Preview } from '../../components/page-builder/Preview';

type Tab = 'IDENTITY' | 'THEME' | 'CONTENT' | 'SETTINGS';

const PageBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<Page | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('IDENTITY');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch Page Data
  const { data: fetchedPage, isLoading } = useQuery({
    queryKey: ['page', id],
    queryFn: () => pageService.getById(id!),
    enabled: !!id
  });

  useEffect(() => {
    if (fetchedPage) {
      setPage(fetchedPage);
    }
  }, [fetchedPage]);

  // Save Mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Page>) => pageService.update(id!, data),
    onSuccess: (data) => {
      setPage(data);
      setHasUnsavedChanges(false);
      toast.success('Changes saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['page', id] });
    },
    onError: () => toast.error('Failed to save changes')
  });

  const handleUpdate = (updates: Partial<Page>) => {
    if (!page) return;
    setPage({ ...page, ...updates });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (page) {
      updateMutation.mutate(page);
    }
  };

  if (isLoading || !page) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  const tabs = [
    { id: 'IDENTITY', label: 'Identity', icon: User },
    { id: 'THEME', label: 'Appearance', icon: Palette },
    { id: 'CONTENT', label: 'Content', icon: Layers },
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

        <div className="flex items-center gap-3">
          {/* Publish Toggle */}
          <div className="flex items-center gap-2 mr-2 border-r border-gray-200 pr-4">
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

          <span className={`text-xs font-medium px-2 py-1 rounded-full ${hasUnsavedChanges ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            {hasUnsavedChanges ? 'Unsaved Changes' : 'Saved'}
          </span>
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || updateMutation.isPending}
            className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm
                    ${hasUnsavedChanges
                ? 'bg-black text-white hover:bg-gray-800 hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
                `}
          >
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar Tabs */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col z-10">
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
            {activeTab === 'IDENTITY' && <IdentityTab page={page} onChange={handleUpdate} />}
            {activeTab === 'THEME' && <ThemeTab page={page} onChange={handleUpdate} />}
            {activeTab === 'CONTENT' && <ContentTab page={page} onChange={handleUpdate} />}
            {activeTab === 'SETTINGS' && <SettingsTab page={page} onChange={handleUpdate} />}
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100/50 flex flex-col">
          <div className="h-12 flex items-center justify-center border-b border-gray-200 bg-white/50 backdrop-blur-sm text-xs font-medium text-gray-500">
            Live Preview
          </div>
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute inset-0 pattern-grid-lg text-gray-100/50" /> {/* Optional background pattern */}
            <Preview page={page} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PageBuilder;
