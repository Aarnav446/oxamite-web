// Custom Cursor Logic
document.addEventListener("DOMContentLoaded", () => {
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorGlow = document.querySelector(".cursor-glow");

    // Only run if cursor elements exist (they won't on mobile if hidden by CSS, but JS will still fire)
    if (!cursorDot || !cursorGlow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Smooth trailing effect for the glow
    let glowX = mouseX;
    let glowY = mouseY;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate update for dot
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const renderCursor = () => {
        // LERP (Linear Interpolation) for smooth follow
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;

        cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

        requestAnimationFrame(renderCursor);
    };

    renderCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .tilt-card');
    
    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-hover");
        });
    });
});
