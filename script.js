/**
 * ARQUIVO: script.js
 * ESTRUTURA UNIFICADA E ATUALIZADA
 */

document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // 1. CONTROLE DO MENU MOBILE (SIDEBAR / OVERLAY)
    // =======================================================
    const overlay = document.getElementById('mobileOverlay');
    const sidebar = document.getElementById('mobileSidebar');
    const closeBtn = document.getElementById('mobileCloseBtn');
    const toggleBtns = document.querySelectorAll('.mobile-toggle-btn');
    const sidebarLinks = document.querySelectorAll('.mobile-sidebar-nav a');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        toggleBtns.forEach(btn => btn.classList.add('open'));
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';

        toggleBtns.forEach(btn => btn.classList.remove('open'));
    }

    function toggleSidebar() {
        if (sidebar && sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    // Eventos de clique do menu mobile
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Fecha o menu lateral automaticamente se redimensionar para Desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1170) {
            closeSidebar();
        }
    });

    // =======================================================
    // 2. SCROLL SUAVE PARA ÂNCORAS
    // =======================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // =======================================================
    // 3. INICIALIZAÇÃO DE COMPONENTES DAS PÁGINAS
    // =======================================================
    initLogoCarousel();
    initServicosSlider();
    initProjetosEMetricas();
    initScrollAnimations();
});

/* --- FUNÇÕES AUXILIARES --- */

function initLogoCarousel() {
    const carouselTrack = document.getElementById('logos-carousel');
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselTrack || !carouselContainer) return;

    carouselTrack.style.animation = 'none';

    let scrollAmount = 0;
    const scrollSpeed = 2;
    const totalContentWidth = carouselTrack.scrollWidth / 2 || carouselTrack.scrollWidth;
    let isPaused = false;

    function animateScroll() {
        if (!isPaused) {
            scrollAmount += scrollSpeed;
            if (scrollAmount >= totalContentWidth) {
                scrollAmount = 0;
            }
            carouselTrack.style.transform = `translateX(-${scrollAmount}px)`;
        }
        requestAnimationFrame(animateScroll);
    }

    animateScroll();

    carouselContainer.addEventListener('mouseover', () => isPaused = true);
    carouselContainer.addEventListener('mouseout', () => isPaused = false);
    carouselContainer.addEventListener('touchstart', () => isPaused = true, { passive: true });
    carouselContainer.addEventListener('touchend', () => isPaused = false);
}

function initServicosSlider() {
    const track = document.getElementById('servicosTrack');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (!track) return;

    let currentBlock = 0;
    let startX = 0;
    let endX = 0;

    function getMoveAmount() {
        return track.parentElement ? track.parentElement.clientWidth : 320;
    }

    function updateSlider() {
        const moveAmount = getMoveAmount();
        track.style.transform = `translateX(-${currentBlock * moveAmount}px)`;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentBlock = (currentBlock === 0) ? 1 : 0;
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentBlock = (currentBlock === 1) ? 0 : 1;
            updateSlider();
        });
    }

    // Suporte a gestos de deslize (swipe) no mobile
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        if (Math.abs(diffX) > 50) {
            if (diffX > 0 && currentBlock === 0) {
                currentBlock = 1;
            } else if (diffX < 0 && currentBlock === 1) {
                currentBlock = 0;
            }
            updateSlider();
        }
    });

    window.addEventListener('resize', updateSlider);
}

function initProjetosEMetricas() {
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    const cardsProjetos = document.querySelectorAll('.projeto-card');

    if (botoesFiltro.length > 0 && cardsProjetos.length > 0) {
        botoesFiltro.forEach(botao => {
            botao.addEventListener('click', () => {
                botoesFiltro.forEach(b => b.classList.remove('active'));
                botao.classList.add('active');

                const filtro = botao.getAttribute('data-filter');

                cardsProjetos.forEach(card => {
                    const categoria = card.getAttribute('data-category');
                    if (filtro === 'todos' || categoria === filtro) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    const numElements = document.querySelectorAll('.metrica-numero');
    const bannerMetricas = document.querySelector('.metricas-banner');

    if (bannerMetricas && numElements.length > 0) {
        const metricaObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    numElements.forEach(num => animateCounter(num));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        metricaObserver.observe(bannerMetricas);
    }
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    let startValue = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));

    const timer = setInterval(() => {
        startValue += step;
        if (startValue >= target) {
            element.innerText = `${prefix}${target}${suffix}`;
            clearInterval(timer);
        } else {
            element.innerText = `${prefix}${startValue}${suffix}`;
        }
    }, 16);
}

function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll(
        '.vantagem-item, .servico-card, .processo-step, .carousel-item, .footer-col'
    );

    if (elementsToAnimate.length === 0) return;

    elementsToAnimate.forEach(el => el.classList.add('animate-on-scroll'));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    elementsToAnimate.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.mobile-toggle-btn');
    const closeBtn = document.getElementById('mobileCloseBtn');
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('mobileOverlay');

    function openMenu() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }

    function closeMenu() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
});