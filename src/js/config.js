/**
 * Application Configuration
 */

const CONFIG = {
    APP_NAME: 'Tracker de Obiceiuri',
    LANGUAGE: 'ro',

    // API Endpoints
    QUOTES_API: 'https://api.quotable.io/random',
    OPENAI_API: 'https://api.openai.com/v1/chat/completions',

    // OpenAI Settings
    OPENAI_MODEL: 'gpt-4o-mini',
    OPENAI_API_KEY: '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',

    // LocalStorage Keys
    STORAGE_PREFIX: 'habitTracker_',
    STORAGE_KEYS: {
        HABITS: 'habitTracker_habits',
        TASKS: 'habitTracker_tasks',
        SETTINGS: 'habitTracker_settings',
        AI_CACHE: 'habitTracker_aiCache'
    },

    // Categories
    HABIT_CATEGORIES: [
        { id: 'health', name: 'Sănătate', icon: '💪', color: '#22c55e' },
        { id: 'work', name: 'Muncă', icon: '💼', color: '#3b82f6' },
        { id: 'study', name: 'Studiu', icon: '📚', color: '#f59e0b' },
        { id: 'personal', name: 'Personal', icon: '🌟', color: '#a855f7' }
    ],

    // Priority Levels
    TASK_PRIORITIES: [
        { id: 'high', name: 'Ridicat', color: '#ef4444' },
        { id: 'low', name: 'Scăzut', color: '#22c55e' }
    ],

    // Chart Colors
    CHART_COLORS: {
        primary: '#e55b3c',
        secondary: '#6366f1',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
        categories: ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
    },

    // Weekdays in Russian
    WEEKDAYS: ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'],
    WEEKDAYS_SHORT: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],

    // Months in Russian
    MONTHS: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],

    // Fallback Quotes (Russian)
    FALLBACK_QUOTES: [
        { text: 'Succesul este suma micilor eforturi, repetate zi după zi.', author: 'Robert Collier' },
        { text: 'Singura modalitate de a face o treabă excelentă este să iubești ceea ce faci.', author: 'Steve Jobs' },
        { text: 'Viitorul aparține celor care cred în frumusețea visurilor lor.', author: 'Eleanor Roosevelt' },
        { text: 'Începe prin a face ceea ce este necesar, apoi ceea ce este posibil și, deodată, vei face imposibilul.', author: 'Francisc de Assisi' },
        { text: 'Disciplina este puntea dintre scopuri și realizări.', author: 'Jim Rohn' },
        { text: 'Nu contează cât de încet mergi, atâta timp cât nu te oprești.', author: 'Confucius' },
        { text: 'Fiecare zi este o șansă de a deveni mai bun.', author: 'Autor necunoscut' },
        { text: 'Obiceiurile sunt arhitectura invizibilă a vieții de zi cu zi.', author: 'Gretchen Rubin' }
    ]
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.STORAGE_KEYS);
Object.freeze(CONFIG.HABIT_CATEGORIES);
Object.freeze(CONFIG.TASK_PRIORITIES);
Object.freeze(CONFIG.CHART_COLORS);
