// Remplace par ton prénom
const monPrenom = "Mon Prénom"; // 👈 METS TON PRÉNOM ICI
const nomNaelle = "Naelle";

// Coordonnées : Tanger et France (Paris)
const tangerCoords = [35.7595, -5.8340];
const targetCoords = [48.8566, 2.3522]; // (Ajustable au besoin)

// Carte claire
const map = L.map('map', { zoomControl: false }).setView([42, -1], 5);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Centre de la carte entre les deux villes
const midLat = (tangerCoords[0] + targetCoords[0]) / 2;
const midLng = (tangerCoords[1] + targetCoords[1]) / 2;
const midCoords = [midLat, midLng];

// Marqueurs avec prénoms
setTimeout(() => {
  const tangerMarker = L.circleMarker(tangerCoords, { color: '#ff416c', fillColor: '#ff416c', fillOpacity: 0.9, radius: 8 }).addTo(map);
  const targetMarker = L.circleMarker(targetCoords, { color: '#ff416c', fillColor: '#ff416c', fillOpacity: 0.9, radius: 8 }).addTo(map);

  tangerMarker.bindTooltip(`📍 Tanger — ${monPrenom}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();
  targetMarker.bindTooltip(`📍 France — ${nomNaelle}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();

  // Lines vers le point de rencontre
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
      
      // PHASE 2 : RENCONTRE AU MILIEU PUIS SÉPARATION EN FORME DE CŒUR
      drawHeartShape();
    }
  }, 40);

}, 1000);

function drawHeartShape() {
  const leftHeartLine = L.polyline([], { color: '#ff1493', weight: 4, opacity: 0.95 }).addTo(map);
  const rightHeartLine = L.polyline([], { color: '#ff1493', weight: 4, opacity: 0.95 }).addTo(map);

  let step = 0;
  const totalSteps = 100;
  
  // Paramètres de taille du cœur sur la carte
  const scaleLat = 1.8;
  const scaleLng = 2.4;

  const heartInterval = setInterval(() => {
    step++;
    const t = (step / totalSteps) * Math.PI; // De 0 à PI

    // Calcul de l'aile gauche du cœur (départ du milieu vers le haut/gauche puis revient en bas)
    const xLeft = -16 * Math.pow(Math.sin(t), 3);
    const yLeft = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);

    const latLeft = midLat + (yLeft / 16) * scaleLat;
    const lngLeft = midLng + (xLeft / 16) * scaleLng;
    leftHeartLine.addLatLng([latLeft, lngLeft]);

    // Calcul de l'aile droite du cœur (symétrique)
    const xRight = 16 * Math.pow(Math.sin(t), 3);
    const yRight = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);

    const latRight = midLat + (yRight / 16) * scaleLat;
    const lngRight = midLng + (xRight / 16) * scaleLng;
    rightHeartLine.addLatLng([latRight, lngRight]);

    if (step >= totalSteps) {
      clearInterval(heartInterval);
      
      // Zoom doux sur le cœur formé
      map.flyTo([midLat - 0.5, midLng], 6, { duration: 2.5 });

      // Affichage progressif des textes et du bouton
      setTimeout(() => document.getElementById('quote-1').classList.add('visible'), 1200);
      setTimeout(() => document.getElementById('quote-2').classList.add('visible'), 3200);
      setTimeout(() => document.getElementById('poem').classList.add('visible'), 5200);
      setTimeout(() => document.getElementById('next-btn').classList.remove('hidden'), 7200);
    }
  }, 25);
}

function goToNextScreen() {
  document.getElementById('screen-map').classList.remove('active');
  document.getElementById('screen-story').classList.add('active');
}
