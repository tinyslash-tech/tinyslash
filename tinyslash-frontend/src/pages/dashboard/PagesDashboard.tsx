import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pageService } from '../../services/pageService';
import { Page } from '../../types/page';
import toast from 'react-hot-toast';
import { Loader2, ExternalLink, Edit, Trash2, Layout, Plus, Wand2, Globe, BarChart3 } from 'lucide-react';
import React from 'react';
import { LivePreviewCard } from '../../components/page-builder/LivePreviewCard';

const PagesDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newSlug, setNewSlug] = React.useState('');
  const [newTitle, setNewTitle] = React.useState('');

  const { data: pages, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: pageService.getAll
  });

  const createMutation = useMutation({
    mutationFn: pageService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setIsCreateModalOpen(false);
      toast.success('Page created successfully!');
      navigate(`/dashboard/pages/builder/${data.id}?new=true`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create page');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: pageService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast.success('Page deleted');
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title: newTitle,
      slug: newSlug,
      blocks: [], // Empty blocks
      theme: { // Default theme
        background: '#ffffff',
        backgroundType: 'SOLID',
        buttonShape: 'ROUNDED',
        buttonStyle: 'FILLED',
        buttonShadow: 'NONE',
        font: 'Inter',
        textColor: '#000000',
        buttonColor: '#000000',
        buttonTextColor: '#ffffff',
        socialStyle: 'FILLED',
        socialIconSize: 'MD',
        profileImageStyle: 'CIRCLE',
        profileImageSize: 'MD',
        nameSize: 'MD',
        pageMaxWidth: 680,
        contentSpacing: 'NORMAL',
        bannerType: 'NONE',
        bannerHeight: 150,
        showBranding: true
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">TinySlash Pages</h1>
          <p className="text-gray-500 mt-1">Create a beautiful link-in-bio page for your brand.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Page
        </button>
      </div>

      {pages && pages.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {pages.map((page: Page) => (
            <LivePreviewCard
              key={page.id}
              data={page}
              actions={
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/pages/builder/${page.id}`);
                    }}
                    className="p-2.5 bg-white text-gray-900 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
                    title="Edit Page"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/p/${page.slug}`, '_blank');
                    }}
                    className="p-2.5 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
                    title="Preview Live"
                  >
                    <ExternalLink size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this page?')) {
                        deleteMutation.mutate(page.id);
                      }
                    }}
                    className="p-2.5 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                    title="Delete Page"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              }
              onClick={() => navigate(`/dashboard/pages/builder/${page.id}`)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 text-center max-w-2xl mx-auto mt-12">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Wand2 className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Start Your First Page</h2>
          <p className="text-gray-600 mb-6">
            Turn your followers into customers with a custom landing page. It only takes a few minutes.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 font-semibold px-6 py-2.5 rounded-lg transition-all"
          >
            Create Your First Page
          </button>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Page</h2>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. My Awesome Brand"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 border border-r-0 border-gray-300 text-gray-500 px-3 py-2 rounded-l-lg text-sm">
                      tinyslash.com/p/
                    </span>
                    <input
                      type="text"
                      required
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="my-brand"
                      className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesDashboard;
