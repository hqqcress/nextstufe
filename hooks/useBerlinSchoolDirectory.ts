import { useCallback, useEffect, useRef, useState } from 'react';

import { loadBerlinSchools, type BerlinSchool } from '@/lib/berlinSchools';

interface BerlinSchoolDirectoryState {
  schools: BerlinSchool[];
  status: 'loading' | 'ready' | 'error';
  retry: () => void;
}

export function useBerlinSchoolDirectory(): BerlinSchoolDirectoryState {
  const [schools, setSchools] = useState<BerlinSchool[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const isMounted = useRef(true);

  const loadDirectory = useCallback(() => {
    void loadBerlinSchools()
      .then((items) => {
        if (!isMounted.current) return;
        setSchools(items);
        setStatus('ready');
      })
      .catch(() => {
        if (isMounted.current) setStatus('error');
      });
  }, []);

  useEffect(() => {
    isMounted.current = true;
    loadDirectory();

    return () => {
      isMounted.current = false;
    };
  }, [loadDirectory]);

  const retry = useCallback(() => {
    setStatus('loading');
    loadDirectory();
  }, [loadDirectory]);

  return { schools, status, retry };
}
