import { useEffect, useRef, useState } from 'react';
import PublicIcon from '@mui/icons-material/Public';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Box, Button } from '@mui/material';

declare global {
  interface Window {
    gtranslateSettings?: Record<string, unknown>;
  }
}

const GTranslate = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState('EN');

  useEffect(() => {
    window.gtranslateSettings = {
      default_language: 'en',
      languages: ['en', 'hi'],
      wrapper_selector: '#capacity-connect-language',
      native_language_names: true,
    };

    const existing = document.querySelector(
      'script[src="https://cdn.gtranslate.net/widgets/latest/dropdown.js"]'
    );

    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://cdn.gtranslate.net/widgets/latest/dropdown.js';
      script.defer = true;
      document.body.appendChild(script);
    }

    const syncLanguage = () => {
      const select = wrapperRef.current?.querySelector(
        'select'
      ) as HTMLSelectElement | null;

      if (!select) return;

      const value = select.value?.toLowerCase() || 'en';
      setLanguage(value === 'hi' || value.includes('hindi') ? 'HI' : 'EN');
    };

    const observer = new MutationObserver(() => {
      const select = wrapperRef.current?.querySelector(
        'select'
      ) as HTMLSelectElement | null;

      if (select) {
        select.addEventListener('change', syncLanguage);
        syncLanguage();
      }
    });

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current, {
        childList: true,
        subtree: true,
      });
    }

    const timer = window.setTimeout(syncLanguage, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: 72,
        height: 38,
        flexShrink: 0,
      }}
    >
      <Button
        variant="outlined"
        startIcon={<PublicIcon sx={{ fontSize: 18 }} />}
        endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 17 }} />}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          minWidth: 0,
          borderRadius: 2,
          borderColor: '#D6E2EA',
          color: '#36546D',
          bgcolor: '#fff',
          fontSize: '0.78rem',
          fontWeight: 650,
          textTransform: 'none',
          px: 1,
          zIndex: 1,
          pointerEvents: 'none',
          '& .MuiButton-startIcon': {
            mr: 0.25,
          },
          '& .MuiButton-endIcon': {
            ml: 0.1,
          },
        }}
      >
        {language}
      </Button>

      <Box
        ref={wrapperRef}
        id="capacity-connect-language"
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          '& select': {
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
            position: 'absolute',
            inset: 0,
          },
          '& .gt_switcher': {
            width: '100% !important',
            height: '100% !important',
          },
          '& .gt_option': {
            zIndex: 20,
          },
        }}
      />
    </Box>
  );
};

export default GTranslate;
