"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export function SparklesCore({
  className = "",
  background = "transparent",
  particleColor = "#b967ff",
  minSize = 1,
  maxSize = 2,
  particleDensity = 1000,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles = [];

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.floor((width * height) / particleDensity);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * (maxSize - minSize) + minSize,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.5 + 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap particles around the canvas
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${particleColor}${Math.floor(p.alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [particleColor, minSize, maxSize, particleDensity]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{ background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}
