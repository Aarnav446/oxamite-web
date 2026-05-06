class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.handleResize();
        this.handleMouseMove();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];
        
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 2 + 0.5;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.5;
            const speedY = (Math.random() - 0.5) * 0.5;
            
            // Assign colors: 60% white/light blue, 20% cyan, 20% purple
            const rand = Math.random();
            let color = 'rgba(255, 255, 255, 0.8)';
            if (rand > 0.8) {
                color = 'rgba(0, 240, 255, 0.6)'; // Neon cyan
            } else if (rand > 0.6) {
                color = 'rgba(138, 43, 226, 0.6)'; // Deep purple
            }
            
            this.particles.push(new Particle(this.canvas, this.ctx, x, y, speedX, speedY, size, color, this.mouse));
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();
        }
        
        this.connectParticles();
    }

    connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                let dx = this.particles[a].x - this.particles[b].x;
                let dy = this.particles[a].y - this.particles[b].y;
                let distance = dx * dx + dy * dy;
                
                if (distance < (this.canvas.width/7) * (this.canvas.height/7)) {
                    opacityValue = 1 - (distance / 20000);
                    this.ctx.strokeStyle = `rgba(100, 150, 255, ${opacityValue * 0.15})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.init();
        });
    }

    handleMouseMove() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        });
    }
}

class Particle {
    constructor(canvas, ctx, x, y, speedX, speedY, size, color, mouse) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.size = size;
        this.color = color;
        this.mouse = mouse;
    }

    update() {
        // Normal movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x > this.canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > this.canvas.height || this.y < 0) this.speedY = -this.speedY;

        // Mouse interaction (parallax / push effect)
        if (this.mouse.x != null && this.mouse.y != null) {
            let dx = this.mouse.x - this.x;
            let dy = this.mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = this.mouse.radius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * 2;
                const directionY = forceDirectionY * force * 2;
                
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Slowly return to normal trajectory
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx/50;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy/50;
                }
            }
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Add glow effect for specific particles
        if (this.size > 1.5) {
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.color;
        } else {
            this.ctx.shadowBlur = 0;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
