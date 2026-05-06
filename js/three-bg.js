document.addEventListener("DOMContentLoaded", () => {
    if (typeof THREE === 'undefined') {
        console.warn("Three.js is not loaded.");
        return;
    }

    const canvas = document.getElementById("three-canvas");
    if (!canvas) return;

    // Performance/Mobile check
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 500 : 1000;
    const tileCount = isMobile ? 5 : 15;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // limit pixel ratio for performance
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 2. Stars (Particles) - Layer 1 (Small, slow)
    const starGeometry1 = new THREE.BufferGeometry();
    const starPositions1 = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        starPositions1[i] = (Math.random() - 0.5) * 2000;
    }
    starGeometry1.setAttribute('position', new THREE.BufferAttribute(starPositions1, 3));

    // Layer 2 (Large, fast)
    const starGeometry2 = new THREE.BufferGeometry();
    const starPositions2 = new Float32Array((particleCount / 2) * 3);
    for (let i = 0; i < (particleCount / 2) * 3; i++) {
        starPositions2[i] = (Math.random() - 0.5) * 2000;
    }
    starGeometry2.setAttribute('position', new THREE.BufferAttribute(starPositions2, 3));

    const createCircleTexture = () => {
        const matCanvas = document.createElement('canvas');
        matCanvas.width = 32;
        matCanvas.height = 32;
        const ctx = matCanvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        return new THREE.CanvasTexture(matCanvas);
    };

    const texture = createCircleTexture();

    const starMaterial1 = new THREE.PointsMaterial({
        size: isMobile ? 1 : 1.5,
        color: 0x66aaff,
        map: texture,
        transparent: true,
        opacity: 0.6,
        alphaTest: 0.1,
        blending: THREE.AdditiveBlending
    });

    const starMaterial2 = new THREE.PointsMaterial({
        size: isMobile ? 2.5 : 3.5,
        color: 0x88ccff,
        map: texture,
        transparent: true,
        opacity: 0.9,
        alphaTest: 0.1,
        blending: THREE.AdditiveBlending
    });

    const starSystem1 = new THREE.Points(starGeometry1, starMaterial1);
    const starSystem2 = new THREE.Points(starGeometry2, starMaterial2);
    
    scene.add(starSystem1);
    scene.add(starSystem2);

    // 3. Floating Glowing Tiles
    const tiles = [];
    const tileGeometry = new THREE.PlaneGeometry(50, 50);
    
    // Create glowing material with cyan edge
    const tileMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        wireframe: true // Looks futuristic
    });

    for (let i = 0; i < tileCount; i++) {
        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        
        // Random positions
        tile.position.x = (Math.random() - 0.5) * 1500;
        tile.position.y = (Math.random() - 0.5) * 1500;
        tile.position.z = (Math.random() - 0.5) * 800; // between -400 and 400
        
        // Random rotations
        tile.rotation.x = Math.random() * Math.PI;
        tile.rotation.y = Math.random() * Math.PI;

        // Custom animation properties
        tile.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.01,
            rotSpeedY: (Math.random() - 0.5) * 0.01,
            floatSpeed: (Math.random() * 0.02) + 0.01,
            startY: tile.position.y,
            timeOffset: Math.random() * 100
        };

        tiles.push(tile);
        scene.add(tile);
    }

    // 4. Parallax & Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        // Normalize mouse coordinates to -1 to 1 range, scaled slightly
        mouseX = (event.clientX - windowHalfX) * 0.5;
        mouseY = (event.clientY - windowHalfY) * 0.5;
    });

    // 5. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Parallax easing - Increased depth
        targetX = mouseX * 0.8;
        targetY = mouseY * 0.8;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Slowly rotate star systems at different speeds for depth
        starSystem1.rotation.y += 0.0005;
        starSystem1.rotation.x += 0.0002;
        
        starSystem2.rotation.y += 0.001;
        starSystem2.rotation.x += 0.0005;

        // Animate floating tiles
        tiles.forEach(tile => {
            tile.rotation.x += tile.userData.rotSpeedX;
            tile.rotation.y += tile.userData.rotSpeedY;
            
            // Hover up and down
            tile.position.y = tile.userData.startY + Math.sin(elapsedTime * tile.userData.floatSpeed + tile.userData.timeOffset) * 50;
        });

        renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    });
});
