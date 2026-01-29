import { useState } from 'react';
import * as QRCode from 'qrcode'; // Need for final generation
import { toast } from 'react-hot-toast';
import { createShortUrl, createQrCode, updateQrCode, uploadFileToBackend } from '../../../../services/api';
import { DEFAULT_DOMAIN, ShortenedLink, CreateMode, QRCustomization, SmartLinkPreview, GeoConfig, DeepLinkConfig, LeadLockConfig, TrustBadgeConfig, SmartActionConfig } from '../types';

interface UseCreateHandlerProps {
  user: any;
  mode: CreateMode;
  selectedDomain: string;
  urlInput: string;
  qrText: string;
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
    if (mode === 'url' && !urlInput.trim()) return;
    if (mode === 'qr' && !qrText.trim()) return;
    if (mode === 'file' && !selectedFile) return;

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
        const action = mode === 'url' ? 'create-url' : mode === 'qr' ? 'create-qr' : 'create-file';
        const accessCheck = await checkAccess(action);

        if (!accessCheck.hasAccess) {
          showUpgradeModal('daily-limit', accessCheck.message);
          return;
        }

        if (mode === 'qr') {
          const hasCustomization = qrCustomization.foregroundColor !== '#000000' ||
            qrCustomization.backgroundColor !== '#FFFFFF' ||
            qrCustomization.logo ||
            qrCustomization.frameStyle !== 'none';

          if (hasCustomization && !(await checkAccess('customize-qr')).hasAccess) {
            showUpgradeModal('customize-qr');
            return;
          }
        }

        if (mode === 'file' && selectedFile) {
          const maxSizeMB = planInfo?.maxFileSizeMB || 5;
          const fileSizeMB = selectedFile.size / (1024 * 1024);

          if (fileSizeMB > maxSizeMB) {
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

    try {
      const shortCode = finalCustomAlias || Math.random().toString(36).substr(2, 7);
      const baseUrl = window.location.origin;
      let originalUrl = '';

      if (mode === 'url') {
        originalUrl = urlInput;
      } else if (mode === 'qr') {
        originalUrl = qrText;
      } else if (mode === 'file' && selectedFile) {
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

          if (fileResult.success) {
            originalUrl = fileResult.data.fileUrl;
            toast.success('File uploaded to database successfully!');
          } else {
            throw new Error(fileResult.message || 'File upload failed');
          }
        } catch (error) {
          console.error('File upload error:', error);
          if (handleApiError(error)) {
            setIsLoading(false);
            return;
          }
          setIsLoading(false);
          return;
        }
      }

      const finalDomain = selectedDomain === DEFAULT_DOMAIN ? baseUrl : `https://${selectedDomain}`;

      const newLink: ShortenedLink = {
        id: Date.now().toString(),
        shortCode,
        shortUrl: `${finalDomain}/${shortCode}`,
        originalUrl,
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

      try {
        let backendResult;

        // Construct Payload with new features
        const commonPayload = {
          userId: user?.id || 'anonymous-user',
          title: mode === 'url' ? `Dashboard URL - ${shortCode}` : `Dashboard QR - ${shortCode}`,
          description: 'Created via Dashboard',

          // Legacy Features
          customAlias: finalCustomAlias || undefined,
          password: finalPassword || undefined,
          expirationDays: finalExpirationDays ? parseInt(finalExpirationDays.toString()) : undefined,
          maxClicks: finalMaxClicks ? parseInt(finalMaxClicks.toString()) : undefined,
          customDomain: selectedDomain !== DEFAULT_DOMAIN ? selectedDomain : undefined,
          shortCode: shortCode, // Explicitly send generated code so backend matches

          // New Advanced Features (These will be ignored by backend if not implemented yet, or stored in generic metadata)
          // Ideally, the backend expects these specific fields if updated. 
          // Assuming we send them as part of the body.
          smartLinkPreview: newLink.smartLinkPreview,
          geoConfig: newLink.geoConfig,
          deepLinkConfig: newLink.deepLinkConfig,
          leadLockConfig: newLink.leadLockConfig,
          trustBadgeConfig: newLink.trustBadgeConfig,
          smartActionConfig: newLink.smartActionConfig
        };

        if (mode === 'url') {
          backendResult = await createShortUrl({
            originalUrl: originalUrl,
            ...commonPayload
          });
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
            trustBadge: finalQrCustomization.trustBadge,
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
          if (backendResult.data && backendResult.data.shortUrl) {
            newLink.shortUrl = backendResult.data.shortUrl;
            newLink.id = backendResult.data.id || newLink.id;
            newLink.shortCode = backendResult.data.shortCode || newLink.shortCode;
          }

          toast.success(isEditMode ? 'QR code updated successfully!' : 'Link created and saved to database!');
          await handleSuccess(newLink, resetForm);
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

          toast.error(backendErrorMsg);
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
