import { useEffect, useState } from 'react';

export function useFeatures() {
  const [features, setFeatures] = useState<any>({});

  useEffect(() => {
    fetch('/api/admin/features').then(r => r.json()).then(setFeatures);
  }, []);

  return features;
}
