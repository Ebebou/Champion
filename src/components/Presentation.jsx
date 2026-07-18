import React, { useEffect, useState } from 'react';
import './Presentation.css';

export default function Presentation() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [buttonText, setButtonText] = useState('Installer');
  
  // TOUTES les variables de détection sont déclarées ici pour éviter l'erreur !
  const [isIOS, setIsIOS] = useState(false);
  const [isAppleSafari, setIsAppleSafari] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // 1. Détecter l'iPhone / iPad pur (isIOS)
    const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent) || 
                           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIphoneOrIpad);

    // 2. Détecter si c'est Safari globalement
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    setIsAppleSafari(isSafari);

    // 3. Détecter si c'est un Mac de bureau
    const isMacbook = /macintosh|macintel/.test(userAgent) && !window.navigator.maxTouchPoints;
    setIsMac(isMacbook);

    if (isSafari || isIphoneOrIpad) {
      setButtonText("Installer l'application");
    }

    // 4. Redirection si l'application est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone;

    if (isStandalone) {
      window.location.href = '/app';
    }

    // 5. Gestionnaire d'installation Android / Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isSafari && !isIphoneOrIpad) {
        setButtonText('Installer');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    // Si Safari ou iOS, on ouvre le pop-up d'aide
    if (isAppleSafari || isIOS) {
      setShowInstallModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        window.location.href = '/app';
      }
      return;
    }

    window.location.href = '/app';
  };

  return (
    <div className="presentation-body" style={{ minHeight: '100vh', position: 'relative' }}>
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

      {/* Pop-up d'aide universel Apple */}
      {(isAppleSafari || isIOS) && showInstallModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1E1E1E',
            borderRadius: '20px',
            padding: '25px 20px',
            maxWidth: '310px',
            width: '100%',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <img 
              src="/logo 500x500.png" 
              alt="Logo" 
              style={{ width: '60px', height: '60px', borderRadius: '12px', marginBottom: '15px' }}
            />
            <h2 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>Installer Champion</h2>
            <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '0 0 20px 0', lineHeight: '1.4' }}>
              Ajoute l'application sur ton {isMac ? 'Mac' : "écran d'accueil"} pour y accéder en un clic.
            </p>

            <div style={{ textAlign: 'left', fontSize: '0.85rem', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isMac ? (
                <>
                  <p style={{ margin: 0 }}>
                    <strong>1.</strong> Clique sur l'icône de partage <strong>📤</strong> en haut à droite de Safari.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>2.</strong> Choisis l'option <strong>« Ajouter au Dock... »</strong> ➕.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ margin: 0 }}>
                    <strong>1.</strong> Appuie sur le bouton de partage <strong>📤</strong> tout en bas de l'écran.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>2.</strong> Fais défiler et sélectionne <strong>« Sur l'écran d'accueil »</strong> ➕.
                  </p>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => window.location.href = '/app'}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Plus tard
              </button>
              <button 
                onClick={() => setShowInstallModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}