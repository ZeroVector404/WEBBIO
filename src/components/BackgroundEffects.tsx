import { useEffect, useRef } from "react";

const BackgroundEffects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mouseX = -1000;
    let mouseY = -1000;
    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouse);

    const gridSize = 60;

    // Diagonal rain streaks
    interface RainDrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      alpha: number;
      width: number;
    }

    const rainDrops: RainDrop[] = [];
    for (let i = 0; i < 70; i++) {
      rainDrops.push({
        x: Math.random() * window.innerWidth * 2,
        y: Math.random() * window.innerHeight * 2 - window.innerHeight,
        length: Math.random() * 200 + 80,
        speed: Math.random() * 2 + 0.6,
        alpha: Math.random() * 0.12 + 0.03,
        width: Math.random() * 1.5 + 0.3,
      });
    }

    // Floating particles
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; pulse: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Diagonal rain streaks with gradient
      rainDrops.forEach((drop) => {
        drop.x += drop.speed * 0.4;
        drop.y += drop.speed;

        if (drop.y > canvas.height + drop.length) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width * 2 - canvas.width * 0.5;
        }

        const gradient = ctx.createLinearGradient(drop.x, drop.y, drop.x + drop.length * 0.25, drop.y + drop.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.4, `rgba(255, 255, 255, ${drop.alpha})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.length * 0.25, drop.y + drop.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = drop.width;
        ctx.stroke();
      });

      // ===== VISIBLE GRID (like tinnapat) =====
      // Grid lines - always visible, not just faint
      for (let x = 0; x <= canvas.width; x += gridSize) {
        // Check distance to mouse for this column
        const colDist = Math.abs(mouseX - x);
        const colGlow = Math.max(0, 1 - colDist / 300);
        const lineAlpha = 0.06 + colGlow * 0.12;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = `rgba(100, 180, 255, ${lineAlpha})`;
        ctx.lineWidth = 0.5 + colGlow * 0.5;
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        const rowDist = Math.abs(mouseY - y);
        const rowGlow = Math.max(0, 1 - rowDist / 300);
        const lineAlpha = 0.06 + rowGlow * 0.12;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(100, 180, 255, ${lineAlpha})`;
        ctx.lineWidth = 0.5 + rowGlow * 0.5;
        ctx.stroke();
      }

      // Grid intersection dots - always visible with pulsing
      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          const dx = mouseX - x;
          const dy = mouseY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 280;
          const glow = Math.max(0, 1 - dist / maxDist);

          // Base dot - always visible, subtle pulse
          const basePulse = 0.12 + Math.sin(time * 1.5 + x * 0.005 + y * 0.005) * 0.04;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120, 200, 255, ${basePulse + glow * 0.6})`;
          ctx.fill();

          if (glow > 0.05) {
            // Glowing dot near mouse
            ctx.beginPath();
            ctx.arc(x, y, 1.5 + glow * 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 180, 255, ${glow * 0.5})`;
            ctx.fill();

            // Glow halo
            ctx.beginPath();
            ctx.arc(x, y, 4 + glow * 10, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${glow * 0.06})`;
            ctx.fill();
          }

          // Brighter lines near mouse
          if (glow > 0.2) {
            if (x + gridSize <= canvas.width) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + gridSize, y);
              ctx.strokeStyle = `rgba(120, 200, 255, ${glow * 0.3})`;
              ctx.lineWidth = 0.5 + glow * 1.5;
              ctx.stroke();
            }
            if (y + gridSize <= canvas.height) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, y + gridSize);
              ctx.strokeStyle = `rgba(120, 200, 255, ${glow * 0.3})`;
              ctx.lineWidth = 0.5 + glow * 1.5;
              ctx.stroke();
            }
          }
        }
      }

      // Floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.015;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulseAlpha = p.alpha * (0.7 + Math.sin(p.pulse) * 0.3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${pulseAlpha * 0.08})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${pulseAlpha})`;
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(200, 220, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "#0a0a14" }}>
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Large bright center-top glow (like tinnapat hero area) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full blur-[200px]"
        style={{ background: "radial-gradient(ellipse, rgba(30,60,120,0.25) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)" }}
      />

      {/* Left glow */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full blur-[180px]"
        style={{ background: "radial-gradient(circle, rgba(80,140,240,0.1) 0%, transparent 70%)" }}
      />

      {/* Right glow */}
      <div className="absolute bottom-1/3 -right-20 w-[500px] h-[500px] rounded-full blur-[180px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)" }}
      />

      {/* Bottom glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(60,100,200,0.12) 0%, transparent 70%)" }}
      />

      {/* Soft vignette */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(5,5,12,0.5) 100%)" }}
      />
    </div>
  );
};

export default BackgroundEffects;
