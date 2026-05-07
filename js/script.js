/* ========================================
   Egyptian Realty - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Navbar Elements
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.navbar-menu a');

    // Modal Elements
    const openModalBtn = document.querySelector('.hero-cta-btn');
    const projectButtons = document.querySelectorAll('.project-inquiry-btn');
    const modal = document.querySelector('.modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalProjectName = document.querySelector('.modal-project-name');
    const modalProjectInput = document.querySelector('#project-name');

    const cookiePopup = document.querySelector('#cookie-popup');
    const cookiePopupClose = document.querySelector('#cookie-popup-close');

    let lastScrollTop = 0;

    // Hamburger Menu Toggle
    if (hamburger && navbarMenu && menuOverlay) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navbarMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });
    }

    // Close Menu on Link Click
    if (navLinks.length && hamburger && navbarMenu && menuOverlay) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navbarMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
            });
        });
    }

    // Close Menu on Overlay Click
    if (menuOverlay && hamburger && navbarMenu) {
        menuOverlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    // Hide/Show Header on Scroll
    if (header) {
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop) {
                // Scrolling Down - Hide Header
                header.classList.add('hide');
            } else {
                // Scrolling Up - Show Header
                header.classList.remove('hide');
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    // Close Menu on Outside Click (when clicking on body)
    document.addEventListener('click', function(event) {
        const navbar = document.querySelector('.navbar');
        
        if (navbar && hamburger && navbarMenu && menuOverlay) {
            if (!navbar.contains(event.target) && !hamburger.contains(event.target)) {
                if (navbarMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navbarMenu.classList.remove('active');
                    menuOverlay.classList.remove('active');
                }
            }
        }
    });

    // Modal Functions
    const openModal = (projectName = '') => {
        if (modal && modalOverlay) {
            modal.classList.add('active');
            modalOverlay.classList.add('active');
            document.body.classList.add('modal-open');
        }

        if (modalProjectName) {
            modalProjectName.textContent = projectName ? `المشروع: ${projectName}` : '';
        }

        if (modalProjectInput) {
            modalProjectInput.value = projectName;
        }
    };

    const closeModal = () => {
        if (modal && modalOverlay) {
            modal.classList.remove('active');
            modalOverlay.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    };

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => openModal(''));
    }

    if (projectButtons.length) {
        projectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectName = button.getAttribute('data-project') || '';
                openModal(projectName);
            });
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    const cookiePopupStorageKey = 'cookieNoticeDismissed';
    let cookiePopupTimer;

    const hideCookiePopup = () => {
        if (!cookiePopup) {
            return;
        }

        cookiePopup.classList.remove('active');
        if (cookiePopupTimer) {
            clearTimeout(cookiePopupTimer);
        }

        try {
            localStorage.setItem(cookiePopupStorageKey, 'true');
        } catch (error) {
        }
    };

    const showCookiePopup = () => {
        if (!cookiePopup) {
            return;
        }

        let isDismissed = false;
        try {
            isDismissed = localStorage.getItem(cookiePopupStorageKey) === 'true';
        } catch (error) {
            isDismissed = false;
        }

        if (isDismissed) {
            return;
        }

        cookiePopup.classList.add('active');

        cookiePopupTimer = setTimeout(() => {
            hideCookiePopup();
        }, 9000);

        window.addEventListener('scroll', hideCookiePopup, { once: true });
    };

    if (cookiePopupClose) {
        cookiePopupClose.addEventListener('click', hideCookiePopup);
    }

    showCookiePopup();

    // ========================================
    // LIGHTBOX FUNCTIONALITY
    // ========================================

    const galleryImages = [
        'assets/gallery-1.jpg',
        'assets/gallery-2.jpg',
        'assets/gallery-3.jpg',
        'assets/gallery-4.jpg',
        'assets/gallery-5.jpg',
        'assets/gallery-6.jpg',
        'assets/gallery-7.jpg',
        'assets/gallery-8.jpg',
        'assets/gallery-9.jpg'
    ];

    let currentImageIndex = 0;

    window.openLightbox = function(index) {
        currentImageIndex = index;
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        
        if (lightbox && lightboxImage) {
            lightboxImage.src = galleryImages[currentImageIndex];
            lightbox.classList.add('active');
            document.body.classList.add('modal-open');
        }
    };

    window.closeLightbox = function() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    };

    window.changeImage = function(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        }
        
        const lightboxImage = document.getElementById('lightbox-image');
        if (lightboxImage) {
            lightboxImage.src = galleryImages[currentImageIndex];
        }
    };

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(event) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            if (event.key === 'Escape') {
                window.closeLightbox();
            } else if (event.key === 'ArrowRight') {
                window.changeImage(1);
            } else if (event.key === 'ArrowLeft') {
                window.changeImage(-1);
            }
        }
    });
});

/* ========================================
   Language Toggle for Policy Pages
   ======================================== */

function toggleLanguage() {
    const arabicContent = document.getElementById('arabic-content');
    const englishContent = document.getElementById('english-content');
    const policyTitle = document.getElementById('policy-title');
    const langToggle = document.querySelector('.lang-toggle');

    if (arabicContent && englishContent && langToggle) {
        // Check which content is currently visible
        const isArabicVisible = arabicContent.style.display !== 'none';

        if (isArabicVisible) {
            // Switch to English
            arabicContent.style.display = 'none';
            englishContent.style.display = 'block';
            langToggle.textContent = 'العربية';
            policyTitle.textContent = 'Privacy Policy';
        } else {
            // Switch to Arabic
            arabicContent.style.display = 'block';
            englishContent.style.display = 'none';
            langToggle.textContent = 'English';
            policyTitle.textContent = 'سياسة الخصوصية';
        }
    }
}

