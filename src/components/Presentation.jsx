import React, { useEffect, useState } from 'react';
import './Presentation.css'; // Importation directe de tes styles purs !

export default function Presentation() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [buttonText, setButtonText] = useState('Installer');
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // 1. Détection du système iOS (Apple)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent) || 
                           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // Détecte aussi les iPads récents
    setIsIOS(isIphoneOrIpad);

    if (isIphoneOrIpad) {
      setButtonText("Installer l'application");
    }

    // 2. Détection du mode autonome (PWA déjà installée)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) {
      window.location.href = '/app';
    }

    // 3. Gestionnaires d'événements pour Android / Windows / Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isIphoneOrIpad) {
        setButtonText('Installer');
      }
    };

    const handleAppInstalled = () => {
      console.log('CHAMPION a été installé avec succès !');
      setButtonText("Ouvrir l'application");
      setDeferredPrompt(null);
      window.location.href = '/app';
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // Si l'utilisateur est sur iOS, on ouvre le guide visuel d'installation
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // Si l'application est déjà installée ou si le prompt Chrome n'est pas dispo, direction l'app
    if (buttonText.includes('Ouvrir') || !deferredPrompt) {
      window.location.href = '/app';
      return;
    }

    // Lancement du prompt d'installation officiel de Chrome/Android/Edge
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setButtonText("Ouvrir l'application");
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="presentation-body">
      <main className="container">
        
        <div className="logo-wrapper">
          <img 
            src="./logo 500x500.png" 
            alt="Champion Logo" 
            className="app-logo" 
          />
        </div>

        <div className="content-wrapper">
          <h1 className="app-title">Champion</h1>
          <p className="app-tagline">Débout champion</p>
          
          <div className="action-area">
            <button 
              onClick={handleInstallClick} 
              className="btn-primary"
            >
              {buttonText}
            </button>
            <span className="badge-free">Application gratuite</span>
          </div>
        </div>

      </main>

      {/* 🍏 POP-UP D'INSTALLATION DE STYLE APPLE POUR IOS */}
      {isIOS && showIOSModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            backgroundColor: '#1E1E1E',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '28px 20px',
            maxWidth: '320px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            color: '#ffffff'
          }}>
            
            {/* Petit indicateur de drag type iOS */}
            <div style={{
              width: '40px',
              height: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '3px',
              margin: '-12px auto 16px auto'
            }}></div>

            <img 
              src="./logo 500x500.png" 
              alt="Logo Champion" 
              style={{ width: '70px', height: '70px', borderRadius: '16px', marginBottom: '16px' }}
            />
            
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
              Installer Champion
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px', padding: '0 10px' }}>
              Ajoute l'application à ton écran d'accueil pour y accéder à tout moment.
            </p>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '1.6rem', background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '12px' }}>📤</span>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>
                  1. Appuie sur le bouton de <strong>Partage</strong> tout en bas dans la barre d'outils de Safari.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '1.6rem', background: 'rgba(255,255,255,0.08)', padding: '8px', borderRadius: '12px' }}>➕</span>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>
                  2. Fais défiler les options et sélectionne <strong>« Sur l'écran d'accueil »</strong>.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowIOSModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}