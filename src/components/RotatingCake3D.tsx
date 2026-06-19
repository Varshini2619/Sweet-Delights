import React, { useEffect, useRef, useState } from 'react';

export default function RotatingCake3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const rotationYRef = useRef(0.5); // Initial rotation angle
  const rotationXRef = useRef(0.3); // Initial tilt angle
  const dragStartRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ y: 0.005, x: 0 }); // Constant auto-rotation velocity with friction

  // Keep a local drag state to ensure cursor changes or hints are responsive if needed
  const [, setInternalIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = canvas.width || 400;
    let height = canvas.height || 400;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w === 0 || h === 0) continue;
        canvas.width = w * 2; // high density
        canvas.height = h * 2;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        width = w * 2;
        height = h * 2;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Mathematical definition of a Cylinder facet representation for layers with enhanced realism
    const drawCylinder = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      h: number,
      rotY: number,
      rotX: number,
      colorLight: string,
      colorDark: string,
      hasDetails = false,
      textureType = 'smooth'
    ) => {
      const segments = 48; // Increased for smoother curves
      const pointsTop: { x: number; y: number; z: number; intensity: number }[] = [];
      const pointsBottom: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2 + rotY;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // 3D coordinates relative to center
        const xVal = r * cos;
        const zVal = r * sin;

        // Apply X-rotation (tilt)
        const yTop = -h / 2;
        const yBottom = h / 2;

        const rotatedYTop = yTop * Math.cos(rotX) - zVal * Math.sin(rotX);
        const projectedZTop = yTop * Math.sin(rotX) + zVal * Math.cos(rotX);

        const rotatedYBottom = yBottom * Math.cos(rotX) - zVal * Math.sin(rotX);
        const projectedZBottom = yBottom * Math.sin(rotX) + zVal * Math.cos(rotX);

        // Enhanced lighting model with ambient, diffuse, and specular
        const nx = cos;
        const nz = sin;
        const lightDir = { x: 0.5, y: -0.5, z: -1 };
        const lightIntensity = Math.max(0.1, nx * lightDir.x + nz * lightDir.z);
        const ambient = 0.3;
        const diffuse = Math.max(0, lightIntensity) * 0.6;
        const specular = Math.pow(Math.max(0, lightIntensity), 16) * 0.3;
        const intensity = ambient + diffuse + specular;

        pointsTop.push({ x: xVal, y: rotatedYTop, z: projectedZTop, intensity });
        pointsBottom.push({ x: xVal, y: rotatedYBottom, z: projectedZBottom });
      }

      // Draw sides with enhanced shading and texture
      for (let i = 0; i < segments; i++) {
        const avgZ = (pointsTop[i].z + pointsTop[i + 1].z) / 2;
        if (avgZ < -50) continue; // Improved depth culling

        ctx.beginPath();
        const dist = 600; // Increased camera distance for better perspective
        const scaleI1 = dist / (dist + pointsTop[i].z);
        const scaleI2 = dist / (dist + pointsTop[i + 1].z);
        const scaleO1 = dist / (dist + pointsBottom[i].z);
        const scaleO2 = dist / (dist + pointsBottom[i + 1].z);

        const xT1 = cx + pointsTop[i].x * scaleI1;
        const yT1 = cy + pointsTop[i].y * scaleI1;
        const xT2 = cx + pointsTop[i + 1].x * scaleI2;
        const yT2 = cy + pointsTop[i + 1].y * scaleI2;

        const xB1 = cx + pointsBottom[i].x * scaleO1;
        const yB1 = cy + pointsBottom[i].y * scaleO1;
        const xB2 = cx + pointsBottom[i + 1].x * scaleO2;
        const yB2 = cy + pointsBottom[i + 1].y * scaleO2;

        ctx.moveTo(xT1, yT1);
        ctx.lineTo(xT2, yT2);
        ctx.lineTo(xB2, yB2);
        ctx.lineTo(xB1, yB1);
        ctx.closePath();

        const intensity = pointsTop[i].intensity;
        const baseColor = blendColors(colorDark, colorLight, intensity);
        
        // Add texture variation
        if (textureType === 'frosting') {
          const textureNoise = Math.sin(i * 0.5 + rotY * 2) * 0.05;
          ctx.fillStyle = blendColors(baseColor, '#ffffff', textureNoise);
        } else if (textureType === 'chocolate') {
          const textureNoise = Math.sin(i * 0.3) * 0.03;
          ctx.fillStyle = blendColors(baseColor, '#2a1508', textureNoise);
        } else {
          ctx.fillStyle = baseColor;
        }
        
        ctx.fill();

        // Enhanced edge highlights
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + intensity * 0.05})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw top surface with gradient
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const dist = 600;
        const scale = dist / (dist + pointsTop[i].z);
        const px = cx + pointsTop[i].x * scale;
        const py = cy + pointsTop[i].y * scale;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      
      // Radial gradient for top surface
      const topGradient = ctx.createRadialGradient(cx, cy - h/2, 0, cx, cy - h/2, r);
      topGradient.addColorStop(0, colorLight);
      topGradient.addColorStop(0.7, blendColors(colorLight, colorDark, 0.3));
      topGradient.addColorStop(1, blendColors(colorLight, colorDark, 0.6));
      ctx.fillStyle = topGradient;
      ctx.fill();

      // Enhanced top surface border
      ctx.strokeStyle = blendColors(colorLight, '#ffffff', 0.3);
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add realistic decorations if hasDetails
      if (hasDetails) {
        const toppingCount = 16;
        for (let j = 0; j < toppingCount; j++) {
          const angle = (j / toppingCount) * Math.PI * 2 + rotY;
          const rD = r * 0.75;
          const tx = rD * Math.cos(angle);
          const tz = rD * Math.sin(angle);
          const ty = -h / 2;

          const rY = ty * Math.cos(rotX) - tz * Math.sin(rotX);
          const rZ = ty * Math.sin(rotX) + tz * Math.cos(rotX);

          const scale = 600 / (600 + rZ);
          const screenX = cx + tx * scale;
          const screenY = cy + rY * scale;

          if (rZ < 10) continue;

          // Realistic frosting dollop with shadow
          const dollopSize = 8 * scale;
          
          // Shadow
          ctx.beginPath();
          ctx.arc(screenX + 2, screenY + 2, dollopSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.fill();

          // Main dollop with gradient
          const dollopGradient = ctx.createRadialGradient(
            screenX - dollopSize * 0.3, screenY - dollopSize * 0.3, 0,
            screenX, screenY, dollopSize
          );
          dollopGradient.addColorStop(0, '#ffffff');
          dollopGradient.addColorStop(0.5, '#fff5e6');
          dollopGradient.addColorStop(1, '#f5e6d3');
          
          ctx.beginPath();
          ctx.arc(screenX, screenY, dollopSize, 0, Math.PI * 2);
          ctx.fillStyle = dollopGradient;
          ctx.fill();

          // Glossy highlight
          ctx.beginPath();
          ctx.arc(screenX - dollopSize * 0.3, screenY - dollopSize * 0.3, dollopSize * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fill();

          // Decorative element (berry/cherry)
          const berrySize = 4 * scale;
          const berryGradient = ctx.createRadialGradient(
            screenX - berrySize * 0.3, screenY - berrySize * 0.3, 0,
            screenX, screenY, berrySize
          );
          
          if (j % 3 === 0) {
            // Cherry
            berryGradient.addColorStop(0, '#ff6b6b');
            berryGradient.addColorStop(0.7, '#c92a2a');
            berryGradient.addColorStop(1, '#8b0000');
          } else if (j % 3 === 1) {
            // Gold leaf
            berryGradient.addColorStop(0, '#ffd700');
            berryGradient.addColorStop(0.7, '#daa520');
            berryGradient.addColorStop(1, '#b8860b');
          } else {
            // Blueberry
            berryGradient.addColorStop(0, '#7b68ee');
            berryGradient.addColorStop(0.7, '#483d8b');
            berryGradient.addColorStop(1, '#191970');
          }
          
          ctx.beginPath();
          ctx.arc(screenX, screenY - dollopSize * 0.8, berrySize, 0, Math.PI * 2);
          ctx.fillStyle = berryGradient;
          ctx.fill();
          
          // Berry highlight
          ctx.beginPath();
          ctx.arc(screenX - berrySize * 0.3, screenY - dollopSize * 0.8 - berrySize * 0.3, berrySize * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fill();
        }
      }
    };

    // Blend Hex Colors
    const blendColors = (color1: string, color2: string, percentage: number): string => {
      const c1 = color1.startsWith('#') ? color1 : '#3a2010';
      const c2 = color2.startsWith('#') ? color2 : '#dfaf5f';

      const r1 = parseInt(c1.substring(1, 3), 16);
      const g1 = parseInt(c1.substring(3, 5), 16);
      const b1 = parseInt(c1.substring(5, 7), 16);

      const r2 = parseInt(c2.substring(1, 3), 16);
      const g2 = parseInt(c2.substring(3, 5), 16);
      const b2 = parseInt(c2.substring(5, 7), 16);

      const r = Math.round(r1 + (r2 - r1) * percentage);
      const g = Math.round(g1 + (g2 - g1) * percentage);
      const b = Math.round(b1 + (b2 - b1) * percentage);

      return `rgb(${r}, ${g}, ${b})`;
    };

    // Render loop
    const render = () => {
      if (width <= 0 || height <= 0) {
        animId = requestAnimationFrame(render);
        return;
      }
      ctx.clearRect(0, 0, width, height);

      // Apply drag momentum decaying
      if (!isDraggingRef.current) {
        rotationYRef.current = rotationYRef.current + velocityRef.current.y;
        
        // decay tilt back to reference
        const diffX = 0.3 - rotationXRef.current;
        rotationXRef.current = rotationXRef.current + diffX * 0.05 + velocityRef.current.x;

        velocityRef.current.y *= 0.98; // Friction
        velocityRef.current.x *= 0.98;
        if (Math.abs(velocityRef.current.y) < 0.001) velocityRef.current.y = 0.003; // idle speed
      }

      const rotY = rotationYRef.current;
      const rotX = rotationXRef.current;

      const cx = width / 2;
      const cy = height / 2 + 30;

      // Draw table base / luxury gold rim plate
      drawCylinder(ctx, cx, cy + 90, 190, 8, rotY * 0.5, rotX, '#e0b86a', '#785310', false, 'smooth');

      // TIER 1: Bottom Layer (Grand Velvet / Dark Chocolate base)
      drawCylinder(ctx, cx, cy + 30, 140, 50, rotY, rotX, '#4a2c11', '#1f0d02', true, 'chocolate');

      // TIER 2: Middle Layer (Luxury Caramel / Soft Gold)
      drawCylinder(ctx, cx, cy - 20, 100, 42, -rotY * 1.2, rotX, '#dfaf5f', '#6c4a16', true, 'frosting');

      // TIER 3: Top Layer (Frosty Saffron White Ivory)
      drawCylinder(ctx, cx, cy - 65, 65, 36, rotY * 0.8, rotX, '#fff3e3', '#9c8466', true, 'frosting');

      // Draw Top Candles or Anniversary Sparkler with enhanced realism
      const tx = 0;
      const tz = 0;
      const ty = -85; // above Top Layer
      const rY = ty * Math.cos(rotX) - tz * Math.sin(rotX);
      const rZ = ty * Math.sin(rotX) + tz * Math.cos(rotX);
      const s = 600 / (600 + rZ);

      const scX = cx + tx * s;
      const scY = cy + rY * s;

      // Enhanced sparkler stick with metallic gradient
      const stickGradient = ctx.createLinearGradient(scX, scY, scX, scY - 25 * s);
      stickGradient.addColorStop(0, '#8b7355');
      stickGradient.addColorStop(0.5, '#d4af37');
      stickGradient.addColorStop(1, '#ffd700');
      
      ctx.beginPath();
      ctx.moveTo(scX, scY);
      ctx.lineTo(scX, scY - 25 * s);
      ctx.strokeStyle = stickGradient;
      ctx.lineWidth = 2.5 * s;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Multi-layered glowing flame with realistic flicker
      const time = Date.now() * 0.003;
      const flicker = Math.sin(time * 3) * 0.1 + Math.sin(time * 7) * 0.05;
      const flameSize = (18 + flicker * 5) * s;
      
      // Outer glow
      const outerGlow = ctx.createRadialGradient(scX, scY - 30 * s, 1, scX, scY - 30 * s, flameSize * 1.5);
      outerGlow.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
      outerGlow.addColorStop(0.3, 'rgba(255, 150, 50, 0.4)');
      outerGlow.addColorStop(0.6, 'rgba(255, 100, 0, 0.2)');
      outerGlow.addColorStop(1, 'rgba(255, 50, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(scX, scY - 30 * s, flameSize * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Inner flame
      const innerFlame = ctx.createRadialGradient(scX, scY - 30 * s, 1, scX, scY - 30 * s, flameSize);
      innerFlame.addColorStop(0, '#ffffff');
      innerFlame.addColorStop(0.2, '#ffea9f');
      innerFlame.addColorStop(0.5, 'rgba(255,130,50,0.8)');
      innerFlame.addColorStop(0.8, 'rgba(255,100,0,0.5)');
      innerFlame.addColorStop(1, 'rgba(255,50,0,0)');

      ctx.beginPath();
      ctx.arc(scX, scY - 30 * s, flameSize, 0, Math.PI * 2);
      ctx.fillStyle = innerFlame;
      ctx.fill();

      // Enhanced orbiting particles with varied sizes and colors
      const particleCount = 30;
      for (let p = 0; p < particleCount; p++) {
        const pAngle = (p / particleCount) * Math.PI * 2 + rotY * 1.5 + time * 0.5;
        const pHeight = Math.sin(pAngle * 2 + time) * 60 - 30;
        const pRadius = 160 + Math.cos(pAngle * 3 + time * 0.3) * 30;

        const px = pRadius * Math.cos(pAngle);
        const pz = pRadius * Math.sin(pAngle);

        const pyRot = pHeight * Math.cos(rotX) - pz * Math.sin(rotX);
        const pzRot = pHeight * Math.sin(rotX) + pz * Math.cos(rotX);

        const pScale = 600 / (600 + pzRot);
        const scPX = cx + px * pScale;
        const scPY = cy + pyRot * pScale;

        if (pzRot < -100) continue;

        const particleSize = (1.5 + Math.sin(pAngle * 5 + time * 2) * 0.8) * pScale;
        
        // Varied particle colors for more visual interest
        let particleColor;
        if (p % 4 === 0) {
          particleColor = 'rgba(212,175,55,0.8)'; // Gold
        } else if (p % 4 === 1) {
          particleColor = 'rgba(255,255,255,0.9)'; // White
        } else if (p % 4 === 2) {
          particleColor = 'rgba(255,200,100,0.7)'; // Warm
        } else {
          particleColor = 'rgba(255,150,200,0.6)'; // Pinkish
        }

        ctx.beginPath();
        ctx.arc(scPX, scPY, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.shadowColor = particleColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setInternalIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    rotationYRef.current += dx * 0.007;
    rotationXRef.current = Math.max(-0.2, Math.min(0.8, rotationXRef.current + dy * 0.007));

    velocityRef.current = { y: dx * 0.002, x: dy * 0.002 };

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setInternalIsDragging(false);
  };

  // Touch triggers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    isDraggingRef.current = true;
    setInternalIsDragging(true);
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;

    rotationYRef.current += dx * 0.009;
    rotationXRef.current = Math.max(-0.2, Math.min(0.8, rotationXRef.current + dy * 0.009));

    velocityRef.current = { y: dx * 0.003, x: dy * 0.003 };

    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <div
      className="relative w-full h-[320px] md:h-[450px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible select-none py-4"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      id="rotating-cake-3d-gourmet"
    >
      <div className="absolute top-2 text-center text-xs text-amber-500/80 font-semibold tracking-wider font-mono uppercase bg-amber-950/20 px-3 py-1 rounded-full border border-amber-500/10 backdrop-blur-md">
        ✨ Drag to Rotate Luxury Cake
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-full block"
      />
    </div>
  );
}
