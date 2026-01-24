// No React imports needed for the logic itself since it's imperative.

export interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    x?: number;
    y?: number;
    colors?: string[];
    shapes?: ('square' | 'circle')[];
    scalar?: number;
    zIndex?: number;
}

const defaultColors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];

export const Confetti = () => {
    // This component is a placeholder for the global canvas if we wanted a singleton.
    // However, for this library, we'll expose a function API primarily.
    return null;
};

class Particle {
    x: number;
    y: number;
    wobble: number = Math.random() * 10;
    wobbleSpeed: number = Math.min(0.11, Math.random() * 0.1 + 0.05);
    velocity: number;
    angle2D: number;
    tiltAngle: number = Math.random() * Math.PI;
    color: string;
    shape: 'square' | 'circle';
    tick: number = 0;
    totalTicks: number;
    decay: number;
    drift: number;
    random: number = Math.random() + 2;
    tiltSin: number = 0;
    tiltCos: number = 0;
    wobbleX: number = 0;
    wobbleY: number = 0;
    gravity: number;
    ovalScalar: number = 0.6;
    scalar: number;

    constructor(opts: ConfettiOptions & { x: number, y: number }) {
        this.x = opts.x;
        this.y = opts.y;
        this.velocity = (opts.startVelocity || 45) * (0.5 + Math.random() * 1);
        this.angle2D = -opts.angle! + ((0.5 - Math.random()) * opts.spread!) || 0;
        this.color = opts.colors![Math.floor(Math.random() * opts.colors!.length)];
        this.shape = opts.shapes![Math.floor(Math.random() * opts.shapes!.length)];
        this.totalTicks = opts.ticks || 200;
        this.decay = opts.decay || 0.9;
        this.drift = opts.drift || 0;
        this.gravity = opts.gravity || 1;
        this.scalar = opts.scalar || 1;
    }

    update() {
        this.scalar *= this.decay;
        this.velocity *= this.decay;

        this.x += Math.cos(this.angle2D * Math.PI / 180) * this.velocity + this.drift;
        this.y += Math.sin(this.angle2D * Math.PI / 180) * this.velocity + this.gravity; // Gravity

        this.wobble += this.wobbleSpeed;
        this.wobbleX = this.x + (10 * this.scalar * Math.cos(this.wobble));
        this.wobbleY = this.y + (10 * this.scalar * Math.sin(this.wobble));

        this.tiltAngle += 0.1;
        this.tiltSin = Math.sin(this.tiltAngle);
        this.tiltCos = Math.cos(this.tiltAngle);
        this.random = Math.random() + 2;
        this.tick++;
    }

    draw(context: CanvasRenderingContext2D) {
        if (this.shape === 'circle') {
            context.beginPath();
            context.ellipse(this.x, this.y, Math.abs(this.wobbleX - this.x) * this.ovalScalar, Math.abs(this.wobbleY - this.y) * this.ovalScalar, Math.PI / 10 * this.wobble, 0, 2 * Math.PI);
            context.fillStyle = this.color;
            context.fill();
        } else {
            context.fillStyle = this.color;
            context.beginPath();
            context.moveTo(Math.floor(this.x), Math.floor(this.y));
            context.lineTo(Math.floor(this.wobbleX), Math.floor(this.y + (this.random * this.tiltSin)));
            context.lineTo(Math.floor(this.wobbleX + (this.random * this.tiltCos)), Math.floor(this.wobbleY + (this.random * this.tiltSin)));
            context.lineTo(Math.floor(this.x), Math.floor(this.wobbleY));
            context.closePath();
            context.fill();
        }
    }
}

let activeCanvas: HTMLCanvasElement | null = null;
let activeContext: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let animationFrameId: number | null = null;

const initCanvas = (zIndex: number) => {
    if (activeCanvas) return;
    activeCanvas = document.createElement('canvas');
    activeCanvas.style.position = 'fixed';
    activeCanvas.style.top = '0px';
    activeCanvas.style.left = '0px';
    activeCanvas.style.width = '100%';
    activeCanvas.style.height = '100%';
    activeCanvas.style.pointerEvents = 'none';
    activeCanvas.style.zIndex = zIndex.toString();
    document.body.appendChild(activeCanvas);
    activeContext = activeCanvas.getContext('2d');

    const resizeObj = new ResizeObserver(() => {
        if (activeCanvas) {
            activeCanvas.width = window.innerWidth;
            activeCanvas.height = window.innerHeight;
        }
    });
    resizeObj.observe(document.body);

    activeCanvas.width = window.innerWidth;
    activeCanvas.height = window.innerHeight;
};

const loop = () => {
    if (!activeContext || !activeCanvas) return;

    activeContext.clearRect(0, 0, activeCanvas.width, activeCanvas.height);

    particles = particles.filter(p => p.tick < p.totalTicks);

    particles.forEach(p => {
        p.update();
        p.draw(activeContext!);
    });

    if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(loop);
    } else {
        // Cleanup if empty
        if (activeCanvas.parentNode) activeCanvas.parentNode.removeChild(activeCanvas);
        activeCanvas = null;
        activeContext = null;
        animationFrameId = null;
    }
};

export const triggerConfetti = (options: ConfettiOptions = {}) => {
    const {
        particleCount = 50,
        angle = 90,
        spread = 45,
        startVelocity = 45,
        decay = 0.9,
        gravity = 1,
        drift = 0,
        ticks = 200,
        x = 0.5,
        y = 0.5,
        colors = defaultColors,
        shapes = ['square', 'circle'],
        scalar = 1,
        zIndex = 100
    } = options;

    initCanvas(zIndex);

    const originX = x * window.innerWidth;
    const originY = y * window.innerHeight;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle({
            x: originX,
            y: originY,
            particleCount,
            angle,
            spread,
            startVelocity,
            decay,
            gravity,
            drift,
            ticks,
            colors,
            shapes: shapes as any,
            scalar
        }));
    }

    if (!animationFrameId) {
        loop();
    }
};

export const useConfetti = () => {
    return { triggerConfetti };
};
