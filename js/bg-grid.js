document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bg-grid-container');
    if (!container) return;

    let columns = 0;
    let rows = 0;
    let totalTiles = 0;
    const tileSize = 80; // Size of each tile in pixels

    // Function to calculate grid size and generate tiles
    const createGrid = () => {
        container.innerHTML = ''; // Clear existing tiles
        
        columns = Math.ceil(window.innerWidth / tileSize);
        rows = Math.ceil(window.innerHeight / tileSize);
        totalTiles = columns * rows;

        container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        for (let i = 0; i < totalTiles; i++) {
            const tile = document.createElement('div');
            tile.classList.add('bg-tile');
            
            // Randomly assign some tiles to pulse slowly for ambient effect
            if (Math.random() > 0.95) {
                tile.classList.add('pulse');
                tile.style.animationDelay = `${Math.random() * 5}s`;
            }

            container.appendChild(tile);
        }
    };

    // Initialize grid
    createGrid();

    // Re-calculate grid on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createGrid, 200);
    });

    // Handle mouse movement for interactive light and tilt effects
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Update CSS custom properties for global glow position
        document.documentElement.style.setProperty('--mouse-x', `${x}px`);
        document.documentElement.style.setProperty('--mouse-y', `${y}px`);

        // Find the tile exactly under the cursor and apply a subtle 3D tilt
        const tileUnderCursor = document.elementFromPoint(x, y);
        if (tileUnderCursor && tileUnderCursor.classList.contains('bg-tile')) {
            // Remove tilt from all tiles first
            document.querySelectorAll('.bg-tile.tilted').forEach(t => t.classList.remove('tilted'));
            
            // Apply tilt to current tile
            tileUnderCursor.classList.add('tilted');
            
            // Calculate tilt based on cursor position within the tile
            const rect = tileUnderCursor.getBoundingClientRect();
            const tileX = x - rect.left; // x position within the tile
            const tileY = y - rect.top;  // y position within the tile
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = ((tileY - centerY) / centerY) * -15; // Max 15deg tilt
            const tiltY = ((tileX - centerX) / centerX) * 15;
            
            tileUnderCursor.style.transform = `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
            
            // Reset transform when mouse leaves
            tileUnderCursor.addEventListener('mouseleave', () => {
                tileUnderCursor.style.transform = '';
                tileUnderCursor.classList.remove('tilted');
            }, { once: true });
        }
    });

    // Handle mouse leaving the window
    window.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget && !e.toElement) {
            // Mouse left the browser window
            document.documentElement.style.setProperty('--mouse-x', `-1000px`);
            document.documentElement.style.setProperty('--mouse-y', `-1000px`);
        }
    });
});
