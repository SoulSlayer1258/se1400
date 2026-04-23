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


    const panel = document.querySelector('#marker-panel');
    var map = L.map('map').setView([39.8283, -98.5795], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let activeMarker = '';

    map.on('click', function(e) {
    activeMarker = L.marker(e.latlng).addTo(map);
    const point = map.latLngToContainerPoint(e.latlng);
    const rect = map.getContainer().getBoundingClientRect();


    const x = rect.left + point.x;
    const y = rect.top + point.y;

    panel.style.left = x + 'px';
    panel.style.top = y + 'px';
    panel.style.display = 'block';
});

document.querySelector('#panel-close').addEventListener('click', function() {
    panel.style.display = 'none';
    map.removeLayer(activeMarker);
})

document.querySelector('#submit').addEventListener('click', function() {
    panel.style.display = 'none';
})