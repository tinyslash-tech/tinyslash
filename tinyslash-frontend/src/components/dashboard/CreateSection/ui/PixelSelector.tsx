import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pixel, PixelService } from '../../../../services/PixelService';
import { useAuth } from '../../../../context/AuthContext';
import { Activity, Check, ExternalLink } from 'lucide-react';

interface PixelSelectorProps {
  selectedPixelIds: string[];
  onChange: (ids: string[]) => void;
}

export const PixelSelector: React.FC<PixelSelectorProps> = ({ selectedPixelIds, onChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Failed to load pixels', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (pixelId: string) => {
    if (selectedPixelIds.includes(pixelId)) {
      onChange(selectedPixelIds.filter(id => id !== pixelId));
    } else {
      onChange([...selectedPixelIds, pixelId]);
    }
  };

  const goToPixelManager = () => {
    navigate('/dashboard/pixels');
  };

  if (loading) {
    return <div className="text-sm text-gray-400 animate-pulse">Loading pixels...</div>;
  }

  if (pixels.length === 0) {
    return (
      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200 text-center">
        <p className="mb-2">No pixels found yet.</p>
        <button
          type="button"
          onClick={goToPixelManager}
          className="inline-flex items-center text-blue-600 font-medium hover:underline text-sm"
        >
          + Create a Pixel
          <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </button>
        <p className="text-xs text-gray-400 mt-1">Opens in Pixels Manager (sidebar)</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pixels.map(pixel => {
        const isSelected = selectedPixelIds.includes(pixel.id);
        return (
          <div
            key={pixel.id}
            onClick={() => handleToggle(pixel.id)}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${isSelected
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-md ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                  {pixel.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="uppercase">{pixel.type.replace('_', ' ')}</span>
                  <span>•</span>
                  <span className="font-mono">{pixel.pixelId}</span>
                </div>
              </div>
            </div>

            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'
              }`}>
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={goToPixelManager}
          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
        >
          Manage Pixels
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
