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
    function loadRoutes() {
    const saved = localStorage.getItem('markers');
    if (!saved) return;
     routes = JSON.parse(saved).map(m => ({
        name: m.name,
        grade: m.grade,
        description: m.description,
        saved: m.saved,

    }));
    renderRoutes(routes);
}
    let routes = [];

    function renderRoutes(data) {
        const gallery = document.querySelector('#gallery');
        gallery.innerHTML = '';

        data.forEach(route => {
            const panel = document.createElement('div');
            panel.classList.add('route-panel');
            const name = document.createElement('span');
            name.textContent = route.name;
            const grade = document.createElement('span');
            grade.textContent = route.grade;
            const description = document.createElement('span');
            description.textContent = route.description;
            const saved = document.createElement('span');
            saved.textContent = route.saved ? 'saved' : '';

            panel.append(name, grade, description, saved);
            gallery.appendChild(panel);
        });
    }
    loadRoutes();

    document.querySelector('#search').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filtered = routes.filter(route => 
            (route.name || '').toLowerCase().includes(query) ||
            (route.grade || '').toLowerCase().includes(query) ||
            (route.description || '').toLowerCase().includes(query)
        )
        renderRoutes(filtered);
        console.log(query);
        console.log(routes);
        console.log(filtered);
    })

    document.querySelector('#namebtn').addEventListener('click', function() {
    const sorted = [...routes].sort((a, b) => 
        (a.name || '').localeCompare(b.name || ''));
    renderRoutes(sorted);
});

document.querySelector('#gradebtn').addEventListener('click', function() {
    const sorted = [...routes].sort((a, b) => 
        (a.grade || '').localeCompare(b.grade || ''));
    renderRoutes(sorted);
});

document.querySelector('#descriptionbtn').addEventListener('click', function() {
    const sorted = [...routes].sort((a, b) => 
        (a.description || '').localeCompare(b.description || ''));
    renderRoutes(sorted);
});

document.querySelector('#savebtn').addEventListener('click', function() {
    const sorted = [...routes].sort((a, b) => 
        (b.saved === a.saved) ? 0 : b.saved ? 1 : -1);
    renderRoutes(sorted);
});