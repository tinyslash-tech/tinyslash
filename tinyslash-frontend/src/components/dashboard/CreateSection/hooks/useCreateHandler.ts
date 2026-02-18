import { useState } from 'react';
import * as QRCode from 'qrcode'; // Need for final generation
import { toast } from 'react-hot-toast';
import { createShortUrl, createQrCode, updateQrCode, uploadFileToBackend, updateFile } from '../../../../services/api';
import { DEFAULT_DOMAIN, ShortenedLink, CreateMode, QRCustomization, SmartLinkPreview, GeoConfig, DeepLinkConfig, LeadLockConfig, TrustBadgeConfig, SmartActionConfig } from '../types';

interface UseCreateHandlerProps {
  user: any;
  mode: CreateMode;
  selectedDomain: string;
  urlInput: string;
  qrText: string;
  campaignName?: string; // Optional new prop
  utmSource?: string;
  utmMedium?: string;
  selectedFile: File | null;
  customAlias: string;
  password: string;
  expirationDays: number | '';
  maxClicks: number | '';
  qrCustomization: QRCustomization;
  isEditMode: boolean;
  editQRId: string | null;
  qrType: "static" | "dynamic";
  featureAccess: any;
  checkAccess: any;
  showUpgradeModal: any;
  planInfo: any;
  handleApiError: (error: any) => boolean;
  setErrorMessage: (msg: string | null) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  showSecurityBlockedUI: () => void;
  isMounted: React.MutableRefObject<boolean>;

  // New Configs
  smartLinkPreview: SmartLinkPreview;
  geoConfig: GeoConfig;
  deepLinkConfig: DeepLinkConfig;
  leadLockConfig: LeadLockConfig;
  trustBadgeConfig: TrustBadgeConfig;
  smartActionConfig: SmartActionConfig;
}

export const useCreateHandler = (props: UseCreateHandlerProps) => {
  const {
    user,
    mode,
    selectedDomain,
    urlInput,
    qrText,
    campaignName,
    utmSource,
    utmMedium,
    selectedFile,
    customAlias,
    password,
    expirationDays,
    maxClicks,
    qrCustomization,
    isEditMode,
    editQRId,
    qrType,
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
    trustBadgeConfig,
    smartActionConfig
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ShortenedLink | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showQRSuccessModal, setShowQRSuccessModal] = useState(false);

  const handleSuccess = async (newLink: any, resetForm: () => void) => {
    setResult(newLink);
    resetForm();

    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!isMounted.current) return;

    setIsLoading(false);

    // Show appropriate success modal
    if (mode === 'qr') {
      // Ensure QR code is generated and ready
      if (qrText && canvasRef.current) {
        try {
          console.log('Final QR generation before modal...');
          await QRCode.toCanvas(canvasRef.current, qrText, {
            width: qrCustomization.size,
            margin: qrCustomization.margin,
            color: {
              dark: qrCustomization.foregroundColor,
              light: qrCustomization.backgroundColor
            },
            errorCorrectionLevel: qrCustomization.errorCorrectionLevel
          });
        } catch (error) {
          console.error('Final QR generation error:', error);
          toast.error('QR generation failed, but modal will still open with regeneration option');
        }
      }
      setShowQRSuccessModal(true);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleCreate = async (resetForm: () => void) => {
    console.log('🚀 handleCreate called. Mode:', mode);
    const toastId = toast.loading('Processing request...');

    if (mode === 'url' && !urlInput.trim()) { toast.error('URL is empty'); return; }
    if (mode === 'qr' && !qrText.trim()) { toast.error('QR text is empty'); return; }
    if (mode === 'file' && !selectedFile) { toast.error('No file selected'); return; }

    // For free users, clear any premium field values
    const finalCustomAlias = featureAccess.canUseCustomAlias ? customAlias : '';
    const finalPassword = featureAccess.canUsePasswordProtection ? password : '';
    const finalExpirationDays = featureAccess.canUseLinkExpiration ? expirationDays : '';
    const finalMaxClicks = featureAccess.canUseClickLimits ? maxClicks : '';

    const finalQrCustomization = {
      ...qrCustomization,
      foregroundColor: featureAccess.canUseCustomQRColors ? qrCustomization.foregroundColor : '#000000',
      backgroundColor: featureAccess.canUseCustomQRColors ? qrCustomization.backgroundColor : '#FFFFFF',
      logo: featureAccess.canUseQRLogo ? qrCustomization.logo : undefined,
      centerText: featureAccess.canUseQRBranding ? qrCustomization.centerText : undefined
    };

    // Check subscription limits
    if (user?.id) {
      try {
        const action = mode === 'url' ? 'create-url' : mode === 'qr' ? 'create-qr' : 'upload-file';
        const accessCheck = await checkAccess(action);

        if (!accessCheck.hasAccess) {
          toast.error(`Limit reached: ${accessCheck.message}`, { id: toastId });
          showUpgradeModal('daily-limit', accessCheck.message);
          return;
        }

        if (mode === 'qr') {
          const hasCustomization = qrCustomization.foregroundColor !== '#000000' ||
            qrCustomization.backgroundColor !== '#FFFFFF' ||
            qrCustomization.logo ||
            qrCustomization.frameStyle !== 'none';

          if (hasCustomization && !(await checkAccess('customize-qr')).hasAccess) {
            toast.error('Upgrade required for customization', { id: toastId });
            showUpgradeModal('customize-qr');
            return;
          }
        }

        if (mode === 'file' && selectedFile) {
          const maxSizeMB = planInfo?.maxFileSizeMB || 5;
          const fileSizeMB = selectedFile.size / (1024 * 1024);

          if (fileSizeMB > maxSizeMB) {
            toast.error(`File too large (> ${maxSizeMB}MB)`, { id: toastId });
            showUpgradeModal('file-size', `File size exceeds ${maxSizeMB}MB limit.`);
            return;
          }
        }
      } catch (error) {
        console.error('Access check failed, allowing basic functionality:', error);
      }
    }

    setIsLoading(true);
    setErrorMessage(null);
    // toast.dismiss(toastId); // Keep it alive for updates

    try {
      const shortCode = finalCustomAlias || Math.random().toString(36).substr(2, 7);
      const baseUrl = window.location.origin;
      let originalUrl = '';
      let uploadedFileCode = ''; // Store fileCode for later update

      if (mode === 'url') {
        originalUrl = urlInput;
      } else if (mode === 'qr') {
        originalUrl = qrText;
      } else if (mode === 'file' && selectedFile) {
        console.log('Pf Uploading file:', selectedFile.name);
        toast.loading('Uploading file to server...', { id: toastId });

        const reader = new FileReader();
        await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(selectedFile);
        });

        try {
          const fileResult = await uploadFileToBackend(selectedFile, {
            userId: user?.id || 'anonymous-user',
            title: selectedFile.name,
            description: 'Uploaded via Dashboard',
            isPublic: true
          });

          console.log('📂 File upload result:', fileResult);

          if (fileResult.success) {
            originalUrl = fileResult.data.fileUrl;
            uploadedFileCode = fileResult.data.fileCode; // Capture fileCode
            console.log('✅ File uploaded, originalUrl set to:', originalUrl);
            toast.success('File uploaded! Generating link...', { id: toastId });
          } else {
            console.error('❌ File upload failed:', fileResult);
            toast.error(`Upload failed: ${fileResult.message}`, { id: toastId });
            throw new Error(fileResult.message || 'File upload failed');
          }
        } catch (error: any) {
          console.error('File upload error:', error);
          toast.error(`File upload error: ${error.message}`, { id: toastId });
          if (handleApiError(error)) {
            setIsLoading(false);
            return;
          }
          setIsLoading(false);
          return;
        }
      }

      const finalDomain = selectedDomain === DEFAULT_DOMAIN ? baseUrl : `https://${selectedDomain}`;

      // Initialize shortUrl based on type and features
      let initialShortUrl = `${finalDomain}/${shortCode}`; // Default for Links

      if (mode === 'qr') {
        if (trustBadgeConfig.requested) {
          // Feature: Trust Badge -> Always use /verified/ link (Option 3 for Static)
          initialShortUrl = `${finalDomain}/verified/${shortCode}`;
        } else if (qrType === 'static') {
          // Pure Static -> Use Original URL (empty shortUrl triggers fallback)
          initialShortUrl = '';
        } else {
          // Standard Dynamic QR -> Use /q/ link
          initialShortUrl = `${finalDomain}/q/${shortCode}`;
        }
      }

      const newLink: ShortenedLink = {
        id: Date.now().toString(),
        shortCode,
        shortUrl: initialShortUrl,
        originalUrl,
        title: mode === 'url'
          ? (campaignName || `Dashboard URL - ${shortCode}`)
          : mode === 'file'
            ? (selectedFile?.name || `File Share - ${shortCode}`)
            : (campaignName || smartLinkPreview.title || `Dashboard QR - ${shortCode}`),
        clicks: 0,
        createdAt: new Date().toISOString(),
        customDomain: selectedDomain !== DEFAULT_DOMAIN ? selectedDomain : undefined,
        type: mode,
        qrCustomization: mode === 'qr' ? qrCustomization : undefined,
        smartLinkPreview: featureAccess.canUseWhatsAppPreview ? smartLinkPreview : undefined,
        geoConfig: featureAccess.canUseGeoRedirect ? geoConfig : undefined,
        deepLinkConfig: featureAccess.canUseDeepLinks ? deepLinkConfig : undefined,
        leadLockConfig: featureAccess.canUseLeadLock ? leadLockConfig : undefined,
        trustBadgeConfig: featureAccess.canUseTrustBadge ? trustBadgeConfig : undefined,
        smartActionConfig
      };

      console.log('🚀 Creating Link/QR (Smart Logic):', { mode, qrType, trust: trustBadgeConfig.requested, initialShortUrl }); // Debug log

      try {
        let backendResult;

        // Construct Payload with new features
        const commonPayload = {
          userId: user?.id || 'anonymous-user',
          title: mode === 'url'
            ? (campaignName || `Dashboard URL - ${shortCode}`)
            : mode === 'file'
              ? (selectedFile?.name || `File Share - ${shortCode}`)
              // Use campaignName if available, else fallback
              : (campaignName || smartLinkPreview.title || `Dashboard QR - ${shortCode}`),
          description: 'Created via Dashboard',

          // Legacy Features
          customAlias: finalCustomAlias || undefined,
          password: finalPassword || undefined,
          expirationDays: finalExpirationDays ? parseInt(finalExpirationDays.toString()) : undefined,
          maxClicks: finalMaxClicks ? parseInt(finalMaxClicks.toString()) : undefined,
          customDomain: selectedDomain !== DEFAULT_DOMAIN ? selectedDomain : undefined,
          shortCode: shortCode, // Explicitly send generated code so backend matches

          // UTM Campaign Tracking
          utmSource: utmSource || undefined,
          utmMedium: utmMedium || undefined,
          utmCampaign: campaignName ? campaignName.trim().toLowerCase().replace(/\s+/g, '_') : undefined,

          // New Advanced Features
          smartLinkPreview: newLink.smartLinkPreview,
          geoConfig: newLink.geoConfig,
          deepLinkConfig: newLink.deepLinkConfig,
          leadLockConfig: newLink.leadLockConfig,
          trustBadgeConfig: newLink.trustBadgeConfig,
          smartActionConfig: newLink.smartActionConfig
        };

        if (mode === 'url' || mode === 'file') {
          console.log('🚀 Calling createShortUrl with:', { originalUrl, ...commonPayload });
          backendResult = await createShortUrl({
            originalUrl: originalUrl,
            ...commonPayload
          });
          console.log('📡 createShortUrl result:', backendResult);
        } else if (mode === 'qr') {
          // Flatten advanced customization fields for the backend
          const qrPayload = {
            ...commonPayload,
            content: originalUrl,
            contentType: 'TEXT',
            foregroundColor: finalQrCustomization.foregroundColor,
            backgroundColor: finalQrCustomization.backgroundColor,
            size: finalQrCustomization.size,
            style: finalQrCustomization.pattern || 'square', // Backend 'style' maps to 'pattern' usually, or keep 'square' as fallback
            isDynamic: qrType === 'dynamic',
            // Pass all advanced fields
            pattern: finalQrCustomization.pattern,
            frameStyle: finalQrCustomization.frameStyle,
            frameColor: finalQrCustomization.frameColor,
            frameText: finalQrCustomization.frameText,
            frameTextColor: finalQrCustomization.frameTextColor,
            gradientType: finalQrCustomization.gradientType,
            gradientDirection: finalQrCustomization.gradientDirection,
            secondaryColor: finalQrCustomization.secondaryColor,
            centerText: finalQrCustomization.centerText,
            centerTextColor: finalQrCustomization.centerTextColor,
            centerTextFontSize: finalQrCustomization.centerTextFontSize,
            centerTextFontFamily: finalQrCustomization.centerTextFontFamily,
            centerTextBackgroundColor: finalQrCustomization.centerTextBackgroundColor,
            centerTextBold: finalQrCustomization.centerTextBold,
            centerTextOpacity: finalQrCustomization.centerTextOpacity,
            centerTextBackgroundOpacity: finalQrCustomization.centerTextBackgroundOpacity,
            centerTextBackgroundRadius: finalQrCustomization.centerTextBackgroundRadius,
            logoSize: finalQrCustomization.logoSize,
            logoOpacity: finalQrCustomization.logoOpacity,
            logoCornerRadius: finalQrCustomization.logoCornerRadius,
            trustBadge: trustBadgeConfig.requested,
            margin: finalQrCustomization.margin,
            logoUrl: finalQrCustomization.logo // Pass logo as logoUrl
          };

          if (isEditMode && editQRId) {
            backendResult = await updateQrCode(editQRId, qrPayload);
          } else {
            backendResult = await createQrCode(qrPayload);
          }
        }

        if (backendResult && backendResult.success) {
          console.log('✅ Backend QR Creation Success:', backendResult); // Debug Log

          if (backendResult.data) {
            console.log('📦 Backend Data:', backendResult.data);

            // Use the backend-computed shortUrl (matches the actual QR redirect URL format)
            if (backendResult.data.shortUrl) {
              console.log('🔗 Updating shortUrl from backend:', backendResult.data.shortUrl);
              newLink.shortUrl = backendResult.data.shortUrl;
            } else {
              console.warn('⚠️ No shortUrl in backend response!', backendResult.data);
            }

            newLink.id = backendResult.data.id || newLink.id;
            newLink.shortCode = backendResult.data.shortCode || newLink.shortCode;
          } else {
            console.warn('⚠️ Backend success but no data!');
          }

          console.log('🏁 Final newLink object:', newLink);


          toast.success(isEditMode ? 'QR code updated successfully!' : 'Link created!', { id: toastId });

          // If mode is file, update the file record with the shortUrl
          if (mode === 'file' && newLink.shortUrl && uploadedFileCode) {
            try {
              console.log('📝 Updating file record with shortUrl:', uploadedFileCode);
              await updateFile(uploadedFileCode, {
                userId: user?.id,
                shortUrl: newLink.shortUrl
              });
            } catch (err) {
              console.error('Failed to update file with shortUrl', err);
            }
          }

          await handleSuccess({ ...newLink }, resetForm); // Spread to force new reference
        } else {
          // ... Error handling logic is preserved
          console.error('Backend save failed:', backendResult);

          // CRITICAL: Check for security violation in the response object
          const backendErrorMsg = backendResult?.message || 'Failed to save to database';

          // Create a mock error object to pass to handleApiError logic
          const mockError = {
            message: backendErrorMsg,
            response: {
              data: {
                message: backendErrorMsg,
                error: backendResult?.error || 'UNKNOWN_ERROR'
              }
            }
          };

          if (handleApiError(mockError)) {
            setIsLoading(false);
            return;
          }

          toast.error(backendErrorMsg, { id: toastId });
          setErrorMessage(backendErrorMsg);
          setIsLoading(false);
          return;
        }
      } catch (error: any) {
        // ... Error handling logic
        console.error('Error saving to backend:', error);
        if (handleApiError(error)) {
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        return;
      }

    } catch (error: any) {
      console.error('Error creating link:', error);
      toast.error(`Error: ${error.message || 'Unknown error'}`, { id: toastId });
      setIsLoading(false);
      if (handleApiError(error)) {
        return;
      }
    }
  };

  return {
    handleCreate,
    isLoading,
    result,
    showSuccessModal,
    setShowSuccessModal,
    showQRSuccessModal,
    setShowQRSuccessModal
  };
};
