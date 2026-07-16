import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinished }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 1. Détecter si le téléphone est en mode sombre
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);

    // 2. Masquer le splash screen après 1.5 seconde (1500ms)
    const timer = setTimeout(() => {
      onFinished();
    }, 1500);

    return () => {
      mediaQuery.removeEventListener('change', handler);
      clearTimeout(timer);
    };
  }, [onFinished]);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
        zIndex: 9999,
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* CORRECTION : Choix d'image logique et chemins d'accès absolus propres */}
      <img 
        src={isDarkMode ? "/splashscreens/splash-dark.png" : "/splashscreens/splash-light.png"} 
        alt="Champion Logo" 
        style={{
          width: '190px',
          height: 'auto',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}