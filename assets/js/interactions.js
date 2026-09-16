/**
 * THERMOVA - Interactions & 3D Effects
 * Handles complex page-specific interactions like 3D hovers, sliders, and accordions.
 */

document.addEventListener('DOMContentLoaded', () => {
    init3DEffects();
    initBeforeAfterSlider();
    initAccordion();
    initServiceExplorer();
});

/* ==========================================================================
   3D Hover Effects (Perspective Cards)
   ========================================================================== */
function init3DEffects() {
    // 3D hover effect removed per user request
    return;
}

/* ==========================================================================
   Before vs After Slider (Home 2)
   ========================================================================== */
function initBeforeAfterSlider() {
    const sliderContainer = document.querySelector('.ba-slider-container');
    if (!sliderContainer) return;

    const sliderHandle = sliderContainer.querySelector('.ba-slider-handle');
    const imageAfter = sliderContainer.querySelector('.ba-image-after');
    
    let isDragging = false;

    sliderHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const rect = sliderContainer.getBoundingClientRect();
        let x = e.clientX - rect.left;
        
        // Boundaries
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        
        const percentage = (x / rect.width) * 100;
        
        sliderHandle.style.left = `${percentage}%`;
        imageAfter.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    });

    // Touch support
    sliderHandle.addEventListener('touchstart', () => { isDragging = true; }, {passive: true});
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const rect = sliderContainer.getBoundingClientRect();
        let x = e.touches[0].clientX - rect.left;
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        const percentage = (x / rect.width) * 100;
        sliderHandle.style.left = `${percentage}%`;
        imageAfter.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    }, {passive: true});
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initAccordion() {
    const accordions = document.querySelectorAll('.accordion-item');
    
    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close others
            accordions.forEach(other => {
                if (other !== acc && other.classList.contains('active')) {
                    other.classList.remove('active');
                    const icon = other.querySelector('.accordion-icon');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current
            acc.classList.toggle('active');
            const icon = acc.querySelector('.accordion-icon');
            if (icon) {
                if (acc.classList.contains('active')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
        
        // Keyboard access
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

/* ==========================================================================
   Interactive Service Explorer (Home)
   ========================================================================== */
function initServiceExplorer() {
    const serviceItems = document.querySelectorAll('.service-explorer-item');
    const displayImage = document.getElementById('service-display-image');
    const displayDesc = document.getElementById('service-display-desc');
    const displayLink = document.getElementById('service-display-link');

    if (!serviceItems.length || !displayImage) return;

    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Update active state
            serviceItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update content
            const imgSrc = item.getAttribute('data-image');
            const desc = item.getAttribute('data-desc');
            const link = item.getAttribute('data-link');

            // Fade effect
            displayImage.style.opacity = 0;
            displayDesc.style.opacity = 0;
            
            setTimeout(() => {
                displayImage.src = imgSrc;
                displayDesc.textContent = desc;
                if (displayLink && link) displayLink.href = link;
                
                displayImage.style.opacity = 1;
                displayDesc.style.opacity = 1;
            }, 200); // match CSS transition
        });
    });
}
