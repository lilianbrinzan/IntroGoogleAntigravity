/**
 * Main Application Module
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Productivity Dashboard Initialized');

    // 1. Initialize Utility Modules
    // (Helpers and Storage are already on window)

    // 2. Initialize Functional Modules
    if (window.timeWidget) timeWidget.init();
    if (window.quotesModule) quotesModule.init();

    // Habits and Tasks usually have their own init
    if (window.Habits) Habits.init();
    if (window.Tasks) Tasks.init();
    if (window.Charts) Charts.init();
    if (window.AiRecommendations) AiRecommendations.init();

    // 3. Global Event Listeners
    bindGlobalEvents();
});

function bindGlobalEvents() {
    // Mobile Menu Toggle
    const menuBtn = $('#menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            console.log('Menu toggled');
            // Add sidebar toggle logic if needed
        });
    }

    // Top Right Add Button (Generic)
    const globalAddBtn = document.querySelector('.header-right .icon-btn');
    if (globalAddBtn) {
        globalAddBtn.addEventListener('click', () => {
            // Default to task modal if both present
            if (window.Tasks) Tasks.openModal();
        });
    }

    // Modal overlays (fallback closer)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.classList.remove('active');
        });
    });
}
