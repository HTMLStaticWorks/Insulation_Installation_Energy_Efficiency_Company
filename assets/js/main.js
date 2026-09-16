/**
 * THERMOVA - Main Global JavaScript
 * Handles Theme, RTL, Navbar, and CTA Modals
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    initNavbar();
    initModals();
    initScrollReveal();
});

/* ==========================================================================
   Theme Switching (Light / Dark)
   ========================================================================== */
function initTheme() {
    const themeBtns = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')].filter(Boolean);
    if (themeBtns.length === 0) return;
    
    // Check localStorage
    const savedTheme = localStorage.getItem('thermova-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('thermova-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    });
}

function updateThemeIcon(theme) {
    const themeIcons = document.querySelectorAll('#theme-toggle i, #theme-toggle svg, #theme-toggle-mobile i, #theme-toggle-mobile svg');
    if (themeIcons.length === 0) return;
    // Assuming Lucide or similar icon set
    themeIcons.forEach(themeIcon => {
        if (theme === 'dark') {
            themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            themeIcon.setAttribute('data-lucide', 'moon');
        }
    });
    // If using lucide, re-render
    if (window.lucide) {
        lucide.createIcons();
    }
}

/* ==========================================================================
   RTL Switching
   ========================================================================== */
function initRTL() {
    const rtlBtns = [document.getElementById('rtl-toggle'), document.getElementById('rtl-toggle-mobile')].filter(Boolean);
    if (rtlBtns.length === 0) return;

    const savedDir = localStorage.getItem('thermova-dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);

    rtlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('thermova-dir', newDir);
        });
    });
}

/* ==========================================================================
   Navbar & Mobile Menu
   ========================================================================== */
function initNavbar() {
    const hamburger = document.getElementById('hamburger-menu');
    const sideMenu = document.getElementById('side-menu');
    const sideMenuClose = document.getElementById('side-menu-close');
    const navLinks = document.querySelectorAll('.side-menu .nav-link');
    
    if (hamburger && sideMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            sideMenu.classList.toggle('open');
        });

        if (sideMenuClose) {
            sideMenuClose.addEventListener('click', () => {
                hamburger.classList.remove('open');
                sideMenu.classList.remove('open');
            });
        }

        // Close when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                sideMenu.classList.remove('open');
            });
        });
    }

    // Scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-sm)';
            navbar.style.borderBottom = 'none';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottom = '1px solid var(--nav-border)';
        }
    });
}

/* ==========================================================================
   Global CTA Popup System
   ========================================================================== */
function initModals() {
    const modalOverlay = document.getElementById('global-modal');
    if (!modalOverlay) return;

    const closeBtn = modalOverlay.querySelector('.modal-close');
    const modalContentContainer = document.getElementById('modal-dynamic-content');

    // All triggers
    const triggers = document.querySelectorAll('[data-modal-trigger]');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalType = trigger.getAttribute('data-modal-trigger');
            openModal(modalType);
        });
    });

    function openModal(type) {
        // Hide all templates inside modal
        const templates = modalOverlay.querySelectorAll('.modal-template');
        templates.forEach(t => t.classList.remove('active'));

        // Show specific template
        const activeTemplate = modalOverlay.querySelector(`#modal-${type}`);
        if (activeTemplate) {
            activeTemplate.classList.add('active');
        } else {
            // Default to assessment
            const defaultTemplate = modalOverlay.querySelector(`#modal-assessment`);
            if (defaultTemplate) defaultTemplate.classList.add('active');
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Form Validation for Assessment Modal
    const assessmentForm = modalOverlay.querySelector('#modal-assessment form');
    const continueBtn = modalOverlay.querySelector('#modal-assessment .btn-primary');
    
    if (assessmentForm && continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const inputs = assessmentForm.querySelectorAll('input[type="text"], input[type="email"]');
            let hasError = false;

            // Clear previous errors
            assessmentForm.querySelectorAll('.error-msg').forEach(msg => msg.remove());
            inputs.forEach(input => input.style.borderColor = '');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    hasError = true;
                    input.style.borderColor = '#ff4d4d'; // Red border
                    const errorMsg = document.createElement('span');
                    errorMsg.className = 'error-msg';
                    errorMsg.style.color = '#ff4d4d';
                    errorMsg.style.fontSize = '0.875rem';
                    errorMsg.style.marginTop = '0.5rem';
                    errorMsg.style.display = 'block';
                    errorMsg.innerText = 'This field is required.';
                    input.parentElement.appendChild(errorMsg);
                }
            });

            if (!hasError) {
                // Form is valid, proceed
                continueBtn.innerHTML = 'Processing...';
                setTimeout(() => {
                    closeModal();
                    continueBtn.innerHTML = 'Continue <i data-lucide="arrow-right"></i>';
                    lucide.createIcons();
                }, 1000);
            }
        });
    }
}

/* ==========================================================================
   Scroll Reveal Animation
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('active'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(el => revealObserver.observe(el));
}
