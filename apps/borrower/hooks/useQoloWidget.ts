import { useCallback, useEffect, useRef, useState } from 'react';

interface UseQoloWidgetOptions {
  containerId: string;
  showWidget: boolean;
  onHideWidget: () => void;
  onCleanup?: () => void;
  autoHideMs?: number;
}

interface UseQoloWidgetReturn {
  iframeReady: boolean;
  onWidgetSuccess: () => void;
}

export default function useQoloWidget({
  containerId,
  showWidget,
  onHideWidget,
  onCleanup,
  autoHideMs = 30000,
}: UseQoloWidgetOptions): UseQoloWidgetReturn {
  const [iframeReady, setIframeReady] = useState(false);
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onHideWidgetRef = useRef(onHideWidget);
  const onCleanupRef = useRef(onCleanup);

  // Keep refs current without triggering effect re-runs
  onHideWidgetRef.current = onHideWidget;
  onCleanupRef.current = onCleanup;

  const clearAutoHideTimer = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  }, []);

  // Reset state and clear stale iframes when widget is hidden
  useEffect(() => {
    if (!showWidget) {
      setIframeReady(false);
      clearAutoHideTimer();

      // Remove old iframes so the next show cycle starts clean
      const container = document.getElementById(containerId);
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }

      onCleanupRef.current?.();
    }
  }, [showWidget, clearAutoHideTimer, containerId]);

  const onWidgetSuccess = useCallback(() => {
    if (!showWidget) return;
    setIframeReady(true);
  }, [showWidget]);

  // Start auto-hide timer when iframe becomes ready
  useEffect(() => {
    if (!iframeReady || !showWidget) return;

    clearAutoHideTimer();
    autoHideTimerRef.current = setTimeout(() => {
      onHideWidgetRef.current();
    }, autoHideMs);

    return () => {
      clearAutoHideTimer();
    };
  }, [iframeReady, showWidget, autoHideMs, clearAutoHideTimer]);

  return { iframeReady, onWidgetSuccess };
}
