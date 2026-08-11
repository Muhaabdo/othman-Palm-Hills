/* ========================================
   Egyptian Realty - Main JavaScript
   ======================================== */

/* رابط Google Apps Script Web App اللي بيسجل بيانات الفورم في Google Sheet.
   استبدل القيمة دي بالرابط اللي هيطلع لك بعد عمل Deploy (بينتهي بـ /exec). */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxMvi9LP9qXM-SDYyIAZSShJT6gGLOENOd7mxW-yelkYFIh6iTMHbZts8fFcoRs6DxF/exec';


document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // GCLID CAPTURE (Google Ads click tracking)
    // ========================================
    // بياخد الـ gclid من رابط الصفحة لو المستخدم جاي من إعلان جوجل،
    // ويحتفظ بيه لحد ما يبعت الفورم حتى لو تصفح الصفحة شوية الأول.
    const gclidStorageKey = 'gclid';
    const urlGclid = new URLSearchParams(window.location.search).get('gclid');

    if (urlGclid) {
        try {
            localStorage.setItem(gclidStorageKey, urlGclid);
        } catch (error) {
        }
    }

    let storedGclid = urlGclid || '';
    if (!storedGclid) {
        try {
            storedGclid = localStorage.getItem(gclidStorageKey) || '';
        } catch (error) {
            storedGclid = '';
        }
    }

    if (storedGclid) {
        document.querySelectorAll('.gclid-field').forEach(field => {
            field.value = storedGclid;
        });
    }

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
    const modalUnitTypeInput = document.querySelector('#unit-type');

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
    const openModal = (unitType = '') => {
        if (modal && modalOverlay) {
            modal.classList.add('active');
            modalOverlay.classList.add('active');
            document.body.classList.add('modal-open');
        }

        if (modalProjectName) {
            modalProjectName.textContent = unitType ? `نوع الوحدة: ${unitType}` : '';
        }

        if (modalUnitTypeInput) {
            modalUnitTypeInput.value = unitType;
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
    // SEND LEADS TO GOOGLE SHEET (in addition to FormSubmit email)
    // ========================================

    const gsheetForms = document.querySelectorAll('.gsheet-form');
    const isScriptUrlConfigured = GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.indexOf('PASTE_YOUR') !== 0;

    if (isScriptUrlConfigured && gsheetForms.length) {
        gsheetForms.forEach(form => {
            // مش بنعمل preventDefault عشان الفورم يفضل يبعت الإيميل زي ما هو عن طريق FormSubmit،
            // وفي نفس الوقت بنبعت نسخة للـ Google Sheet قبل ما الصفحة تتنقل.
            form.addEventListener('submit', function() {
                const formData = new FormData(form);
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(GOOGLE_SCRIPT_URL, formData);
                } else {
                    fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: formData, keepalive: true });
                }
            });
        });
    }

    // ========================================
    // LIGHTBOX FUNCTIONALITY
    // ========================================

    const galleryImages = [
        'assets/view1.jpg',
        'assets/view 4.jpg',
        'assets/beachfrontvilla2.jpg',
        'assets/view 2.jpg',
        'assets/bayline villa.jpg',
        'assets/view5.jpg',
        'assets/costal villa.jpg',
        'assets/view 3.jpg',
        'assets/twin house 2.jpg',
        'assets/beachhome.jpg',
        'assets/junior chalet.jpg',
        'assets/view 6.jpg',
        'assets/beachhome2.jpg'
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

