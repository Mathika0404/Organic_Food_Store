
// =====================================
// GREENORA - MAIN JAVASCRIPT
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // ELEMENT REFERENCES
    // =====================================

    const pageLoader = document.getElementById("pageLoader");
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    const heroSlides = document.querySelectorAll(".hero-slide");
    const slideDots = document.querySelectorAll(".slide-dot");
    const currentSlideText = document.getElementById("currentSlide");

    // =====================================
    // ACTIVE NAVIGATION - PAGE BASED
    // =====================================

    function setActiveNavigation() {

        const navLinks = document.querySelectorAll(".nav-link");

        let currentPage = window.location.pathname
            .split("/")
            .filter(Boolean)
            .pop();

        // Root URL means Home page
        if (!currentPage || !currentPage.includes(".")) {
            currentPage = "index.html";
        }

        currentPage = currentPage.toLowerCase();

        navLinks.forEach(link => {

            const linkHref = link.getAttribute("href");

            if (!linkHref) return;

            const linkPage = linkHref
                .split("/")
                .pop()
                .split("?")[0]
                .split("#")[0]
                .toLowerCase();

            link.classList.toggle(
                "active",
                linkPage === currentPage
            );

            link.removeAttribute("aria-current");

            if (linkPage === currentPage) {
                link.setAttribute("aria-current", "page");
            }

        });

    }

    setActiveNavigation();


    // =====================================
    // PRELOADER - MINIMUM 3 SECONDS
    // =====================================

    const PRELOADER_TIME = 3000;
    const pageStartTime = performance.now();

    function finishPreloader() {

        const elapsedTime = performance.now() - pageStartTime;
        const remainingTime = Math.max(
            0,
            PRELOADER_TIME - elapsedTime
        );

        setTimeout(() => {

            if (pageLoader) {
                pageLoader.classList.add("loader-hide");
            }

            document.body.classList.add("loaded");

            // Start slider after preloader
            startHeroSlider();

            // Start scroll reveal after preloader
            initializeScrollAnimations();

        }, remainingTime);

    }

    if (document.readyState === "complete") {
        finishPreloader();
    } else {
        window.addEventListener("load", finishPreloader, {
            once: true
        });
    }


    // =====================================
    // HERO BACKGROUND SLIDER
    // =====================================

    let currentIndex = 0;
    let sliderInterval = null;

    function showSlide(index) {

        if (!heroSlides.length) return;

        heroSlides.forEach(slide => {
            slide.classList.remove("active");
        });

        slideDots.forEach(dot => {
            dot.classList.remove("active");
        });

        heroSlides[index]?.classList.add("active");
        slideDots[index]?.classList.add("active");

        if (currentSlideText) {
            currentSlideText.textContent = String(index + 1).padStart(2, "0");
        }

        currentIndex = index;

    }

    function startHeroSlider() {

        if (heroSlides.length <= 1) return;

        if (sliderInterval) {
            clearInterval(sliderInterval);
        }

        sliderInterval = setInterval(() => {

            const nextIndex =
                (currentIndex + 1) % heroSlides.length;

            showSlide(nextIndex);

        }, 5000);

    }

    // Manual slide controls

    slideDots.forEach(dot => {

        dot.addEventListener("click", function () {

            const index = Number(this.dataset.slide);

            if (
                Number.isInteger(index) &&
                index >= 0 &&
                index < heroSlides.length
            ) {
                showSlide(index);
                startHeroSlider();
            }

        });

    });


    // =====================================
    // SCROLL REVEAL ANIMATION
    // =====================================

    function initializeScrollAnimations() {

        const revealElements =
            document.querySelectorAll(".scroll-reveal");

        if (!("IntersectionObserver" in window)) {

            revealElements.forEach(element => {
                element.classList.add("active");
            });

            return;
        }

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("active");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element, index) => {

            const parent = element.parentElement;

            if (
                parent &&
                (
                    parent.classList.contains("features-container") ||
                    parent.classList.contains("blogs-container")
                )
            ) {
                element.style.transitionDelay =
                    `${(index % 4) * 0.15}s`;
            }

            revealObserver.observe(element);

        });

    }


    // =====================================
    // NAVBAR SCROLL EFFECT
    // =====================================

    if (navbar) {

        function updateNavbar() {

            navbar.classList.toggle(
                "scrolled",
                window.scrollY > 50
            );

        }

        updateNavbar();

        window.addEventListener("scroll", updateNavbar, {
            passive: true
        });

    }


    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", function () {

            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("menu-open");

        });

        // Close mobile menu after navigation

        document.querySelectorAll(
            ".nav-menu .nav-link, .mobile-shop-btn"
        ).forEach(link => {

            link.addEventListener("click", function () {

                menuToggle.classList.remove("active");
                navMenu.classList.remove("menu-open");

            });

        });

        // Close menu when clicking outside

        document.addEventListener("click", function (event) {

            if (
                navbar &&
                !navbar.contains(event.target) &&
                navMenu.classList.contains("menu-open")
            ) {

                menuToggle.classList.remove("active");
                navMenu.classList.remove("menu-open");

            }

        });

    }

});


/* ==========================================
   GREENORA SHOP CATEGORY FILTER
========================================== */

const categoryButtons = document.querySelectorAll(
    ".shop-categories .category-btn"
);

const productCards = document.querySelectorAll(
    ".organic-products-grid .organic-product-card"
);

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedCategory = button.dataset.filter;

        // Active category button
        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // Filter products
        productCards.forEach(card => {

            const productCategory = card.dataset.category;

            if (
                selectedCategory === "all" ||
                productCategory === selectedCategory
            ) {

                card.style.display = "block";

                card.classList.remove("filter-show");

                void card.offsetWidth;

                card.classList.add("filter-show");

            } else {

                card.style.display = "none";

                card.classList.remove("filter-show");

            }

        });

    });

});


/* ==========================================
   FARMING PROCESS SCROLL REVEAL
========================================== */

const processRevealElements = document.querySelectorAll(".process-reveal");

const processObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("process-visible");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});

processRevealElements.forEach(element => {
    processObserver.observe(element);
});

/* ==========================================
   GREENORA FAQ ACCORDION
========================================== */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");
    const icon = item.querySelector(".faq-toggle-icon i");

    question.addEventListener("click", () => {

        const isAlreadyOpen = item.classList.contains("active");

        // Close all FAQ items
        faqItems.forEach(faq => {

            faq.classList.remove("active");

            const faqIcon = faq.querySelector(".faq-toggle-icon i");

            faqIcon.classList.remove("fa-minus");
            faqIcon.classList.add("fa-plus");

            faq.querySelector(".faq-question")
                .setAttribute("aria-expanded", "false");

        });

        // Open selected item
        if (!isAlreadyOpen) {

            item.classList.add("active");

            icon.classList.remove("fa-plus");
            icon.classList.add("fa-minus");

            question.setAttribute("aria-expanded", "true");

        }

    });

});


/* ==========================================
   FAQ SCROLL REVEAL
========================================== */

const faqRevealElements = document.querySelectorAll(".faq-reveal");

const faqObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("faq-visible");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});

faqRevealElements.forEach(element => {
    faqObserver.observe(element);
});