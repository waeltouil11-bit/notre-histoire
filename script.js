// Coordonnées : Tanger et Sa Ville (ex: Paris [48.8566, 2.3522])
const tangerCoords = [35.7595, -5.8340];
const targetCoords = [46.232193, 2.209667]; // 

// Initialisation de la carte sombre (CartoDB Dark Matter)
const map = L.map('map', { zoomControl: false }).setView([42, -1], 5);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 19
}).addTo(map);

// Icône de cœur
const heartIcon = L.divIcon({
  html: '<div style="font-size:24px;">❤️</div>',
  className: 'heart-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Animation principale
setTimeout(() => {
  // 1. Apparition des points
  const tangerMarker = L.circleMarker(tangerCoords, { color: '#ff416c', radius: 8 }).addTo(map).bindPopup('Tanger (Là où je suis)').openPopup();
  const targetMarker = L.circleMarker(targetCoords, { color: '#ff416c', radius: 8 }).addTo(map).bindPopup('Sa Ville (Là où elle est)');

  // 2. Point de rencontre symbolique au milieu
  const midLat = (tangerCoords[0] + targetCoords[0]) / 2;
  const midLng = (tangerCoords[1] + targetCoords[1]) / 2;
  const midCoords = [midLat, midLng];

  // 3. Tracé des lignes progressive
  let progress = 0;
  const polyline1 = L.polyline([], { color: '#ff416c', weight: 3, opacity: 0.8 }).addTo(map);
  const polyline2 = L.polyline([], { color: '#ff416c', weight: 3, opacity: 0.8 }).addTo(map);

  const interval = setInterval(() => {
    progress += 0.02;
    
    const currentLat1 = tangerCoords[0] + (midCoords[0] - tangerCoords[0]) * progress;
    const currentLng1 = tangerCoords[1] + (midCoords[1] - tangerCoords[1]) * progress;
    polyline1.addLatLng([currentLat1, currentLng1]);

    const currentLat2 = targetCoords[0] + (midCoords[0] - targetCoords[0]) * progress;
    const currentLng2 = targetCoords[1] + (midCoords[1] - targetCoords[1]) * progress;
    polyline2.addLatLng([currentLat2, currentLng2]);

    if (progress >= 1) {
      clearInterval(interval);
      
      // 4. Rencontre et apparition du Cœur + Zoom
      L.marker(midCoords, { icon: heartIcon }).addTo(map);
      map.flyTo(midCoords, 6, { duration: 2 });

      // 5. Apparition des textes
      setTimeout(() => document.getElementById('quote-1').classList.add('visible'), 1000);
      setTimeout(() => document.getElementById('quote-2').classList.add('visible'), 3000);
      setTimeout(() => document.getElementById('poem').classList.add('visible'), 5000);
      setTimeout(() => document.getElementById('next-btn').classList.remove('hidden'), 7000);
    }
  }, 50);

}, 1000);

function goToNextScreen() {
  document.getElementById('screen-map').classList.remove('active');
  document.getElementById('screen-story').classList.add('active');
}
