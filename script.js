// M3M GIC Manesar - Interactive JavaScript

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close other open items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission Handlers
const heroForm = document.getElementById('hero-form');
const contactForm = document.getElementById('contact-form');

// Hero Form Submission
if (heroForm) {
    heroForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Here you would typically send data to your backend
        console.log('Hero Form Data:', data);

        // Show success message
        alert('Thank you for your enquiry! Our team will contact you shortly.');

        // Reset form
        this.reset();

        // In production, you would send this to your backend:
        // fetch('/api/submit-enquiry', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(result => {
        //     alert('Thank you for your enquiry! Our team will contact you shortly.');
        //     this.reset();
        // })
        // .catch(error => {
        //     alert('Sorry, there was an error. Please try again or call us directly.');
        // });
    });
}

// Initialize Supabase
const supabaseUrl = 'https://ruvywwcghcppvsjdbxdp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1dnl3d2NnaGNwcHZzamRieGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODI3NDgsImV4cCI6MjA4MTU1ODc0OH0.LESKKK61q4EmozMTwtFCUINchUYYpqv6mONKFwu-PJ4';
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Monitor External Form Submission (systeme.io)
// Function to show thank you message
function showThankYouMessage() {
    const leadFormContainer = document.getElementById('lead-form');
    if (!leadFormContainer) return;

    // Create thank you overlay
    const thankYouOverlay = document.createElement('div');
    thankYouOverlay.className = 'thank-you-overlay';
    thankYouOverlay.innerHTML = `
        <div class="thank-you-card">
            <div class="thank-you-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Thank You!</h2>
            <p class="thank-you-main">Your enquiry has been submitted successfully.</p>
            <p class="thank-you-sub">Our team will contact you within 24 hours.</p>
            <button class="btn-close-thankyou" onclick="closeThankYouMessage()">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;

    // Add styles
    thankYouOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        animation: fadeIn 0.3s ease;
    `;

    document.body.appendChild(thankYouOverlay);

    // Auto-close after 8 seconds
    setTimeout(() => {
        closeThankYouMessage();
    }, 8000);
}

// Function to close thank you message
function closeThankYouMessage() {
    const overlay = document.querySelector('.thank-you-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Make function globally available
window.closeThankYouMessage = closeThankYouMessage;

// Monitor for form submission using MutationObserver
function monitorExternalForm() {
    const leadFormContainer = document.getElementById('lead-form');
    if (!leadFormContainer) {
        // Retry after a short delay if form not loaded yet
        setTimeout(monitorExternalForm, 1000);
        return;
    }

    // Observer for DOM changes in the form container
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // Check for success message indicators
                    const successIndicators = [
                        'thank',
                        'success',
                        'submitted',
                        'received',
                        'merci',
                        'gracias'
                    ];

                    const nodeText = node.textContent?.toLowerCase() || '';
                    const hasSuccessMessage = successIndicators.some(indicator =>
                        nodeText.includes(indicator)
                    );

                    if (hasSuccessMessage) {
                        console.log('Form submission detected!');
                        showThankYouMessage();
                    }
                }
            });
        });
    });

    // Start observing
    observer.observe(leadFormContainer, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Also listen for form submit events within the container
    leadFormContainer.addEventListener('submit', (e) => {
        // Wait a bit for the external form to process
        setTimeout(() => {
            showThankYouMessage();
        }, 1500);
    }, true);
}

// Initialize monitoring when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', monitorExternalForm);
} else {
    monitorExternalForm();
}

// Legacy Contact Form Submission (if exists)
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.btn-submit-new') || this.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        try {
            const { error } = await supabaseClient
                .from('gic_leads')
                .insert([
                    {
                        name: data.name,
                        phone: data.phone,
                        email: data.email || null,
                        property_type: data['property-type'] || null,
                        message: data.message || null
                    }
                ]);

            if (error) throw error;

            // Show success message
            this.reset();
            showThankYouMessage();

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Sorry, there was an error submitting your request. Please try again.');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
const animatedElements = document.querySelectorAll(
    '.highlight-card, .amenity-card, .price-card, .floorplan-card, .gallery-item'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Phone number validation
const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach(input => {
    input.addEventListener('input', function (e) {
        // Remove non-numeric characters
        this.value = this.value.replace(/[^0-9]/g, '');

        // Limit to 10 digits
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });
});

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Add active state to header on scroll
const header = document.querySelector('.sticky-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.padding = '10px 0';
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.padding = '15px 0';
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Gallery lightbox effect (simple version)
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', function () {
        const img = this.querySelector('img');
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
            </div>
        `;

        // Add lightbox styles
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
        `;

        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;

        const close = lightbox.querySelector('.lightbox-close');
        close.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        `;

        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 90vh;
            border-radius: 8px;
        `;

        document.body.appendChild(lightbox);

        // Close lightbox on click
        lightbox.addEventListener('click', function () {
            document.body.removeChild(lightbox);
        });

        close.addEventListener('click', function (e) {
            e.stopPropagation();
            document.body.removeChild(lightbox);
        });
    });
});

// Download brochure functionality
const downloadBtn = document.querySelector('.btn-download');

if (downloadBtn) {
    downloadBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // In production, this would trigger actual PDF download
        alert('Thank you for your interest! Please fill the enquiry form to receive the brochure via email.');

        // Scroll to enquiry form
        document.getElementById('enquiry-form').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Request floor plan functionality
const floorplanBtns = document.querySelectorAll('.btn-floorplan');

floorplanBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();

        alert('Please fill the enquiry form to receive detailed floor plans via email.');

        // Scroll to enquiry form
        document.getElementById('enquiry-form').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Console log for debugging
console.log('M3M GIC Manesar - Website Loaded Successfully');
console.log('For enquiries, please fill the contact form or call us directly.');
