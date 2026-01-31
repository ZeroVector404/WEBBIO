import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const MouseFollower = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springX = useSpring(cursorX, { stiffness: 800, damping: 35 });
  const springY = useSpring(cursorY, { stiffness: 800, damping: 35 });

  const ringX = useSpring(cursorX, { stiffness: 150, damping: 18 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 18 });

  const glowX = useSpring(cursorX, { stiffness: 50, damping: 25 });
  const glowY = useSpring(cursorY, { stiffness: 50, damping: 25 });

  let trailId = 0;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    trailId++;
    setTrails((prev) => [...prev, { id: trailId, x: e.clientX, y: e.clientY }].slice(-12));
  }, []);

  useEffect(() => {
    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select")) setIsHovering(true);
    };
    const handleHoverEnd = () => setIsHovering(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleHoverStart);
    window.addEventListener("mouseout", handleHoverEnd);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleHoverStart);
      window.removeEventListener("mouseout", handleHoverEnd);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    const interval = setInterval(() => setTrails((prev) => prev.slice(-8)), 60);
    return () => clearInterval(interval);
  }, []);

  // Cyberpunk rotating ring canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;
    let animId: number;

    const size = 80;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;

    const draw = () => {
      angle += 0.02;
      ctx.clearRect(0, 0, size, size);

      const r = isHovering ? 28 : 20;
      const segments = 4;
      const gapAngle = 0.3;

      // Outer rotating dashed ring
      for (let i = 0; i < segments; i++) {
        const startAngle = angle + (i * Math.PI * 2) / segments + gapAngle;
        const endAngle = angle + ((i + 1) * Math.PI * 2) / segments - gapAngle;

        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.strokeStyle = isHovering ? "rgba(100, 200, 255, 0.9)" : "rgba(100, 200, 255, 0.6)";
        ctx.lineWidth = isHovering ? 2 : 1.5;
        ctx.shadowColor = "rgba(100, 200, 255, 0.8)";
        ctx.shadowBlur = isHovering ? 15 : 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Inner counter-rotating ring (thinner, 3 segments)
      const r2 = isHovering ? 22 : 15;
      for (let i = 0; i < 3; i++) {
        const startAngle = -angle * 1.5 + (i * Math.PI * 2) / 3 + 0.4;
        const endAngle = -angle * 1.5 + ((i + 1) * Math.PI * 2) / 3 - 0.4;

        ctx.beginPath();
        ctx.arc(cx, cy, r2, startAngle, endAngle);
        ctx.strokeStyle = isHovering ? "rgba(139, 92, 246, 0.8)" : "rgba(139, 92, 246, 0.5)";
        ctx.lineWidth = 1;
        ctx.shadowColor = "rgba(139, 92, 246, 0.6)";
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Crosshair lines
      const crossLen = isClicking ? 10 : 6;
      const crossGap = isClicking ? 3 : 5;
      ctx.strokeStyle = isHovering ? "rgba(100, 220, 255, 0.9)" : "rgba(100, 200, 255, 0.7)";
      ctx.lineWidth = 1;
      ctx.shadowColor = "rgba(100, 200, 255, 0.6)";
      ctx.shadowBlur = 4;

      // Top
      ctx.beginPath(); ctx.moveTo(cx, cy - crossGap); ctx.lineTo(cx, cy - crossGap - crossLen); ctx.stroke();
      // Bottom
      ctx.beginPath(); ctx.moveTo(cx, cy + crossGap); ctx.lineTo(cx, cy + crossGap + crossLen); ctx.stroke();
      // Left
      ctx.beginPath(); ctx.moveTo(cx - crossGap, cy); ctx.lineTo(cx - crossGap - crossLen, cy); ctx.stroke();
      // Right
      ctx.beginPath(); ctx.moveTo(cx + crossGap, cy); ctx.lineTo(cx + crossGap + crossLen, cy); ctx.stroke();
      ctx.shadowBlur = 0;

      // Corner brackets (cyberpunk targeting)
      if (isHovering) {
        const bracketSize = 6;
        const bracketDist = 16;
        ctx.strokeStyle = "rgba(100, 220, 255, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "rgba(100, 200, 255, 0.5)";
        ctx.shadowBlur = 4;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(cx - bracketDist, cy - bracketDist + bracketSize);
        ctx.lineTo(cx - bracketDist, cy - bracketDist);
        ctx.lineTo(cx - bracketDist + bracketSize, cy - bracketDist);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(cx + bracketDist - bracketSize, cy - bracketDist);
        ctx.lineTo(cx + bracketDist, cy - bracketDist);
        ctx.lineTo(cx + bracketDist, cy - bracketDist + bracketSize);
        ctx.stroke();
        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(cx - bracketDist, cy + bracketDist - bracketSize);
        ctx.lineTo(cx - bracketDist, cy + bracketDist);
        ctx.lineTo(cx - bracketDist + bracketSize, cy + bracketDist);
        ctx.stroke();
        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(cx + bracketDist - bracketSize, cy + bracketDist);
        ctx.lineTo(cx + bracketDist, cy + bracketDist);
        ctx.lineTo(cx + bracketDist, cy + bracketDist - bracketSize);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, isClicking ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isClicking ? "rgba(255, 100, 100, 0.9)" : "rgba(100, 220, 255, 0.9)";
      ctx.shadowColor = isClicking ? "rgba(255, 50, 50, 0.8)" : "rgba(100, 200, 255, 0.8)";
      ctx.shadowBlur = isClicking ? 15 : 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isHovering, isClicking]);

  return (
    <>
      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none fixed z-30 rounded-full"
        style={{
          x: glowX, y: glowY,
          width: 700, height: 700,
          marginLeft: -350, marginTop: -350,
          background: `radial-gradient(circle, rgba(100,180,255,0.08) 0%, rgba(139,92,246,0.04) 30%, transparent 60%)`,
        }}
      />

      {/* Trail particles */}
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          className="pointer-events-none fixed z-40 rounded-full"
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            left: trail.x - 2,
            top: trail.y - 2,
            width: 4,
            height: 4,
            background: "rgba(100, 200, 255, 0.7)",
            boxShadow: "0 0 6px rgba(100, 200, 255, 0.5)",
          }}
        />
      ))}

      {/* Cyberpunk canvas cursor */}
      <motion.div
        className="pointer-events-none fixed z-50"
        style={{
          x: ringX, y: ringY,
          marginLeft: -40, marginTop: -40,
        }}
      >
        <canvas ref={canvasRef} width={80} height={80} />
      </motion.div>
    </>
  );
};

export default MouseFollower;
