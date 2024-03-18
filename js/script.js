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