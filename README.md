# IntroGoogleAntigravity

🎯 Habit Tracker & Productivity Dashboard

Aplicație web pentru monitorizarea obiceiurilor și gestionarea productivității cu recomandări AI.

## ✨ Funcții

* ⏰ Widget timp — ora curentă, data și ziua săptămânii
* 💬 Citate motivaționale — integrare cu API pentru citate
* 📋 Habit Tracker — obiceiuri zilnice și săptămânale cu categorii
* ✅ Listă de sarcini — priorități (ridicată/scăzută) și termene limită (deadlines)
* 🤖 Recomandări AI — analiza productivității prin OpenAI
* 📊 Vizualizare — grafice de progres lunar (Chart.js)

## 📁 Structura proiectului

```
Project/
├── .env                    # Chei API (nu faceți commit!)
├── .gitignore              # Ignorare fișiere pentru Git
├── README.md               # Documentație
└── src/
    ├── index.html          # Pagina principală
    ├── styles/
    │   ├── main.css        # Stiluri principale
    │   └── components.css  # Stiluri componente
    └── js/
        ├── app.js          # Punct de intrare
        ├── config.js       # Configurare
        ├── modules/
        │   ├── timeWidget.js       # Widget timp
        │   ├── quotes.js           # Modul citate
        │   ├── habits.js           # Habit Tracker
        │   ├── tasks.js            # Manager sarcini
        │   ├── aiRecommendations.js # Recomandări AI
        │   └── charts.js           # Grafice
        └── utils/
            ├── storage.js  # Utilități LocalStorage
            └── helpers.js  # Funcții ajutătoare

```

## 🚀 Quick Start

1. Clonați depozitul (repository)
2. Adăugați cheia OpenAI API** în fișierul `.env`:
```
OPENAI_API_KEY=sk-your-key-here

```


3. Deschideți `src/index.html**` în browser

## 🛠 Tehnologii

* HTML5 + CSS3 (Vanilla, fără framework-uri)
* JavaScript ES6+ (arhitectură modulară)
* Chart.js — vizualizarea datelor
* OpenAI API — recomandări AI
* LocalStorage — stocarea datelor

## 📱 Responsivitate

Aplicația este adaptată pentru:

* 💻 Desktop (1920px+)
* 💻 Laptop (1024px-1919px)
* 📱 Tabletă (768px-1023px)
* 📱 Mobil (până la 767px)

## 🎨 Design

* Stil: Minimalist
* Temă: Se configurează conform preferințelor utilizatorului
* Limbă: Romina (sau limba dorită)

## 📦 Deploy

Aplicația este gata pentru a fi găzduită pe:

* Vercel
* GitHub Pages
* Orice hosting static

---

Notă: Pentru recomandările AI este necesară o cheie OpenAI API. La lansarea în producție se recomandă utilizarea funcțiilor serverless pentru securitatea cheii API.

---
