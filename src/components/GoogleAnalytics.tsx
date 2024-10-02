import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (type: string, action: string, params: object) => void;
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-9YVR3Q7R2Z', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;