// zijbalk nav mobile view
const toggleSidebar = () => {
    const sidebar = document.querySelector('.navigation');
    const content = document.querySelector('.mainMain');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
    sidebar.classList.toggle('active');
    content.classList.toggle('active');
    sidebarToggleBtn.classList.toggle('active');
};

document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', toggleSidebar);
    }
});

//copyright
document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
});

//popup
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.catchPopupBtn').addEventListener('click', function() {
        // Toggle the visibility of additional information
        var catchPopup = document.querySelector('.catchPopup');
        catchPopup.style.display = (catchPopup.style.display === 'none') ? 'block' : 'none';
    });

    document.querySelector('.closeBtn').addEventListener('click', function() {
        // Close the popup when close button is clicked
        var catchPopup = document.querySelector('.catchPopup');
        catchPopup.style.display = 'none';
    });
});

//popup
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.ownPopupBtn').addEventListener('click', function() {
        // Toggle the visibility of additional information
        var catchPopup = document.querySelector('.ownPopup');
        catchPopup.style.display = (catchPopup.style.display === 'none') ? 'block' : 'none';
    });

    document.querySelector('.ownCloseBtn').addEventListener('click', function() {
        // Close the popup when close button is clicked
        var catchPopup = document.querySelector('.ownPopup');
        catchPopup.style.display = 'none';
    });
});

// higher stats and lower stats
document.addEventListener('DOMContentLoaded', function () {
    const statsTypes = ['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'];

    statsTypes.forEach(statType => {
        const entity1Stat = document.querySelector(`#entity1Stats .stat-value[data-stat-type="${statType}"]`);
        const entity2Stat = document.querySelector(`#entity2Stats .stat-value[data-stat-type="${statType}"]`);

        const value1 = parseInt(entity1Stat.textContent, 10);
        const value2 = parseInt(entity2Stat.textContent, 10);

        if (value1 > value2) {
            entity1Stat.classList.add('higherStat');
            entity2Stat.classList.add('lowerStat');
        } else if (value1 < value2) {
            entity1Stat.classList.add('lowerStat');
            entity2Stat.classList.add('higherStat');
        }
    });
});