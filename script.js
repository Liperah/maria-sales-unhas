/* DICA DE JÚNIOR: 
   Sempre coloque seu código JS dentro de um 'DOMContentLoaded'.
   Isso garante que o script só vai rodar DEPOIS que o HTML
   inteiro (o DOM) foi carregado. 
*/

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------
    // === MÓDULO 1: MENU MOBILE ===
    // ----------------------------------------
    const menuToggleButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggleButton && navLinks) {
        
        menuToggleButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggleButton.classList.toggle('active');
        });

        // Fechar o menu quando clicar em um link (no mobile)
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

    // ----------------------------------------
    // === MÓDULO 2: CARROSSEL DE DEPOIMENTOS ===
    // Chamamos a função de inicialização aqui!
    // ----------------------------------------
    initTestimonialSlider(); 
}); // <<< AQUI FECHA O ÚNICO E PRINCIPAL DOMContentLoaded

// ----------------------------------------
// === FUNÇÃO DO CARROSSEL (FORA DO DOMContentLoaded para ficar mais limpo) ===
// ----------------------------------------
function initTestimonialSlider() {
    // 🚀 NOVO: Função para calcular a largura exata de um slide (Card + Gap)

    function getSlideWidth() {
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

   // Função principal para mover o carrossel (SUBSTITUA ESTA FUNÇÃO EXISTENTE)
function updateSlider() {
    // Pega a largura do passo dinamicamente
    const slideWidth = getSlideWidth(); 
    
    // Calcula o novo deslocamento (offset) baseado no índice atual e no slideWidth
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

    nextButton.addEventListener('click', goToNext);
    prevButton.addEventListener('click', goToPrev);

    function startAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer); 

        autoplayTimer = setInterval(() => {
            goToNext();
        }, autoplayInterval);
    }

    // Reinicia o autoplay (mas só no desktop, como definimos no CSS)
    function resetAutoplay() {
        if (window.innerWidth > 700) { 
            startAutoplay();
        }
    }

    // === Lógica para Touch Swipe (Mobile) ===
    slidesContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        slidesContainer.style.transition = 'none';
        clearInterval(autoplayTimer); 
    });

    slidesContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        slidesContainer.style.transition = 'none';
        clearInterval(autoplayTimer);
    });

    slidesContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const walk = currentX - startX;
        slidesContainer.style.transform = `translateX(${-currentIndex * sliderWrapper.offsetWidth + walk}px)`;
    });

    slidesContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const walk = currentX - startX;
        slidesContainer.style.transform = `translateX(${-currentIndex * sliderWrapper.offsetWidth + walk}px)`;
    });

    slidesContainer.addEventListener('mouseup', handleDragEnd);
    slidesContainer.addEventListener('touchend', handleDragEnd);
    slidesContainer.addEventListener('mouseleave', () => {
        if (isDragging) handleDragEnd();
    });
    
    // Função unificada para fim do arrasto (Mouse e Touch)
    function handleDragEnd(event) {
        if (!isDragging) return;
        isDragging = false;
        slidesContainer.style.transition = 'transform 0.5s ease-in-out';

        // Tenta pegar a posição final do mouse (mouseup) ou do toque (touchend)
        const endX = event.clientX !== undefined ? event.clientX : (event.changedTouches && event.changedTouches[0].clientX);
        
        if (endX === undefined) {
             updateSlider(); // Se não conseguir a posição final (bug), volta para o slide atual
             resetAutoplay();
             return;
        }

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

    window.addEventListener('resize', updateSlider);

    updateSlider(); 
    startAutoplay();
}