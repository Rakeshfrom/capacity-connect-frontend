import { useEffect } from 'react';

declare global {
  interface Window {
    gtranslateSettings?: Record<string, unknown>;
  }
}

const GTranslate = () => {
  useEffect(() => {
    if (document.querySelector('script[data-gtranslate]')) return;

    window.gtranslateSettings = {
      default_language: 'en',
      languages: ['en', 'hi'],
      wrapper_selector: '#capacity-connect-language',
      native_language_names: true,
    };

    const script = document.createElement('script');
    script.src = 'https://cdn.gtranslate.net/widgets/latest/dropdown.js';
    script.async = true;
    script.setAttribute('data-gtranslate', 'true');
    document.body.appendChild(script);
  }, []);

  return <div id="capacity-connect-language" />;
};

export default GTranslate;
