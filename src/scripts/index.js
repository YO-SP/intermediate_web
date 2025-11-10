import '../styles/styles.css';
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('authToken');

 
  if (token) {
    if (!window.location.hash || window.location.hash === '#/masukAtauDaftar') {
      window.location.hash = '/';
    }
  } else {
    window.location.hash = '/masukAtauDaftar';
  }

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

if ('serviceWorker' in navigator && 'Notification' in window) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Izin notifikasi diberikan.');

        registration.showNotification('Terima kasih sudah mengizinkan notifikasi!');
      } else {
        console.warn('Notifikasi ditolak pengguna.');
      }
    } catch (error) {
      console.error('Gagal registrasi service worker:', error);
    }
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.textContent = '📲 Install Aplikasi';
  installBtn.style.position = 'fixed';
  installBtn.style.bottom = '20px';
  installBtn.style.right = '20px';
  installBtn.style.padding = '10px 15px';
  installBtn.style.background = '#2196f3';
  installBtn.style.color = 'white';
  installBtn.style.border = 'none';
  installBtn.style.borderRadius = '8px';
  installBtn.style.cursor = 'pointer';
  installBtn.style.zIndex = '9999';

  document.body.appendChild(installBtn);

  installBtn.addEventListener('click', async () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    deferredPrompt = null;
  });
});
