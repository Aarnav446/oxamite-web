document.addEventListener("DOMContentLoaded", () => {
    /* --- Sticky Navbar --- */
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    /* --- Mobile Navigation --- */
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const overlay = document.querySelector(".mobile-nav-overlay");

    const toggleNav = () => {
        hamburger.classList.toggle("toggle");
        navLinks.classList.toggle("nav-active");
        overlay.classList.toggle("active");
    };

    if (hamburger && overlay) {
        hamburger.addEventListener("click", toggleNav);
        overlay.addEventListener("click", toggleNav);
    }

    /* --- Active Page Highlight --- */
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navItems = document.querySelectorAll(".nav-links a");
    
    navItems.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    /* --- Button Ripple Effect --- */
    const buttons = document.querySelectorAll(".btn-ripple");
    
    buttons.forEach(button => {
        button.addEventListener("click", function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement("span");
            ripple.classList.add("ripple");
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});