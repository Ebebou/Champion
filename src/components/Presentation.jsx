import React, { useEffect, useState } from 'react';
import './Presentation.css'; // Importation directe de tes styles purs !

export default function Presentation() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [buttonText, setButtonText] = useState('Installer');
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstruction, setShowIOSInstruction] = useState(false);

  useEffect(() => {
    // 1. Détection du système iOS (Apple)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIphoneOrIpad);

    if (isIphoneOrIpad) {
      setButtonText("Comment installer");
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
    // Si l'utilisateur est sur iPhone, on lui affiche le guide visuel sous le bouton
    if (isIOS) {
      setShowIOSInstruction(!showIOSInstruction);
      return;
    }

    // Si l'application est déjà installée ou si le prompt Chrome n'est pas dispo, on va sur l'app
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
            src="/logo 500x500.png" 
            alt="Champion Logo" 
            className="app-logo" 
          />
        </div>

        <div className="content-wrapper">
          <h1 className="app-title">Champion</h1>
          <p className="app-tagline">Débout champion</p>
          
          <div className="action-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={handleInstallClick} 
              className="btn-primary"
            >
              {buttonText}
            </button>
            <span className="badge-free">Application gratuite</span>

            {/* Section d'instructions animée pour iOS */}
            {isIOS && showIOSInstruction && (
              <div style={{
                marginTop: '15px',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                color: '#ffffff',
                maxWidth: '290px',
                textAlign: 'left',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ffcc00' }}>
                  Suis ces étapes rapides sur Safari :
                </p>
                <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>
                    Appuie sur le bouton de <strong>Partage</strong> <span style={{ fontSize: '1.1rem' }}>📤</span> tout en bas (ou en haut sur iPad).
                  </li>
                  <li>
                    Fais défiler les options et sélectionne <strong>« Sur l'écran d'accueil »</strong> <span style={{ fontSize: '1.1rem' }}>➕</span>.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}