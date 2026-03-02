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
        this.container = $('#aiRecommendations');
        this.button = $('#generateRecommendations');
        this.greetingButton = $('#getAiAdvice');

        this.bindEvents();
        this.loadCachedRecommendations();
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
        if (!CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === 'your_openai_api_key_here') {
            this.showError('Cheia API OpenAI nu este configurată. Adăugați cheia în config.js');
            return;
        }

        this.showLoading();

        try {
            const context = this.buildContext();
            const recommendations = await this.callOpenAI(context);

            this.displayRecommendations(recommendations);
            this.cacheRecommendations(recommendations);

        } catch (error) {
            console.error('AI Error:', error);
            this.showError('Nu s-au putut obține recomandări. Încercați mai târziu.');
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
     * Call OpenAI API
     */
    async callOpenAI(context) {
        const prompt = this.buildPrompt(context);

        const response = await fetch(CONFIG.OPENAI_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: CONFIG.OPENAI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: `Ești un asistent AI personal pentru productivitate.
                        Analizează datele utilizatorului și oferă recomandări concrete și aplicabile în limba română.
                        Fii scurt, pozitiv și motivant.
                        Răspunde sub formă de listă cu 3-4 recomandări scurte.
                        Fiecare recomandare trebuie să înceapă cu un emoji.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
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
