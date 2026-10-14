'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseCaseStudyDataOptions<T> {
  projectId: string;
  endpoint: string;
  initialData?: T | null;
}

export function useCaseStudyData<T>({
  projectId: _projectId,
  endpoint,
  initialData,
}: UseCaseStudyDataOptions<T>) {
  const [data, setData] = useState<T | null>(initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isLiveDb, setIsLiveDb] = useState<boolean>(
    Boolean((initialData as any)?.isLiveDb)
  );
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(endpoint);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setIsLiveDb(json.source === 'mysql' || Boolean(json.data?.isLiveDb));
        setError(null);
      } else {
        throw new Error(json.message || 'Failed to load case study data');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    // If we already have initialData from server SSR, we can do a background revalidate
    let active = true;

    fetch(endpoint)
      .then((r) => r.json())
      .then((json) => {
        if (active && json.success && json.data) {
          setData(json.data);
          setIsLiveDb(json.source === 'mysql' || Boolean(json.data?.isLiveDb));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (active && !initialData) {
          setError(err instanceof Error ? err.message : String(err));
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [endpoint, initialData]);

  return { data, isLoading, isLiveDb, error, reload };
}
