document.addEventListener('DOMContentLoaded', () => {
    // MENU MOBILE
    const menuToggleButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggleButton && navLinks) {
        menuToggleButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggleButton.classList.toggle('active');
        });

        const allLinks = navLinks.querySelectorAll('a');
        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggleButton.classList.remove('active');
                }
            });
        });
    }

    // CARROSSEL DE DEPOIMENTOS
    initTestimonialSlider();
});

function initTestimonialSlider() {
    const sliderWrapper = document.querySelector('.testimonial-slider-wrapper');
    const slidesContainer = document.querySelector('.testimonial-slides');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');

    if (!sliderWrapper || !slidesContainer || cards.length === 0) return;

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    const autoplayInterval = 6000;
    let autoplayTimer;

    function getSlideWidth() {
        // a largura de referência é SEMPRE a largura do wrapper
        return sliderWrapper.offsetWidth;
    }

    function updateSlider() {
        const slideWidth = getSlideWidth();
        const offset = -currentIndex * slideWidth;
        slidesContainer.style.transform = `translateX(${offset}px)`;
    }

    function goToPrev() {
        currentIndex = (currentIndex === 0) ? cards.length - 1 : currentIndex - 1;
        updateSlider();
        resetAutoplay();
    }

    function goToNext() {
        currentIndex = (currentIndex === cards.length - 1) ? 0 : currentIndex + 1;
        updateSlider();
        resetAutoplay();
    }

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', goToNext);
        prevButton.addEventListener('click', goToPrev);
    }

    function startAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        if (window.innerWidth <= 700) return;
        autoplayTimer = setInterval(goToNext, autoplayInterval);
    }

    function resetAutoplay() {
        if (window.innerWidth > 700) {
            startAutoplay();
        } else if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
    }

    // Drag / Swipe
    function handleDragStart(clientX) {
        isDragging = true;
        startX = clientX;
        slidesContainer.style.transition = 'none';
        if (autoplayTimer) clearInterval(autoplayTimer);
    }

    function handleDragMove(clientX) {
        if (!isDragging) return;
        const walk = clientX - startX;
        const baseOffset = -currentIndex * getSlideWidth();
        slidesContainer.style.transform = `translateX(${baseOffset + walk}px)`;
    }

    function handleDragEnd(endX) {
        if (!isDragging) return;
        isDragging = false;
        slidesContainer.style.transition = 'transform 0.5s ease-in-out';

        const dragDistance = startX - endX;
        const sensitivity = sliderWrapper.offsetWidth * 0.2;

        if (dragDistance > sensitivity) {
            goToNext();
        } else if (dragDistance < -sensitivity) {
            goToPrev();
        } else {
            updateSlider();
            resetAutoplay();
        }
    }

    slidesContainer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handleDragStart(e.clientX);
    });

    slidesContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        handleDragMove(e.clientX);
    });

    slidesContainer.addEventListener('mouseup', (e) => {
        handleDragEnd(e.clientX);
    });

    slidesContainer.addEventListener('mouseleave', (e) => {
        if (!isDragging) return;
        handleDragEnd(e.clientX || startX);
    });

    slidesContainer.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        handleDragStart(touch.clientX);
    }, { passive: true });

    slidesContainer.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        handleDragMove(touch.clientX);
    }, { passive: true });

    slidesContainer.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        handleDragEnd(touch.clientX);
    });

    window.addEventListener('resize', () => {
        updateSlider();
        resetAutoplay();
    });

    updateSlider();
    startAutoplay();
}