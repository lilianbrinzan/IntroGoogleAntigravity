// js/utils/seedData.js
export function initializeDemoData() {
    if (!localStorage.getItem('habits')) {
        const demoData = [
            { id: 1, name: 'Finalizare proiect Antigravitatie', progress: 85, date: '2026-03-05' },
            { id: 2, name: 'Studii Google Cloud', progress: 60, date: '2026-03-05' },
            { id: 3, name: 'Optimizare Cloud Run', progress: 40, date: '2026-03-04' }
        ];
        localStorage.setItem('habits', JSON.stringify(demoData));
        console.log("Date de test încărcate cu succes!");
    }
}
