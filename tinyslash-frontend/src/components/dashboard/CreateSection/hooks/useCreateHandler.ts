import { useState } from 'react';
import * as QRCode from 'qrcode'; // Need for final generation
import { toast } from 'react-hot-toast';
import { createShortUrl, createQrCode, updateQrCode, uploadFileToBackend } from '../../../../services/api';
import { DEFAULT_DOMAIN, ShortenedLink, CreateMode, QRCustomization } from '../types';

export const useCreateHandler = (
  user: any,
  mode: CreateMode,
  selectedDomain: string,
  urlInput: string,
  qrText: string,
  selectedFile: File | null,
  customAlias: string,
  password: string,
  expirationDays: number | '',
  maxClicks: number | '',
  qrCustomization: QRCustomization,
  isEditMode: boolean,
  editQRId: string | null,
  featureAccess: any,
  checkAccess: any,
  showUpgradeModal: any,
  planInfo: any,
  handleApiError: (error: any) => boolean,
  setErrorMessage: (msg: string | null) => void,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  showSecurityBlockedUI: () => void,
  isMounted: React.MutableRefObject<boolean>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ShortenedLink | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showQRSuccessModal, setShowQRSuccessModal] = useState(false);

  // Callbacks to reset form - typically passed from Parent or we return a reset trigger
  // For simplicity, we assume parent handles reset or we return logic to do so.
  // Actually, handleSuccess does the reset in original code. 
  // We can return a "shouldReset" flag or similar, or just return setters.
  // Better: return the handleSuccess function that does the state updates, but it needs access to setters.
  // So we might need to pass setters to this hook. which is getting messy with many args.
  // Alternative: Internalize simple state like "isLoading" here. 

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
      const shortCode = finalCustomAlias || Math.random().toString(36).substr(2, 6);
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
        qrCustomization: mode === 'qr' ? qrCustomization : undefined
      };

      try {
        let backendResult;

        if (mode === 'url') {
          backendResult = await createShortUrl({
            originalUrl: originalUrl,
            userId: user?.id || 'anonymous-user',
            customAlias: finalCustomAlias || undefined,
            password: finalPassword || undefined,
            expirationDays: finalExpirationDays ? parseInt(finalExpirationDays.toString()) : undefined,
            maxClicks: finalMaxClicks ? parseInt(finalMaxClicks.toString()) : undefined,
            title: `Dashboard URL - ${shortCode}`,
            description: 'Created via Dashboard',
            customDomain: selectedDomain !== DEFAULT_DOMAIN ? selectedDomain : undefined
          });
        } else if (mode === 'qr') {
          if (isEditMode && editQRId) {
            backendResult = await updateQrCode(editQRId, {
              userId: user?.id || 'anonymous-user',
              content: originalUrl,
              contentType: 'TEXT',
              title: `Dashboard QR - ${shortCode}`,
              description: 'Updated via Dashboard',
              foregroundColor: finalQrCustomization.foregroundColor,
              backgroundColor: finalQrCustomization.backgroundColor,
              size: finalQrCustomization.size,
              style: 'square'
            });
          } else {
            backendResult = await createQrCode({
              content: originalUrl,
              contentType: 'TEXT',
              userId: user?.id || 'anonymous-user',
              title: `Dashboard QR - ${shortCode}`,
              description: 'Created via Dashboard',
              foregroundColor: finalQrCustomization.foregroundColor,
              backgroundColor: finalQrCustomization.backgroundColor,
              size: finalQrCustomization.size,
              style: 'square'
            });
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
