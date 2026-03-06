document.addEventListener('DOMContentLoaded', () => {
    // Canvas Particle System Setup for Event Theme (Golden Sparks, Bokeh & Logos)
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Load Logo// Initialize logo image
const logoImg = new Image();
logoImg.src = 'logo_top.png';
let isLogoLoaded = false;
    logoImg.onload = () => {
        isLogoLoaded = true;
    };

    // Configuration
    const particleCount = 100; // Regular sparks
    const logoCount = 12;      // Floating logos

    // Resize handler
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor(x, y, type = 'spark') { // type: 'spark', 'burst', or 'logo'
            this.x = x || Math.random() * width;
            this.y = y || Math.random() * height;
            this.type = type;

            if (this.type === 'burst') {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.radius = Math.random() * 3 + 1;
                this.life = 1.0;
                this.decay = Math.random() * 0.02 + 0.01;
                this.baseAlpha = 1;
            } else if (this.type === 'logo') {
                // Floating Logos
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = Math.random() * -1 - 0.2; // Drift upwards slowly
                this.size = Math.random() * 40 + 20; // 20px to 60px size
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.life = -1;
                this.baseAlpha = Math.random() * 0.4 + 0.1; // Subtle opacity
            } else {
                // Ambient spark
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = Math.random() * -1.5 - 0.5;
                this.radius = Math.random() * 2.5 + 0.5;
                this.life = -1;
                this.baseAlpha = Math.random() * 0.6 + 0.2;
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.type === 'logo') {
                this.rotation += this.rotationSpeed;
            }

            if (this.life > 0) {
                this.life -= this.decay;
                this.vy += 0.05;
                this.vx *= 0.98;
                this.vy *= 0.98;
            } else if (this.life === -1) {
                // Reset when off-screen
                if (this.y < -50 || this.x < -50 || this.x > width + 50) {
                    this.x = Math.random() * width;
                    this.y = height + 50;
                    this.vx = (Math.random() - 0.5) * (this.type === 'logo' ? 0.5 : 1);
                }
            }
        }

        draw() {
            if (this.life !== -1 && this.life <= 0) return;
            const currentAlpha = this.life === -1 ? this.baseAlpha : this.baseAlpha * this.life;

            if (this.type === 'logo' && isLogoLoaded) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = currentAlpha;
                ctx.globalCompositeOperation = 'screen'; // Blend beautifully with dark bg
                ctx.drawImage(logoImg, -this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            } else if (this.type !== 'logo') {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha})`;
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(243, 219, 116, ${currentAlpha * 0.15})`;
                ctx.fill();
            }
        }
    }

    // Initialize Particles
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(null, null, 'spark'));
        }
        for (let i = 0; i < logoCount; i++) {
            particles.push(new Particle(null, null, 'logo'));
        }
    }

    // Interactive mouse tracking
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Click creates a burst 
    window.addEventListener('click', (e) => {
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(e.x, e.y, 'burst'));
        }
    });

    // Mouse interacts with particles by sweeping them away gently
    function interactWithMouse() {
        if (mouse.x && mouse.y) {
            for (let i = 0; i < particles.length; i++) {
                if (particles[i].life !== -1) continue;

                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;

                    // Logos are heavier, push them less than sparks
                    const multiplier = particles[i].type === 'logo' ? 0.2 : 0.5;
                    particles[i].vx += forceDirectionX * force * multiplier;
                    particles[i].vy += forceDirectionY * force * multiplier;

                    const maxSpeed = particles[i].type === 'logo' ? 1.5 : 3;
                    const speed = Math.sqrt(particles[i].vx ** 2 + particles[i].vy ** 2);
                    if (speed > maxSpeed) {
                        particles[i].vx = (particles[i].vx / speed) * maxSpeed;
                        particles[i].vy = (particles[i].vy / speed) * maxSpeed;
                    }
                }
            }
        }
    }

    function cleanupParticles() {
        particles = particles.filter(p => p.life === -1 || p.life > 0);
    }

    // Main Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        ctx.shadowBlur = 0;

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        interactWithMouse();

        if (Math.random() < 0.05) {
            cleanupParticles();
        }
    }

    initParticles();
    animate();
});
