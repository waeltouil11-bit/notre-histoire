const monPrenom = "Wael";
const nomNaelle = "Naelle";

const tangerCoords = [35.7595, -5.8340];
const targetCoords = [48.8566, 2.3522];

const map = L.map('map', { zoomControl: false }).setView([42, -1], 5);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

const midLat = (tangerCoords[0] + targetCoords[0]) / 2;
const midLng = (tangerCoords[1] + targetCoords[1]) / 2;
const midCoords = [midLat, midLng];

setTimeout(() => {
  const tangerMarker = L.circleMarker(tangerCoords, { color: '#ff416c', fillColor: '#ff416c', fillOpacity: 0.9, radius: 8 }).addTo(map);
  const targetMarker = L.circleMarker(targetCoords, { color: '#ff416c', fillColor: '#ff416c', fillOpacity: 0.9, radius: 8 }).addTo(map);

  tangerMarker.bindTooltip(`📍 Tanger — ${monPrenom}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();
  targetMarker.bindTooltip(`📍 France — ${nomNaelle}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();

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

// Dessin et Remplissage du Cœur
function drawHeartShape() {
  const heartPoints = [];
  let step = 0;
  const totalSteps = 100;
  const scaleLat = 1.8;
  const scaleLng = 2.4;

  const heartInterval = setInterval(() => {
    step++;
    const t = (step / totalSteps) * Math.PI;

    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);

    heartPoints.push([midLat + (y / 16) * scaleLat, midLng + (x / 16) * scaleLng]);

    if (step >= totalSteps) {
      clearInterval(heartInterval);
      
      // Tracer le polygone coloré rempli de rouge
      L.polygon(heartPoints, {
        color: '#ff1493',
        fillColor: '#ff416c',
        fillOpacity: 0.6,
        weight: 3
      }).addTo(map);

      map.flyTo([midLat - 0.5, midLng], 6, { duration: 2.5 });

      setTimeout(() => document.getElementById('quote-1').classList.add('visible'), 1200);
      setTimeout(() => document.getElementById('quote-2').classList.add('visible'), 3200);
      setTimeout(() => document.getElementById('poem').classList.add('visible'), 5200);
      setTimeout(() => document.getElementById('next-btn').classList.remove('hidden'), 7200);
    }
  }, 25);
}

function goToNextScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function triggerLockError() {
  const errorMsg = document.getElementById('error-message');
  errorMsg.classList.remove('hidden');

  setTimeout(() => {
    launchPlaneAnimation();
  }, 2500);
}

// Animation Réaliste de l'Avion et de la Fumée
function launchPlaneAnimation() {
  const planeWrapper = document.getElementById('plane-wrapper');
  const smokeOverlay = document.getElementById('smoke-overlay');
  const smokeContainer = document.getElementById('smoke-container');

  planeWrapper.style.display = 'flex';
  
  let pos = -250;
  const planeInterval = setInterval(() => {
    pos += 12;
    planeWrapper.style.left = pos + 'px';

    // Génération continue de puffs de fumée réels
    const puff = document.createElement('div');
    puff.className = 'smoke-puff';
    puff.style.top = (Math.random() * 20 - 10) + 'px';
    smokeContainer.appendChild(puff);

    setTimeout(() => puff.remove(), 1500);

    if (pos > window.innerWidth / 3) {
      smokeOverlay.classList.add('active');
    }

    if (pos > window.innerWidth + 200) {
      clearInterval(planeInterval);
      planeWrapper.style.display = 'none';
      
      setTimeout(() => {
        goToNextScreen('screen-final');
        smokeOverlay.classList.remove('active');
      }, 500);
    }
  }, 20);
}
