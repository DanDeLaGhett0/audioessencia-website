/**
 * AudiEssencia - Main JavaScript File
 * Handles navigation, filters, forms, and general website functionality
 */

class AudiEssenciaApp {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.initializeComponents();
            });
        } else {
            this.setupEventListeners();
            this.initializeComponents();
        }
    }

    setupEventListeners() {
        // Navigation toggle
        this.setupNavigation();
        
        // Filter functionality
        this.setupFilters();
        
        // Form handling
        this.setupForms();
        
        // Audio integration
        this.setupAudioTriggers();
        
        // Scroll effects
        this.setupScrollEffects();
        
        // Accessibility features
        this.setupAccessibility();
    }

    initializeComponents() {
        // Initialize waveform animation
        this.initWaveformAnimation();
        
        // Initialize audio visualizer
        this.initAudioVisualizer();
        
        // Initialize lazy loading
        this.initLazyLoading();
    }

    // Navigation Setup
    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.setAttribute('aria-expanded', 
                    navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
                );
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Filter Setup for Contributors Page
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const contributorCards = document.querySelectorAll('.contributor-card-detailed');

        if (filterButtons.length > 0 && contributorCards.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Update active state
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    const filterValue = button.dataset.filter;
                    
                    // Filter contributors
                    contributorCards.forEach(card => {
                        const expertise = card.dataset.expertise;
                        
                        if (filterValue === 'all' || expertise.includes(filterValue)) {
                            card.style.display = 'grid';
                            card.classList.add('animate-fade-in');
                        } else {
                            card.style.display = 'none';
                            card.classList.remove('animate-fade-in');
                        }
                    });

                    // Update URL without page reload
                    const url = new URL(window.location);
                    if (filterValue === 'all') {
                        url.searchParams.delete('filter');
                    } else {
                        url.searchParams.set('filter', filterValue);
                    }
                    window.history.replaceState({}, '', url);
                });
            });

            // Initialize filter from URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const filterParam = urlParams.get('filter');
            if (filterParam) {
                const filterButton = document.querySelector(`[data-filter="${filterParam}"]`);
                if (filterButton) {
                    filterButton.click();
                }
            }
        }
    }

    // Form Handling
    setupForms() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });

            // Form validation
            this.setupFormValidation(contactForm);
        }
    }

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        let isValid = true;
        const value = field.value.trim();
        
        // Remove existing error
        this.clearFieldError(field);
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.color = 'var(--color-error)';
            errorElement.style.fontSize = 'var(--font-size-sm)';
            errorElement.style.marginTop = 'var(--spacing-xs)';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleFormSubmission(form) {
        const submitButton = form.querySelector('.btn-submit');
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showFormMessage('Please correct the errors above', 'error');
            return;
        }
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (like checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        try {
            // Simulate API call (replace with actual endpoint)
            await this.simulateApiCall(data);
            
            // Show success message
            this.showFormMessage('Thank you! Your project inquiry has been sent. We\'ll get back to you within 24-48 hours.', 'success');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage('Something went wrong. Please try again or contact us directly.', 'error');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    async simulateApiCall(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Log form data for development
        console.log('Form submission data:', data);
        
        // In production, replace with actual API call:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }
        // 
        // return response.json();
    }

    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;
        
        // Style the message
        messageElement.style.padding = 'var(--spacing-md)';
        messageElement.style.marginTop = 'var(--spacing-md)';
        messageElement.style.borderRadius = 'var(--radius-md)';
        messageElement.style.fontSize = 'var(--font-size-sm)';
        
        if (type === 'success') {
            messageElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            messageElement.style.color = 'var(--color-success)';
            messageElement.style.border = '1px solid var(--color-success)';
        } else if (type === 'error') {
            messageElement.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
            messageElement.style.color = 'var(--color-error)';
            messageElement.style.border = '1px solid var(--color-error)';
        }
        
        // Insert message after form
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(messageElement, form.nextSibling);
        
        // Remove message after 10 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 10000);
    }

    // Audio Integration
    setupAudioTriggers() {
        const playButtons = document.querySelectorAll('.play-btn, .sample-btn');
        
        playButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const audioSrc = button.dataset.audio;
                if (audioSrc && window.audioPlayer) {
                    window.audioPlayer.loadTrack(audioSrc, this.getTrackInfo(button));
                }
            });
        });

        // Featured work button
        const featuredButton = document.getElementById('playFeatured');
        if (featuredButton) {
            featuredButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Play first featured project
                const firstProject = document.querySelector('.project-card .play-btn');
                if (firstProject) {
                    firstProject.click();
                }
            });
        }
    }

    getTrackInfo(button) {
        // Extract track information from the button's context
        const card = button.closest('.project-card, .contributor-card-detailed');
        
        if (card) {
            const title = card.querySelector('.project-title, .contributor-name')?.textContent || 'Unknown Track';
            const artist = card.querySelector('.project-category, .contributor-role')?.textContent || 'AudiEssencia';
            const image = card.querySelector('.project-image, .contributor-image')?.src || '';
            
            return { title, artist, image };
        }
        
        return {
            title: 'Unknown Track',
            artist: 'audioessentia.com',
            image: ''
        };
    }

    // Scroll Effects
    setupScrollEffects() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll(
            '.project-card, .contributor-card, .contributor-card-detailed, .faq-item'
        );
        
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });

        // Parallax effect for hero section
        this.setupParallaxEffect();
    }

    setupParallaxEffect() {
        const heroVisual = document.querySelector('.hero-visual');
        
        if (heroVisual) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                heroVisual.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    // Accessibility Features
    setupAccessibility() {
        // Skip to main content link
        this.createSkipLink();
        
        // Keyboard navigation improvements
        this.setupKeyboardNavigation();
        
        // Focus management
        this.setupFocusManagement();
    }

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        // Style the skip link
        skipLink.style.position = 'absolute';
        skipLink.style.top = '-40px';
        skipLink.style.left = '6px';
        skipLink.style.background = 'var(--color-primary)';
        skipLink.style.color = 'var(--color-bg-primary)';
        skipLink.style.padding = '8px';
        skipLink.style.textDecoration = 'none';
        skipLink.style.borderRadius = '4px';
        skipLink.style.zIndex = '9999';
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupKeyboardNavigation() {
        // Add keyboard support for custom buttons
        const customButtons = document.querySelectorAll('.play-btn, .sample-btn, .filter-btn');
        
        customButtons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    setupFocusManagement() {
        // Trap focus in modal/overlay elements
        const modals = document.querySelectorAll('.modal, .overlay');
        
        modals.forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.trapFocus(e, modal);
                }
            });
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }

    // Waveform Animation
    initWaveformAnimation() {
        const waveformMain = document.getElementById('waveformPath');
        const waveformBackground = document.getElementById('waveformBackground');
        const waveformOverlay = document.getElementById('waveformOverlay');
        
        if (waveformMain) {
            let animationId;
            let time = 0;
            let isVisible = true;
            
            // Function to generate waveform points with specific characteristics
            const generateWaveform = (timeOffset, frequencyMult, amplitudeMult, noiseMult = 1) => {
                const points = [];
                const baseY = 50; // Center line
                const width = 400;
                const samples = 100; // More sample points for smoother curve
                
                for (let i = 0; i <= samples; i++) {
                    const x = (i / samples) * width;
                    const normalizedX = i / samples;
                    
                    // Multiple sine waves for complex waveform
                    let y = baseY;
                    
                    // Primary frequency wave
                    y += Math.sin(normalizedX * Math.PI * 3 * frequencyMult + time * 2 + timeOffset) * 12 * amplitudeMult;
                    
                    // Secondary harmonics
                    y += Math.sin(normalizedX * Math.PI * 6 * frequencyMult + time * 3.5 + timeOffset) * 6 * amplitudeMult;
                    y += Math.sin(normalizedX * Math.PI * 12 * frequencyMult + time * 5 + timeOffset) * 3 * amplitudeMult;
                    
                    // High frequency details
                    y += Math.sin(normalizedX * Math.PI * 24 * frequencyMult + time * 8 + timeOffset) * 1.5 * amplitudeMult;
                    
                    // Low frequency modulation for amplitude variation
                    const envelope = 0.7 + 0.4 * Math.sin(normalizedX * Math.PI * 1.5 + time * 1.2 + timeOffset * 0.5);
                    y = baseY + (y - baseY) * envelope;
                    
                    // Add realistic audio noise
                    y += (Math.random() - 0.5) * 1.5 * noiseMult * amplitudeMult;
                    
                    // Breathing effect - overall amplitude modulation
                    const breathe = 0.8 + 0.2 * Math.sin(time * 0.8 + timeOffset * 0.3);
                    y = baseY + (y - baseY) * breathe;
                    
                    // Ensure wave stays within bounds
                    y = Math.max(15, Math.min(85, y));
                    
                    points.push([x, y]);
                }
                
                return points;
            };
            
            // Function to create smooth SVG path from points
            const createSmoothPath = (points) => {
                if (points.length < 2) return '';
                
                let pathData = `M${points[0][0]},${points[0][1]}`;
                
                // Use cubic Bezier curves for ultra-smooth waveform
                for (let i = 1; i < points.length - 1; i++) {
                    const [x1, y1] = points[i];
                    const [x2, y2] = points[i + 1];
                    const [x0, y0] = points[i - 1];
                    
                    // Calculate control points for smooth curves
                    const cp1x = x1 - (x2 - x0) * 0.1;
                    const cp1y = y1 - (y2 - y0) * 0.1;
                    const cp2x = x1 + (x2 - x0) * 0.1;
                    const cp2y = y1 + (y2 - y0) * 0.1;
                    
                    pathData += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
                }
                
                return pathData;
            };
            
            const animate = () => {
                if (!isVisible) return;
                
                time += 0.016; // Approximately 60fps
                
                // Generate different waveforms for each layer
                
                // Background waveform - low frequency, high amplitude
                if (waveformBackground) {
                    const bgPoints = generateWaveform(0, 0.8, 1.5, 0.3);
                    const bgPath = createSmoothPath(bgPoints);
                    waveformBackground.setAttribute('d', bgPath);
                }
                
                // Main waveform - medium frequency, standard amplitude
                const mainPoints = generateWaveform(Math.PI * 0.3, 1.2, 1.0, 1.0);
                const mainPath = createSmoothPath(mainPoints);
                waveformMain.setAttribute('d', mainPath);
                
                // Overlay waveform - high frequency, lower amplitude
                if (waveformOverlay) {
                    const overlayPoints = generateWaveform(Math.PI * 0.7, 2.0, 0.6, 1.5);
                    const overlayPath = createSmoothPath(overlayPoints);
                    waveformOverlay.setAttribute('d', overlayPath);
                }
                
                animationId = requestAnimationFrame(animate);
            };
            
            animate();
            
            // Pause animation when not visible for performance
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isVisible = entry.isIntersecting;
                    if (isVisible && !animationId) {
                        animate();
                    } else if (!isVisible && animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                });
            });
            
            observer.observe(waveformMain);
        }
    }

    // Audio Visualizer
    initAudioVisualizer() {
        const canvas = document.getElementById('audioVisualizer');
        
        if (canvas) {
            const ctx = canvas.getContext('2d');
            const resizeCanvas = () => {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            };
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            // Create ambient visualization
            this.createAmbientVisualization(ctx, canvas);
        }
    }

    createAmbientVisualization(ctx, canvas) {
        const particles = [];
        const numParticles = 60;
        let time = 0;
        
        // Initialize particles with audio-reactive properties
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.2,
                size: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2,
                frequency: Math.random() * 0.02 + 0.01,
                amplitude: Math.random() * 20 + 10
            });
        }
        
        const animate = () => {
            time += 0.016;
            
            // Create subtle background gradient
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
            );
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.02)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles with audio-reactive movement
            particles.forEach((particle, index) => {
                // Audio-reactive oscillation
                const oscillation = Math.sin(time * particle.frequency + particle.phase) * particle.amplitude;
                const yOffset = oscillation * 0.1;
                
                // Base movement
                particle.x += particle.vx;
                particle.y += particle.vy + yOffset * 0.01;
                
                // Audio-reactive size pulsing
                const pulseScale = 1 + Math.sin(time * 2 + particle.phase) * 0.3;
                const currentSize = particle.size * pulseScale;
                
                // Breathing opacity effect
                const breathingOpacity = particle.opacity * (0.8 + 0.4 * Math.sin(time * 0.8 + particle.phase));
                
                // Wrap around edges with smooth transition
                if (particle.x < -currentSize) particle.x = canvas.width + currentSize;
                if (particle.x > canvas.width + currentSize) particle.x = -currentSize;
                if (particle.y < -currentSize) particle.y = canvas.height + currentSize;
                if (particle.y > canvas.height + currentSize) particle.y = -currentSize;
                
                // Draw particle with glow effect
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
                
                // Create particle glow
                const particleGradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, currentSize * 3
                );
                particleGradient.addColorStop(0, `rgba(0, 212, 255, ${breathingOpacity})`);
                particleGradient.addColorStop(0.5, `rgba(0, 212, 255, ${breathingOpacity * 0.3})`);
                particleGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
                
                ctx.fillStyle = particleGradient;
                ctx.fill();
                
                // Draw core particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, currentSize * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(51, 221, 255, ${breathingOpacity * 1.5})`;
                ctx.fill();
            });
            
            // Draw dynamic connections between nearby particles
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        const connectionStrength = (120 - distance) / 120;
                        const opacity = connectionStrength * 0.15;
                        
                        // Audio-reactive connection thickness
                        const thickness = 0.5 + Math.sin(time * 3 + i * 0.5) * 0.3;
                        
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                        ctx.lineWidth = thickness;
                        ctx.stroke();
                    }
                });
            });
            
            // Add subtle waveform overlay on canvas
            ctx.beginPath();
            const waveY = canvas.height / 2;
            ctx.moveTo(0, waveY);
            
            for (let x = 0; x <= canvas.width; x += 2) {
                const normalizedX = x / canvas.width;
                const wave = Math.sin(normalizedX * Math.PI * 4 + time * 2) * 8 +
                           Math.sin(normalizedX * Math.PI * 8 + time * 3) * 4;
                ctx.lineTo(x, waveY + wave);
            }
            
            ctx.strokeStyle = `rgba(0, 212, 255, 0.1)`;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Lazy Loading
    initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.classList.add('loaded');
            });
        }
    }

    // Utility Methods
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application
window.audiEssenciaApp = new AudiEssenciaApp();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudiEssenciaApp;
} 