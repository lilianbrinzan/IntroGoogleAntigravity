/**
 * Time & Date Widget Module
 */

const timeWidget = {
    // Initialized Elements
    elements: {
        time: document.getElementById('currentTime'),
        seconds: document.getElementById('currentSeconds'),
        day: document.getElementById('currentDay'),
        weekday: document.getElementById('currentWeekday'),
        month: document.getElementById('currentMonth')
    },

    // Update time and date
    update() {
        const now = new Date();
        const timeObj = Helpers.getCurrentTime();

        if (this.elements.time) {
            this.elements.time.textContent = `${timeObj.hours}:${timeObj.minutes}`;
        }
        if (this.elements.seconds) {
            this.elements.seconds.textContent = `:${timeObj.seconds}`;
        }

        // Update Date if it changed
        if (this.elements.day) this.elements.day.textContent = now.getDate();
        if (this.elements.weekday) this.elements.weekday.textContent = `${CONFIG.WEEKDAYS[now.getDay()]},`;
        if (this.elements.month) this.elements.month.textContent = CONFIG.MONTHS[now.getMonth()];
    },

    // Initialize with interval
    init() {
        this.update();
        setInterval(() => this.update(), 1000);
    }
};

// Export to window
window.timeWidget = timeWidget;
