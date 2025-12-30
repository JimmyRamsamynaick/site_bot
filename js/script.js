document.addEventListener('DOMContentLoaded', () => {
    
    // Burger Menu & Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    function toggleMenu() {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    }

    burger.addEventListener('click', toggleMenu);

    // Smooth Scrolling & Close Menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Si le menu est ouvert (mode mobile), on le ferme proprement
            if (nav.classList.contains('nav-active')) {
                toggleMenu();
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Évite erreur si href="#"

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // --- Captcha Mathématique ---
    let captchaResult = 0;

    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1; // 1 à 10
        const num2 = Math.floor(Math.random() * 10) + 1; // 1 à 10
        captchaResult = num1 + num2;
        
        const captchaLabel = document.getElementById('captcha-label');
        if (captchaLabel) {
            captchaLabel.textContent = `Question de sécurité : Combien font ${num1} + ${num2} ?`;
        }
    }

    // Générer un nouveau captcha au chargement
    if (contactForm) {
        generateCaptcha();
    }
    // ----------------------------

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // --- Validation Captcha ---
            const userCaptcha = parseInt(document.getElementById('captcha-input').value, 10);
            if (userCaptcha !== captchaResult) {
                formStatus.textContent = "Erreur : Mauvaise réponse au calcul de sécurité.";
                formStatus.className = 'form-status status-error';
                return; // On arrête tout si le captcha est faux
            }
            // ---------------------------

            // UI Feedback - Loading
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            // Gather Data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                website_url: document.getElementById('website_url').value // Honeypot
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Success
                    formStatus.textContent = result.message;
                    formStatus.classList.add('status-success');
                    contactForm.reset();
                } else {
                    // Error from server
                    throw new Error(result.message || 'Une erreur est survenue.');
                }
            } catch (error) {
                // Network or other error
                console.error('Error:', error);
                formStatus.textContent = error.message || 'Erreur de connexion au serveur.';
                formStatus.classList.add('status-error');
            } finally {
                // Reset Button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
