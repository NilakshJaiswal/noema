import { useEffect, useRef } from 'react';

/**
 * Lightweight animated "neural network" canvas for the hero.
 * - Nodes drift slowly and link when near; a subtle pulse travels edges.
 * - Caps node count by viewport size for performance.
 * - Pauses when the tab/section is hidden and respects reduced motion.
 */
export default function NeuralField({ className = '' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let running = true;

    const LINK_DIST = 150;

    function makeNodes() {
      const area = width * height;
      const count = Math.max(18, Math.min(64, Math.round(area / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 1,
        hue: Math.random() > 0.78 ? 'amber' : 'teal',
      }));
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeNodes();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.5;
            ctx.strokeStyle = `rgba(43, 189, 209, ${alpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const color = n.hue === 'amber' ? '255, 149, 51' : '110, 215, 229';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.9)`;
        ctx.shadowColor = `rgba(${color}, 0.9)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function step() {
      if (!running) return;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      draw();
      rafRef.current = requestAnimationFrame(step);
    }

    resize();

    if (prefersReduced) {
      // Render a single static frame; no animation loop.
      draw();
    } else {
      rafRef.current = requestAnimationFrame(step);
    }

    const onResize = () => resize();
    const onVisibility = () => {
      running = !document.hidden && !prefersReduced;
      if (running) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(step);
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
