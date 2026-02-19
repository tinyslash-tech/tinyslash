import React, { useState, useEffect } from 'react';
import { Pixel, PixelService, PixelType } from '../../services/PixelService';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Activity, CheckCircle, XCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PixelManager: React.FC = () => {
  const { user } = useAuth();
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<PixelType>(PixelType.FACEBOOK_CAPI);
  const [pixelId, setPixelId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [conversionApiEndpoint, setConversionApiEndpoint] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadPixels();
    }
  }, [user?.id]);

  const loadPixels = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await PixelService.getAll(user.id);
      setPixels(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load pixels');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSubmitting(true);
    try {
      await PixelService.create({
        userId: user.id,
        name,
        type,
        pixelId,
        accessToken,
        conversionApiEndpoint: type === PixelType.WEBHOOK ? conversionApiEndpoint : undefined
      });
      toast.success('Pixel added successfully');
      setIsModalOpen(false);
      resetForm();
      loadPixels();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create pixel');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.id || !window.confirm('Are you sure you want to delete this pixel?')) return;
    try {
      await PixelService.delete(id, user.id);
      toast.success('Pixel deleted');
      loadPixels();
    } catch (error) {
      toast.error('Failed to delete pixel');
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    if (!user?.id) return;
    try {
      await PixelService.toggleActive(id, user.id, !currentStatus);
      toast.success(`Pixel ${!currentStatus ? 'activated' : 'deactivated'}`);
      loadPixels(); // Refresh to see update
    } catch (error) {
      toast.error('Failed to update pixel status');
    }
  };

  const resetForm = () => {
    setName('');
    setType(PixelType.FACEBOOK_CAPI);
    setPixelId('');
    setAccessToken('');
    setConversionApiEndpoint('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Tracking Pixels
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Connect Meta, Google & more to never miss a conversion — even when ad blockers are active.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus />
          Connect Pixel
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-100 rounded"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
        </div>
      ) : pixels.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Activity className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">No tracking pixels yet</p>
          <p className="text-sm text-gray-400 mt-1">Connect your first pixel to start capturing conversions from every link click.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Pixel Name</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Pixel ID</th>
                <th className="px-4 py-3">Conversions</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pixels.map((pixel) => (
                <tr key={pixel.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{pixel.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                            ${pixel.type === PixelType.FACEBOOK_CAPI ? 'bg-blue-100 text-blue-800' :
                        pixel.type === PixelType.GOOGLE_ADS ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {pixel.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{pixel.pixelId}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col text-xs">
                      <span className="text-green-600 font-medium">✓ {pixel.totalFired} captured</span>
                      {pixel.totalFailed > 0 && <span className="text-red-500">{pixel.totalFailed} missed</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(pixel.id, pixel.active)}
                      className={`text-xl ${pixel.active ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                      title={pixel.active ? 'Active' : 'Inactive'}
                    >
                      {pixel.active ? <CheckCircle /> : <XCircle />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(pixel.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Pixel"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Pixel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Connect a Tracking Pixel</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Friendly Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g., My FB Pixel for Shoes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={type}
                  onChange={(e) => setType(e.target.value as PixelType)}
                >
                  <option value={PixelType.FACEBOOK_CAPI}>📘 Meta (Facebook) Ads</option>
                  <option value={PixelType.GOOGLE_ADS}>🟢 Google Ads</option>
                  <option value={PixelType.GA4}>📊 Google Analytics 4</option>
                  <option value={PixelType.WEBHOOK}>🔗 Custom Webhook</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pixel ID / Dataset ID</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="1234567890"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                />
              </div>

              {type === PixelType.FACEBOOK_CAPI && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                  <textarea
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-mono"
                    placeholder="EAAB..."
                    rows={3}
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Found in Meta Events Manager → Settings → Access Token</p>
                </div>
              )}

              {type === PixelType.WEBHOOK && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                  <input
                    type="url"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://api.myapp.com/webhook"
                    value={conversionApiEndpoint}
                    onChange={(e) => setConversionApiEndpoint(e.target.value)}
                  />
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Connecting...' : 'Connect Pixel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixelManager;
