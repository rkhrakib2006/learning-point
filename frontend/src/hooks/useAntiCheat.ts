import { useEffect } from 'react';
import { submissionApi } from '../api/submissionApi';

export function useAntiCheat(submissionId: string | null) {
  useEffect(() => {
    if (!submissionId) return;

    const report = (kind: string, detail?: string) => {
      submissionApi.alert(submissionId, kind, detail).catch(() => {});
    };

    const onVis = () => {
      if (document.hidden) report('TAB_SWITCH', 'Tab hidden');
    };
    const onBlur = () => report('BLUR', 'Window lost focus');
    const onCopy = () => report('COPY', 'Copy attempted');

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('blur', onBlur);
    document.addEventListener('copy', onCopy);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('copy', onCopy);
    };
  }, [submissionId]);
}