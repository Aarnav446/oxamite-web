document.addEventListener("DOMContentLoaded", () => {
    // Check if GSAP is available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP or ScrollTrigger is not loaded.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Disable heavy animations on mobile for performance
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
        /* --- Hero Stagger Animations --- */
        const heroTimeline = gsap.timeline();
        
        // Wait a tiny bit for the page to render
        heroTimeline.fromTo(".hero-title", 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
        )
        .fromTo(".hero-subtitle", 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
            "-=0.6"
        )
        .fromTo(".hero-actions", 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 
            "-=0.4"
        );

        /* --- Scroll Reveal Animations --- */
        const fadeUpElements = document.querySelectorAll(".fade-up-anim");
        
        fadeUpElements.forEach((el) => {
            gsap.fromTo(el, 
                { y: 50, opacity: 0 },
                {
                    y: 0, 
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", // Trigger when element hits 85% of viewport
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    } else {
        // Fallback for mobile: Ensure elements are visible if we bypass GSAP hiding them
        // In our CSS, .fade-up-anim starts with opacity 0, so we need to set them to 1
        gsap.set(".fade-up-anim", { opacity: 1, y: 0 });
    }

    /* --- Vanilla Tilt Initialization --- */
    // Only initialize tilt on desktop/tablet to save performance
    if (!isMobile && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.05
        });
    }
});
