import React from 'react';
import { X, Copy, ExternalLink, CheckCircle, Share2, Plus } from 'lucide-react';
import { WhatsAppIcon, TelegramIcon, FacebookIcon, XIcon, LinkedInIcon, RedditIcon, EmailIcon } from './SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface LinkSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortUrl: string;
  originalUrl: string;
  qrCode?: string;
  type: 'url' | 'qr' | 'file';
  onCopy?: () => void;
}

const LinkSuccessModal: React.FC<LinkSuccessModalProps> = ({
  isOpen,
  onClose,
  shortUrl,
  originalUrl,
  qrCode,
  type,
  onCopy
}) => {
  const [showShareOptions, setShowShareOptions] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Copied to clipboard!');
      if (onCopy) onCopy();
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out this ${type === 'file' ? 'file' : 'link'}: ${shortUrl}`;
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(shortUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shortUrl)}`;
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shortUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Check out this Link')}&body=${encodeURIComponent(text)}`;
        break;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const getTitle = () => {
    switch (type) {
      case 'file': return 'File Link Created';
      case 'qr': return 'QR Link Created';
      default: return 'Link Created';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <h2 className="text-base font-semibold text-gray-900">{getTitle()}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code (if available) */}
            {qrCode && (
              <div className="px-6 pb-3">
                <div className="flex justify-center">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="w-[200px] h-[200px] object-contain rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Short URL */}
            <div className="px-6 pb-2.5">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5 block">Short URL</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="flex-1 text-sm font-mono text-gray-800 truncate">{shortUrl}</span>
                <button
                  onClick={copyToClipboard}
                  className="flex-shrink-0 p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-md transition-colors"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Destination */}
            <div className="px-6 pb-4">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5 block">Destination</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="flex-1 text-sm text-gray-600 truncate">{originalUrl}</span>
                <button
                  onClick={() => window.open(originalUrl, '_blank')}
                  className="flex-shrink-0 p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-md transition-colors"
                  title="Open"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions & Sharing */}
            <div className="px-6 pb-5">
              <div className="mb-2">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 border rounded-xl text-sm font-medium transition-colors ${showShareOptions ? 'bg-gray-100 border-gray-300 text-black' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  <Share2 className="w-4 h-4" />
                  {showShareOptions ? 'Close Share' : 'Share Link'}
                </button>
              </div>

              {/* Social Share Grid */}
              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-center gap-4 overflow-hidden py-2"
                  >
                    {[
                      { name: 'whatsapp', icon: <WhatsAppIcon className="w-9 h-9" />, bg: '#25D366' },
                      { name: 'telegram', icon: <TelegramIcon className="w-9 h-9" />, bg: '#0088CC' },
                      { name: 'facebook', icon: <FacebookIcon className="w-9 h-9" />, bg: '#1877F2' },
                      { name: 'twitter', icon: <XIcon className="w-9 h-9" />, bg: '#000000' },
                      { name: 'linkedin', icon: <LinkedInIcon className="w-9 h-9" />, bg: '#0A66C2' },
                      { name: 'reddit', icon: <RedditIcon className="w-9 h-9" />, bg: '#FF4500' },
                      { name: 'email', icon: <EmailIcon className="w-9 h-9" />, bg: '#EA4335' }
                    ].map((social) => (
                      <button
                        key={social.name}
                        onClick={() => shareToSocial(social.name)}
                        className="flex items-center justify-center transition-transform hover:scale-110"
                        style={{ color: social.bg }}
                        title={`Share on ${social.name.charAt(0).toUpperCase() + social.name.slice(1)}`}
                      >
                        {social.icon}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LinkSuccessModal;