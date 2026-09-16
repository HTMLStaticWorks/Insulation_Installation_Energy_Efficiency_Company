/**
 * THERMOVA - Energy Savings Calculator
 * Handles calculator logic for both Home Page preview and full Calculator page.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHomeCalculator();
    initFullCalculator();
});

/* ==========================================================================
   Home Page Calculator Preview
   ========================================================================== */
function initHomeCalculator() {
    const homeCalcBtn = document.getElementById('calc-estimate-btn');
    if (!homeCalcBtn) return;

    homeCalcBtn.addEventListener('click', () => {
        const sizeInput = document.getElementById('home-calc-size');
        const billInput = document.getElementById('home-calc-bill');
        
        let size = sizeInput ? parseInt(sizeInput.value) : 2000;
        let bill = billInput ? parseInt(billInput.value) : 150;
        
        if (isNaN(size) || size < 100) size = 2000;
        if (isNaN(bill) || bill < 10) bill = 150;
        
        // Simplified illustrative estimate: ~20% - 30% savings
        const monthlySavings = bill * 0.25; 
        const annualSavings = monthlySavings * 12;

        const resultDisplay = document.getElementById('home-calc-result');
        if (resultDisplay) {
            animateValue(resultDisplay, 0, Math.round(annualSavings), 1500);
            
            // Show result card
            const resultCard = document.getElementById('home-calc-result-card');
            if (resultCard) {
                resultCard.style.display = 'block';
                setTimeout(() => resultCard.style.opacity = 1, 50);
            }
        }
    });
}

/* ==========================================================================
   Full Calculator Page
   ========================================================================== */
function initFullCalculator() {
    const fullCalcBtn = document.getElementById('full-calc-btn');
    if (!fullCalcBtn) return;

    fullCalcBtn.addEventListener('click', () => {
        // Inputs
        const sizeInput = document.getElementById('full-calc-size');
        const billInput = document.getElementById('full-calc-bill');
        const insulationInput = document.getElementById('full-calc-insulation');
        
        let size = parseInt(sizeInput.value) || 2000;
        let bill = parseInt(billInput.value) || 150;
        let insulationState = insulationInput ? insulationInput.value : 'average';
        
        // Multipliers based on current state
        let savingsMultiplier = 0.20; // default average
        if (insulationState === 'poor') savingsMultiplier = 0.35;
        if (insulationState === 'good') savingsMultiplier = 0.10;
        
        const monthlySavings = bill * savingsMultiplier;
        const annualSavings = monthlySavings * 12;
        const effImprovement = savingsMultiplier * 100;

        // Animate Results
        const monthEl = document.getElementById('res-monthly');
        const yearEl = document.getElementById('res-annual');
        const effEl = document.getElementById('res-efficiency');
        
        if (monthEl) animateValue(monthEl, 0, Math.round(monthlySavings), 1000);
        if (yearEl) animateValue(yearEl, 0, Math.round(annualSavings), 1500);
        if (effEl) animateValue(effEl, 0, Math.round(effImprovement), 1200, '%');

        // Show dashboard
        const dashboard = document.getElementById('calculator-results-dashboard');
        if (dashboard) {
            dashboard.style.display = 'block';
            dashboard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                dashboard.style.opacity = 1;
                dashboard.style.transform = 'translateY(0)';
            }, 100);
        }
    });
}

/* ==========================================================================
   Utilities
   ========================================================================== */
function animateValue(obj, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function (easeOutQuart)
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(easeProgress * (end - start) + start);
        
        obj.innerHTML = currentVal + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end + suffix;
        }
    };
    window.requestAnimationFrame(step);
}
