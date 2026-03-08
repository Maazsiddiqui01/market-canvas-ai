import { useEffect } from 'react';

export const useDocumentTitle = (title: string, description?: string) => {
  useEffect(() => {
    const prev = document.title;
    document.title = title;

    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (meta) {
        meta.setAttribute('content', description);
      }
    }

    return () => {
      document.title = prev;
    };
  }, [title, description]);
};
