/**
 * UI & Utility Helper Functions
 */

const Helpers = {
    // DOM Element Selector
    $(id) {
        if (id.startsWith('#')) return document.getElementById(id.substring(1));
        return document.getElementById(id);
    },

    // Format Number with Leading Zero
    formatNumber(num) {
        return num < 10 ? `0${num}` : num;
    },

    // Get Current Local Time Formatted
    getCurrentTime() {
        const now = new Date();
        return {
            hours: this.formatNumber(now.getHours()),
            minutes: this.formatNumber(now.getMinutes()),
            seconds: this.formatNumber(now.getSeconds())
        };
    },

    // Get Today Date String (YYYY-MM-DD)
    getToday() {
        return new Date().toISOString().split('T')[0];
    },

    // Get Week Start Date String
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        const start = new Date(now.setDate(diff));
        return start.toISOString().split('T')[0];
    },

    // Generate Random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Get Last N Days
    getLastNDays(n) {
        const dates = [];
        for (let i = n - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    },

    // Check if date is overdue
    isOverdue(dateStr) {
        if (!dateStr) return false;
        const today = this.getToday();
        return dateStr < today;
    },

    // Format Date for Display
    formatDate(dateStr, format = 'full') {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (format === 'short') {
            return `${date.getDate()} ${CONFIG.MONTHS[date.getMonth()].substring(0, 3)}.`;
        }
        return `${date.getDate()} ${CONFIG.MONTHS[date.getMonth()]}`;
    },

    // Show Toast Notification
    showToast(message, type = 'info') {
        console.log(`[Toast ${type.toUpperCase()}] ${message}`);
        // Simple alert for now or implement a UI toast if needed
    },

    // Show/Hide Modal
    toggleModal(modalId, show = true) {
        const modal = this.$(modalId);
        if (modal) {
            if (show) {
                modal.classList.add('active');
            } else {
                modal.classList.remove('active');
            }
        }
    },

    // Create Element with Classes and Properties
    createElement(tag, classes = [], props = {}) {
        const element = document.createElement(tag);
        if (Array.isArray(classes)) {
            classes.forEach(cls => element.classList.add(cls));
        } else if (classes) {
            element.classList.add(classes);
        }

        Object.entries(props).forEach(([key, value]) => {
            if (key === 'innerText' || key === 'innerHTML' || key === 'textContent') {
                element[key] = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        return element;
    },

    // Dispatch custom event
    dispatch(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
};

// Export to window
window.Helpers = Helpers;
window.$ = Helpers.$; // Also provide $ as global shortcut
