/**
 * AI Recommendations Module using OpenAI API
 */

const AIRecommendations = {
    container: null,
    button: null,
    lastUpdate: null,

    /**
     * Initialize AI module
     */
    init() {
        console.log("AI Module inițializat!");
        this.container = document.getElementById('aiRecommendations');
        this.button = document.getElementById('generateRecommendations');

        // Legăm evenimentul imediat
        if (this.button) {
            console.log("Butonul a fost găsit, atașez evenimentul...");
            this.button.addEventListener('click', () => {
                console.log("CLICK detectat pe buton!");
                this.generateRecommendations();
            });
        } else {
            console.error("Butonul NU a fost găsit în HTML!");
        }
    },

    /**
     * Bind events
     */
    bindEvents() {
        if (this.button) {
            this.button.addEventListener('click', () => this.generateRecommendations());
        }

        if (this.greetingButton) {
            this.greetingButton.addEventListener('click', () => this.generateRecommendations());
        }
    },

    /**
     * Load cached recommendations
     */
    loadCachedRecommendations() {
        const cached = Storage.load(CONFIG.STORAGE_KEYS.AI_CACHE);

        if (cached && cached.recommendations) {
            const cacheAge = Date.now() - cached.timestamp;
            const oneHour = 60 * 60 * 1000;

            // Show cached if less than 1 hour old
            if (cacheAge < oneHour) {
                this.displayRecommendations(cached.recommendations);
                this.lastUpdate = cached.timestamp;
            }
        }
    },

    /**
     * Generate AI recommendations
     */
    async generateRecommendations() {
        // 1. Verificăm dacă măcar intră aici
        console.log("Funcția generateRecommendations a fost apelată!");

        this.showLoading(); // Dacă nu vezi spinner-ul, aici e problema

        try {
            const context = this.buildContext();
            console.log("DEBUG: Contextul construit:", context);

            // 2. Apelul tău către funcție
            const response = await fetch('https://recomandari-gemini-174003836777.europe-west1.run.app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(context)
            });

            const data = await response.text();
            console.log("DEBUG: Răspuns primit de la Cloud:", data);

            this.displayRecommendations(data);
        } catch (error) {
            console.error('DEBUG: Eroare critică la apel AI:', error);
        }
    },

    /**
     * Build context for AI
     */
    buildContext() {
        const habits = window.Habits?.habits || [];
        const tasks = window.Tasks?.tasks || [];
        const stats = window.Tasks?.getStats() || {};
        const streak = window.Habits?.calculateStreak() || 0;

        const today = Helpers.getToday();
        const weekStart = Helpers.getWeekStart();

        // Calculate habit completion rate
        const dailyHabits = habits.filter(h => h.type === 'daily');
        const completedToday = dailyHabits.filter(h =>
            h.completedDates?.includes(today)
        ).length;

        const completionRate = dailyHabits.length > 0
            ? Math.round((completedToday / dailyHabits.length) * 100)
            : 0;

        return {
            date: Helpers.formatDate(today, 'full'),
            habits: {
                total: habits.length,
                daily: dailyHabits.length,
                weekly: habits.filter(h => h.type === 'weekly').length,
                completedToday,
                completionRate,
                streak,
                categories: habits.reduce((acc, h) => {
                    acc[h.category] = (acc[h.category] || 0) + 1;
                    return acc;
                }, {})
            },
            tasks: {
                total: stats.total || 0,
                completed: stats.completed || 0,
                pending: stats.pending || 0,
                highPriority: stats.highPriority || 0,
                overdue: stats.overdue || 0,
                pendingTasks: tasks
                    .filter(t => !t.completed)
                    .slice(0, 5)
                    .map(t => ({
                        title: t.title,
                        priority: t.priority,
                        deadline: t.deadline
                    }))
            }
        };
    },

    /**
      * Call our secure Cloud Function instead of direct API calls
     */
    async callGeminiCloud(context) {
        const CLOUD_FUNCTION_URL = 'https://recomandari-gemini-174003836777.europe-west1.run.app';

        try {
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(context)
            });

            if (!response.ok) {
                throw new Error(`Eroare backend: ${response.status}`);
            }

            // Gemini returnează textul direct
            return await response.text();
        } catch (error) {
            console.error('Eroare la apelul Gemini Cloud:', error);
            throw error;
        }
    },

    /**
     * Build prompt for AI
     */
    buildPrompt(context) {
        return `
Astăzi: ${context.date}

OBICEIURI:
- Total obiceiuri: ${context.habits.total}
- Zilnice: ${context.habits.daily}, săptămânale: ${context.habits.weekly}
- Completate astăzi: ${context.habits.completedToday} din ${context.habits.daily} (${context.habits.completionRate}%)
- Serie curentă (Streak): ${context.habits.streak} zile

SARCINI:
- Total: ${context.tasks.total}
- Completate: ${context.tasks.completed}
- În așteptare: ${context.tasks.pending}
- Prioritate ridicată: ${context.tasks.highPriority}
- Întârziate: ${context.tasks.overdue}

${context.tasks.pendingTasks.length > 0 ? `
Următoarele sarcini:
${context.tasks.pendingTasks.map(t =>
            `- ${t.title} (${t.priority === 'high' ? 'important' : 'normal'}${t.deadline ? ', până la ' + t.deadline : ''})`
        ).join('\n')}
` : ''}

Pe baza acestor date, oferă 3-4 recomandări personale pentru creșterea productivității.
`;
    },

    /**
     * Display recommendations
     */
    displayRecommendations(text) {
        if (!this.container) return;

        // Parse recommendations (split by lines starting with emoji)
        const lines = text.split('\n').filter(line => line.trim());

        this.container.innerHTML = lines.map(line =>
            `<div class="ai-recommendation-item animate-fade-in">${line}</div>`
        ).join('');
    },

    /**
     * Cache recommendations
     */
    cacheRecommendations(recommendations) {
        Storage.save(CONFIG.STORAGE_KEYS.AI_CACHE, {
            recommendations,
            timestamp: Date.now()
        });
        this.lastUpdate = Date.now();
    },

    /**
     * Show loading state
     */
    showLoading() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="ai-loading">
                <div class="spinner"></div>
                <span>Analizez datele tale...</span>
            </div>
        `;
    },

    /**
     * Show error
     */
    showError(message) {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="ai-placeholder" style="color: var(--color-danger);">
                <p>❌ ${message}</p>
            </div>
        `;
    }
};

// Make globally available
window.AIRecommendations = AIRecommendations;

// js/modules/aiRecommendations.js

export async function fetchAIRecommendations(userHabits) {
    // URL-ul backend-ului tău (în producție va fi URL-ul de Cloud Run)
    const backendUrl = 'https://antigravity-service-xyz.a.run.app/api/recommendations';

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userHabits }),
        });

        if (!response.ok) {
            throw new Error('Eroare la comunicarea cu serverul AI');
        }

        const result = await response.json();
        return result.data; // Aici primim recomandarea procesată
    } catch (error) {
        console.error('Antigravity Service Error:', error);
        return "Nu am putut obține recomandări în acest moment.";
    }
}