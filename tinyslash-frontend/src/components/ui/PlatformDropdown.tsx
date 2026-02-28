import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, MessageSquare, Mail, Search, Newspaper, Users, Instagram, Youtube, Gamepad2 } from 'lucide-react';
import { FacebookIcon, LinkedInIcon, XIcon, WhatsAppIcon, TelegramIcon } from '../SocialIcons';

interface PlatformOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const PLATFORMS: PlatformOption[] = [
  { value: 'facebook', label: 'Facebook', icon: <FacebookIcon className="w-4 h-4" /> },
  { value: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon className="w-4 h-4" /> },
  { value: 'twitter', label: 'Twitter / X', icon: <XIcon className="w-4 h-4" /> },
  { value: 'google', label: 'Google', icon: <Search className="w-4 h-4" /> },
  { value: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4" /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon className="w-4 h-4 text-[#25D366]" /> },
  { value: 'telegram', label: 'Telegram', icon: <TelegramIcon className="w-4 h-4 text-[#0088cc]" /> },
  { value: 'discord', label: 'Discord', icon: <Gamepad2 className="w-4 h-4" /> },
  { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { value: 'newsletter', label: 'Newsletter', icon: <Mail className="w-4 h-4" /> },
  { value: 'blog', label: 'Blog', icon: <Newspaper className="w-4 h-4" /> },
  { value: 'affiliate', label: 'Affiliate', icon: <Users className="w-4 h-4" /> },
  { value: 'other', label: 'Other', icon: <Globe className="w-4 h-4" /> },
];

interface PlatformDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const PlatformDropdown: React.FC<PlatformDropdownProps> = ({ value, onChange, placeholder = "e.g. facebook, linkedin" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const getActiveIcon = () => {
    const match = PLATFORMS.find(p => p.value.toLowerCase() === value.toLowerCase());
    return match ? match.icon : <Globe className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-500 pointer-events-none flex items-center justify-center">
          {getActiveIcon()}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm bg-white outline-none transition-all placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-0 h-full px-3 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-1 custom-scrollbar">
          <ul className="py-1">
            {PLATFORMS.filter(p => p.label.toLowerCase().includes(value.toLowerCase()) || p.value.toLowerCase().includes(value.toLowerCase()) || value === '').map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                role="option"
                aria-selected={value === opt.value}
              >
                <div className="mr-3 text-gray-500">{opt.icon}</div>
                <span className="font-medium">{opt.label}</span>
              </li>
            ))}
            {PLATFORMS.filter(p => p.label.toLowerCase().includes(value.toLowerCase()) || p.value.toLowerCase().includes(value.toLowerCase()) || value === '').length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500 text-center italic">
                Press enter or click away to use custom source "{value}"
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
