/**
 * Motivation Quotes Module
 */

const quotesModule = {
    // Current state
    state: {
        text: 'Succesul nu este finalul, eșecul nu este fatal: curajul de a continua este cel care contează.',
        author: 'Winston Churchill'
    },

    // Elements
    elements: {
        quoteText: document.getElementById('quoteText'),
        quoteAuthor: document.getElementById('quoteAuthor'),
        refreshBtn: document.getElementById('refreshQuote')
    },

    // Set quote display
    setQuote(quote) {
        if (this.elements.quoteText) this.elements.quoteText.textContent = `"${quote.text}"`;
        if (this.elements.quoteAuthor) this.elements.quoteAuthor.textContent = `— ${quote.author || 'Anonim'}`;
    },

    // Fetch new quote
    async fetchNewQuote() {
        try {
            const response = await fetch('https://api.quotable.io/random?tags=motivational,inspiration');
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();

            this.state = { text: data.content, author: data.author };
            this.setQuote(this.state);
        } catch (e) {
            console.warn('Citate API offline, using fallback quotes', e);
            const fallback = CONFIG.FALLBACK_QUOTES[Math.floor(Math.random() * CONFIG.FALLBACK_QUOTES.length)];
            this.setQuote(fallback);
        }
    },

    // Initialize with first quote and events
    init() {
        this.fetchNewQuote();
        if (this.elements.refreshBtn) {
            this.elements.refreshBtn.addEventListener('click', () => this.fetchNewQuote());
        }
    }
};

// Export to window
window.quotesModule = quotesModule;
