import { useEffect, useRef } from 'react';
import { submissionApi } from '../api/submissionApi';
import type { Answer } from '../types';

export function useAutosave(submissionId: string | null, answers: Record<string, Answer>) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!submissionId) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    
    timerRef.current = window.setTimeout(() => {
      const payload = Object.values(answers);
      if (payload.length) {
        submissionApi.save(submissionId, payload).catch(() => {});
      }
    }, 3000);

    return () => { 
      if (timerRef.current) window.clearTimeout(timerRef.current); 
    };
  }, [answers, submissionId]);
}