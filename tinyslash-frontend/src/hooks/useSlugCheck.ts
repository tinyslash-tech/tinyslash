import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { apiClient } from '../services/api';
import { sanitizeSlug } from '../utils/sanitizeSlug';

export type SlugStatus = 'EMPTY' | 'TOO_SHORT' | 'CHECKING' | 'AVAILABLE' | 'TAKEN' | 'RESERVED' | 'RATE_LIMITED' | 'ERROR';

interface UseSlugCheckResult {
  slug: string;
  setSlug: (slug: string) => void;
  status: SlugStatus;
  suggestions: string[];
  selectSuggestion: (suggested: string) => void;
  reset: () => void;
}

export const useSlugCheck = (initialSlug: string = '', pageId?: string): UseSlugCheckResult => {
  const [slug, setSlug] = useState(initialSlug);
  const [status, setStatus] = useState<SlugStatus>(initialSlug ? 'CHECKING' : 'EMPTY');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debouncedSlug = useDebounce(slug, 400);

  // AbortController ref to cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Track if a suggestion was just selected to skip the next debounced check
  const skipNextCheckRef = useRef(false);

  const reset = useCallback(() => {
    setSlug('');
    setStatus('EMPTY');
    setSuggestions([]);
    skipNextCheckRef.current = false;
  }, []);

  // selectSuggestion: bypasses debounce entirely since suggestions
  // are already verified as available by the backend.
  const selectSuggestion = useCallback((suggested: string) => {
    skipNextCheckRef.current = true;
    setSlug(suggested);
    setStatus('AVAILABLE');
    setSuggestions([]);
  }, []);

  // Instant feedback during typing — only for EMPTY/TOO_SHORT states.
  // For valid-length slugs, show CHECKING to indicate work is pending.
  useEffect(() => {
    // Don't override AVAILABLE status from selectSuggestion
    if (skipNextCheckRef.current) return;

    const sanitized = sanitizeSlug(slug);
    if (!sanitized) {
      setStatus('EMPTY');
      setSuggestions([]);
    } else if (sanitized.length < 3) {
      setStatus('TOO_SHORT');
      setSuggestions([]);
    }
    // For valid slugs, don't change status here — let the debounced check handle it
  }, [slug]);

  // Debounced API check — fires 400ms after the user stops typing
  useEffect(() => {
    // If a suggestion was just selected, skip this check — status is already AVAILABLE
    if (skipNextCheckRef.current) {
      skipNextCheckRef.current = false;
      return;
    }

    const sanitized = sanitizeSlug(debouncedSlug);

    if (!sanitized || sanitized.length < 3) {
      // Already handled by the instant feedback effect
      return;
    }

    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus('CHECKING');
    setSuggestions([]);

    apiClient.get('/pages/check-slug', {
      params: { slug: sanitized, pageId },
      signal: controller.signal
    })
      .then((response) => {
        if (controller.signal.aborted) return;

        const { available, reserved, suggestions: apiSuggestions } = response.data;

        if (reserved) {
          setStatus('RESERVED');
          setSuggestions([]);
        } else if (available) {
          setStatus('AVAILABLE');
          setSuggestions([]);
        } else {
          setStatus('TAKEN');
          setSuggestions(apiSuggestions || []);
        }
      })
      .catch((error: any) => {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return;

        if (error.response?.status === 429) {
          setStatus('RATE_LIMITED');
        } else {
          console.error('Slug check failed:', error);
          setStatus('ERROR');
        }
      });

    // Cleanup on re-render or unmount
    return () => {
      controller.abort();
    };
  }, [debouncedSlug, pageId]);

  return {
    slug,
    setSlug,
    status,
    suggestions,
    selectSuggestion,
    reset
  };
};

// Re-export for backwards compatibility
export { sanitizeSlug } from '../utils/sanitizeSlug';
