import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Kantin Sanata Dharma` : 'Kantin Sanata Dharma';
  }, [title]);
}
