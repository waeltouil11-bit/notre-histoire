// Ton prénom et celui de Naelle
const monPrenom = "Mon Prénom"; // 👈 METS TON PRÉNOM ICI
const nomNaelle = "Naelle";

// Coordonnées : Tanger et Paris (France)
const tangerCoords = [35.7595, -5.8340];
const targetCoords = [48.8566, 2.3522];

// Carte claire
const map = L.map('map', { zoomControl: false }).setView([42, -1], 5);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Centre de la carte
const midLat = (tangerCoords[0] + targetCoords[0]) / 2;
const midLng = (tangerCoords[1] + targetCoords[1]) / 2;
const midCoords = [midLat, midLng];

// Marqueurs avec prénoms
setTimeout(() => {
  const tangerMarker = L.circleMarker(tangerCoords, { color: '#ff416c', fillColor: '#ff416c', fillOpacity: 0.9, radius: 8 }).addTo(map);
  const targetMarker = L.circleMarker(targetCoords, { color: '#ff416c', fillColor: '#ff416c', fillOpacity: 0.9, radius: 8 }).addTo(map);

  tangerMarker.bindTooltip(`📍 Tanger — ${monPrenom}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();
  targetMarker.bindTooltip(`📍 France — ${nomNaelle}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();

  // Trajectoire vers le milieu
  const polyline1 = L.polyline([], { color: '#ff416c', weight: 4, opacity: 0.9 }).addTo(map);
  const polyline2 = L.polyline([], { color: '#ff416c', weight: 4, opacity: 0.9 }).addTo(map);

  let progress = 0;
  const lineInterval = setInterval(() => {
    progress += 0.025;
    
    const lat1 = tangerCoords[0] + (midCoords[0] - tangerCoords[0]) * progress;
    const lng1 = tangerCoords[1] + (midCoords[1] - tangerCoords[1]) * progress;
    polyline1.addLatLng([lat1, lng1]);

    const lat2 = targetCoords[0] + (midCoords[0] - targetCoords[0]) * progress;
    const lng2 = targetCoords[1] + (midCoords[1] - targetCoords[1]) * progress;
    polyline2.addLatLng([lat2, lng2]);

    if (progress >= 1) {
      clearInterval(lineInterval);
      drawHeartShape();
    }
  }, 40);

}, 1000);

// Dessin du Cœur
function drawHeartShape() {
  const leftHeartLine = L.polyline([], { color: '#ff1493', weight: 4, opacity: 0.95 }).addTo(map);
  const rightHeartLine = L.polyline([], { color: '#ff1493', weight: 4, opacity: 0.95 }).addTo(map);

  let step = 0;
  const totalSteps = 100;
  const scaleLat = 1.8;
  const scaleLng = 2.4;

  const heartInterval = setInterval(() => {
    step++;
    const t = (step / totalSteps) * Math.PI;

    const xLeft = -16 * Math.pow(Math.sin(t), 3);
    const yLeft = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    leftHeartLine.addLatLng([midLat + (yLeft / 16) * scaleLat, midLng + (xLeft / 16) * scaleLng]);

    const xRight = 16 * Math.pow(Math.sin(t), 3);
    const yRight = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    rightHeartLine.addLatLng([midLat + (yRight / 16) * scaleLat, midLng + (xRight / 16) * scaleLng]);

    if (step >= totalSteps) {
      clearInterval(heartInterval);
      map.flyTo([midLat - 0.5, midLng], 6, { duration: 2.5 });

      setTimeout(() => document.getElementById('quote-1').classList.add('visible'), 1200);
      setTimeout(() => document.getElementById('quote-2').classList.add('visible'), 3200);
      setTimeout(() => document.getElementById('poem').classList.add('visible'), 5200);
      setTimeout(() => document.getElementById('next-btn').classList.remove('hidden'), 7200);
    }
  }, 25);
}

// Navigation entre les écrans
function goToNextScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Cadenas & Déclenchement de l'avion
function triggerLockError() {
  const errorMsg = document.getElementById('error-message');
  errorMsg.classList.remove('hidden');

  // Lancement de l'animation d'avion 2.5 secondes après l'apparition du message
  setTimeout(() => {
    launchPlaneAnimation();
  }, 2500);
}

// Animation de l'avion et de la fumée
function launchPlaneAnimation() {
  const plane = document.getElementById('plane');
  const smoke = document.getElementById('smoke-overlay');

  plane.style.display = 'block';
  
  // Trajectoire de l'avion à travers l'écran
  let pos = -60;
  const planeInterval = setInterval(() => {
    pos += 12;
    plane.style.left = pos + 'px';

    // La fumée commence à remplir l'écran à mi-chemin
    if (pos > window.innerWidth / 3) {
      smoke.classList.add('active');
    }

    // Une fois sorti de l'écran, basculement vers le message final
    if (pos > window.innerWidth + 80) {
      clearInterval(planeInterval);
      plane.style.display = 'none';
      
      setTimeout(() => {
        goToNextScreen('screen-final');
        smoke.classList.remove('active'); // dissipation de la fumée
      }, 500);
    }
  }, 20);
}
