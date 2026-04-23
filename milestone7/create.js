const hamburger = document.querySelector('#hamburger');
    const mainNav = document.querySelector('#main-nav');
    hamburger.addEventListener('click', function() {
        mainNav.classList.toggle('open');
        hamburger.classList.toggle('open');
    });

    const darkToggle = document.querySelector('#dark-toggle')
    darkToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        darkToggle.textContent = document.body.classList.contains('dark')
        ? 'Light'
        : 'dark';
    });

    var map = L.map('map', {zoomControl: false}).setView([39.8283, -98.5795], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const panel = document.querySelector('#marker-panel');

    let activeMarker = null;
    const markers = new Map();
    let markerCount = 0;

    map.on('click', function(e) {
    const id = markerCount++;
    const marker = L.marker(e.latlng).addTo(map);
    const point = map.latLngToContainerPoint(e.latlng);
    const rect = map.getContainer().getBoundingClientRect();
    const data = {
        id,
        marker,
        latlng: e.latlng,
        name: '',
        grade: '',
        description: '',
        saved: false
    };
    markers.set(id, data);

    const x = rect.left + point.x;
    const y = rect.top + point.y;

    panel.style.left = x + 'px';
    panel.style.top = y + 'px';
    panel.style.display = 'block';

    activeMarker = id;

    attachMarkerEvents(marker, id);
    openPanel(marker, id);
});

document.querySelector('#panel-close').addEventListener('click', function() {
    panel.style.display = 'none';
    activeMarker = null;
    document.querySelector('#marker-name').value = '';
    document.querySelector('#marker-grade').value = '';
    document.querySelector('#marker-description').value = '';
    }
)

document.querySelector('#delete').addEventListener('click', function() {
    panel.style.display = 'none';
    if (activeMarker !== null) {
        const data = markers.get(activeMarker);
        map.removeLayer(data.marker);
        markers.delete(activeMarker);
        activeMarker = null;
    }
    saveMarkers();
})

document.querySelector('#create').addEventListener('click', function(event) {
    event.preventDefault();
    panel.style.display = 'none';
    
    const data = markers.get(activeMarker);

    data.name = document.querySelector('#marker-name').value;
    data.grade = document.querySelector('#marker-grade').value;
    data.description = document.querySelector('#marker-description').value;
    console.log(data);
    activeMarker = null;
    document.querySelector('#marker-name').value = '';
    document.querySelector('#marker-grade').value = '';
    document.querySelector('#marker-description').value = '';
    saveMarkers();
})

function openPanel(marker, id) {
    activeMarker = id;
    updatePanelPosition(marker.getLatLng());
    panel.style.display = 'block';
    const data = markers.get(id);
    document.querySelector('#save').classList.toggle('true', data.saved);
    document.querySelector('#marker-name').value = data.name || '';
    document.querySelector('#marker-grade').value = data.grade || '';
    document.querySelector('#marker-description').value = data.description || '';
}

function attachMarkerEvents(marker, id) {
    marker.on('click', function () {
        openPanel(marker, id);
    })
}

function updatePanelPosition(latlng) {
    const point = map.latLngToContainerPoint(latlng);
    const rect = map.getContainer().getBoundingClientRect();

    const x = rect.left + point.x;
    const y = rect.top + point.y;

    panel.style.left = (x + 10) + 'px';
    panel.style.top = (y + 10) + 'px';
}

document.querySelector('#save').addEventListener('click', function() {
    if (activeMarker === null) return;
    const data = markers.get(activeMarker);
    data.saved = !data.saved;
    document.querySelector('#save').classList.toggle('true');
    saveMarkers();
})

function saveMarkers() {
    const data = Array.from(markers.values()).map(m => ({
        id: m.id,
        latlng: m.latlng,
        name: m.name,
        grade: m.grade,
        description: m.description,
        saved: m.saved
    }));

    localStorage.setItem("markers", JSON.stringify(data));
}

function loadMarkers(map, markers) {
    const saved = localStorage.getItem('markers');
    if (!saved) return;

    const data = JSON.parse(saved);

    data.forEach(m => {
        const marker = L.marker(m.latlng).addTo(map);

        markers.set(m.id, {
            ...m,
            marker
        });

        attachMarkerEvents(marker, m.id);
    })

    markerCount = data.length;
}

loadMarkers(map, markers);

document.querySelector('#help-toggle').addEventListener('click', function() {
    document.querySelector('#help-panel').classList.toggle('hidden');
})
