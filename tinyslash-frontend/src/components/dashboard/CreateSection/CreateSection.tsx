import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Contexts
import { useAuth } from '../../../context/AuthContext';
import { useSubscription } from '../../../context/SubscriptionContext';
import { useUpgradeModal } from '../../../context/ModalContext';
import { useFeatureAccess } from '../../../hooks/useFeatureAccess';

// Types & Hooks
import { CreateMode, DEFAULT_DOMAIN, QRCustomization, SmartLinkPreview, GeoConfig, DeepLinkConfig, LeadLockConfig, TrustBadgeConfig } from './types';
import { useCustomDomains } from './hooks/useCustomDomains';
import { useSecurityUI } from './hooks/useSecurityUI';
import { useCreateHandler } from './hooks/useCreateHandler';

// Components
import { UrlCreate } from './modes/UrlCreate';
import { QrCreate } from './modes/QrCreate';
import { FileCreate } from './modes/FileCreate';
import { CreateButton } from './ui/CreateButton';
import { AdvancedSettings } from './ui/AdvancedSettings';
import { QRPreview } from './qr/QRPreview';
import { QRCustomizationPanel } from './qr/QRCustomizationPanel';

// Modals
import LinkSuccessModal from '../../LinkSuccessModal';
import QRSuccessModal from '../../QRSuccessModal';

interface CreateSectionProps {
  mode: CreateMode;
  onModeChange: (mode: CreateMode) => void;
}

const CreateSection: React.FC<CreateSectionProps> = ({ mode, onModeChange }) => {
  const { user } = useAuth();
  const { planInfo, checkAccess, showUpgradeModal } = useSubscription();
  const upgradeModal = useUpgradeModal();
  const featureAccess = useFeatureAccess(user);
  const location = useLocation();

  // Local State
  const [urlInput, setUrlInput] = useState('');
  const [qrText, setQrText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customAlias, setCustomAlias] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [expirationDays, setExpirationDays] = useState<number | ''>('');
  const [maxClicks, setMaxClicks] = useState<number | ''>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editQRId, setEditQRId] = useState<string | null>(null);
  const [isOneTime, setIsOneTime] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // New Features State
  const [smartLinkPreview, setSmartLinkPreview] = useState<SmartLinkPreview>({ title: '', description: '' });
  const [geoConfig, setGeoConfig] = useState<GeoConfig>({ enabled: true, rules: [], defaultUrl: '' });
  const [deepLinkConfig, setDeepLinkConfig] = useState<DeepLinkConfig>({ enabled: false });
  const [leadLockConfig, setLeadLockConfig] = useState<LeadLockConfig>({ enabled: false, type: 'whatsapp' });
  const [trustBadgeConfig, setTrustBadgeConfig] = useState<TrustBadgeConfig>({ enabled: false, requested: false });

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);

  // Custom Hooks
  const {
    customDomains,
    selectedDomain,
    setSelectedDomain
  } = useCustomDomains();

  const {
    errorMessage,
    setErrorMessage,
    showSecurityBlockedUI,
    handleApiError
  } = useSecurityUI();

  // QR Customization State
  const [qrCustomization, setQrCustomization] = useState<QRCustomization>({
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    size: 300,
    errorCorrectionLevel: 'M',
    margin: 4,
    logoSize: 20,
    logoCornerRadius: 0,
    pattern: 'square',
    cornerStyle: 'square',
    frameStyle: 'none',
    gradientType: 'none',
    gradientDirection: 'to-right',
    secondaryColor: '#333333',
    centerTextFontSize: 16,
    centerTextFontFamily: 'Arial',
    centerTextColor: '#000000',
    centerTextBackgroundColor: '#FFFFFF',
    centerTextBold: true
  });

  // Handler Hook
  const {
    handleCreate,
    isLoading,
    result,
    showSuccessModal,
    setShowSuccessModal,
    showQRSuccessModal,
    setShowQRSuccessModal
  } = useCreateHandler({
    user,
    mode,
    selectedDomain,
    urlInput,
    qrText,
    selectedFile,
    customAlias,
    password,
    expirationDays,
    maxClicks,
    qrCustomization,
    isEditMode,
    editQRId,
    featureAccess,
    checkAccess,
    showUpgradeModal,
    planInfo,
    handleApiError,
    setErrorMessage,
    canvasRef,
    showSecurityBlockedUI,
    isMounted,
    smartLinkPreview,
    geoConfig,
    deepLinkConfig,
    leadLockConfig,
    trustBadgeConfig
  });

  // Lifecycle
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const editData = location.state && typeof location.state === 'object' && 'editQRData' in location.state
      ? (location.state as any).editQRData
      : null;

    if (editData) {
      setIsEditMode(true);
      setEditQRId(editData.id);
      setQrText(editData.content || '');

      setQrCustomization({
        foregroundColor: editData.foregroundColor || '#000000',
        backgroundColor: editData.backgroundColor || '#FFFFFF',
        size: editData.size || 300,
        errorCorrectionLevel: editData.errorCorrectionLevel || 'M',
        margin: 4,
        logo: editData.logoUrl || undefined,
        logoSize: 20,
        logoCornerRadius: 0,
        pattern: 'square',
        cornerStyle: 'square',
        frameStyle: editData.frameStyle || 'none',
        gradientType: 'none',
        gradientDirection: 'to-right',
        secondaryColor: '#333333',
        centerTextFontSize: 16,
        centerTextFontFamily: 'Arial',
        centerTextColor: '#000000',
        centerTextBackgroundColor: '#FFFFFF',
        centerTextBold: true
      });

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const resetForm = () => {
    if (!isEditMode) {
      setUrlInput('');
      setQrText('');
      setSelectedFile(null);
      setCustomAlias('');
      setPassword('');
      setExpirationDays('');
      setMaxClicks('');
      setIsOneTime(false);
    } else {
      setIsEditMode(false);
      setEditQRId(null);
    }
  };

  const downloadQR = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  };

  const copyToClipboard = async (text: string) => {
    // Basic copy implementation as passed prop
    try {
      await navigator.clipboard.writeText(text);
      // Toast handled by logic outside or needs importing? 
      // We'll let the component handling this handle the toast or assume global toast
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-col lg:flex-row p-6 lg:p-8 gap-8">

        {/* Sticky QR Preview (only for QR mode) */}
        {mode === 'qr' && (
          <QRPreview
            qrText={qrText}
            qrCustomization={qrCustomization}
            canvasRef={canvasRef}
            downloadQR={downloadQR}
            copyToClipboard={copyToClipboard}
          />
        )}

        {/* Main Form Section */}
        <div className={`flex-1 space-y-6 ${mode === 'qr' ? 'order-2' : 'max-w-3xl mx-auto'}`}>
          {/* Input Mode Components */}
          <div className="space-y-6">
            {mode === 'url' && (
              <UrlCreate
                urlInput={urlInput}
                setUrlInput={setUrlInput}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
              />
            )}

            {mode === 'qr' && (
              <QrCreate
                qrText={qrText}
                setQrText={setQrText}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                isEditMode={isEditMode}
              />
            )}

            {mode === 'file' && (
              <FileCreate
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            )}
          </div>

          {/* QR Customization Panel */}
          {mode === 'qr' && (
            <QRCustomizationPanel
              qrCustomization={qrCustomization}
              setQrCustomization={setQrCustomization}
              featureAccess={featureAccess}
              upgradeModal={upgradeModal}
              logoInputRef={logoInputRef}
            />
          )}

          {/* Advanced Settings */}
          {(mode !== 'file') && (
            <AdvancedSettings
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              customDomains={customDomains}
              customAlias={customAlias}
              setCustomAlias={setCustomAlias}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              expirationDays={expirationDays}
              setExpirationDays={setExpirationDays}
              maxClicks={maxClicks}
              setMaxClicks={setMaxClicks}
              isOneTime={isOneTime}
              setIsOneTime={setIsOneTime}
              smartLinkPreview={smartLinkPreview}
              setSmartLinkPreview={setSmartLinkPreview}
              geoConfig={geoConfig}
              setGeoConfig={setGeoConfig}
              deepLinkConfig={deepLinkConfig}
              setDeepLinkConfig={setDeepLinkConfig}
              leadLockConfig={leadLockConfig}
              setLeadLockConfig={setLeadLockConfig}
              trustBadgeConfig={trustBadgeConfig}
              setTrustBadgeConfig={setTrustBadgeConfig}
              featureAccess={featureAccess}
              upgradeModal={upgradeModal}
            />
          )}

          {/* Create Button */}
          <CreateButton
            mode={mode}
            isLoading={isLoading}
            isEditMode={isEditMode}
            onClick={() => handleCreate(resetForm)}
          />
        </div>
      </div>

      {/* Success Modals */}
      {showSuccessModal && result && (
        <LinkSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            // setResult(null); // Optional: clear result on close if desired, consistent with backup
          }}
          shortUrl={result.shortUrl || ''}
          originalUrl={result.originalUrl || ''}
          qrCode={result.qrCode}
          type={mode}
        />
      )}

      {showQRSuccessModal && result && (
        <QRSuccessModal
          isOpen={showQRSuccessModal}
          onClose={() => setShowQRSuccessModal(false)}
          qrCanvas={canvasRef.current}
          shortUrl={result.shortUrl || ''}
          originalUrl={result.originalUrl || ''}
          qrCustomization={qrCustomization}
          onCustomize={() => {
            setShowQRSuccessModal(false);
            // Keep form open
          }}
          onCreateAnother={() => {
            setShowQRSuccessModal(false);
            resetForm();
          }}
        />
      )}
    </div>
  );
};

export default CreateSection;
