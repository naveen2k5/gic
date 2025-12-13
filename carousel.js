// Hero Image Carousel JavaScript

let currentSlideIndex = 0;
let autoSlideInterval;

// Initialize carousel
document.addEventListener('DOMContentLoaded', function () {
    startAutoSlide();
});

// Change slide function
function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Remove active class from current slide and dot
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');

    // Calculate new index
    currentSlideIndex += direction;

    // Loop around
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }

    // Add active class to new slide and dot
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    // Reset auto-slide timer
    resetAutoSlide();
}

// Go to specific slide
function currentSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Remove active class from current slide and dot
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');

    // Set new index
    currentSlideIndex = index;

    // Add active class to new slide and dot
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    // Reset auto-slide timer
    resetAutoSlide();
}

// Auto-slide functionality
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

// Reset auto-slide timer
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Pause auto-slide on hover
const heroSlider = document.querySelector('.hero-image-slider');
if (heroSlider) {
    heroSlider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    heroSlider.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
}
