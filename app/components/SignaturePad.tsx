"use client";

import { useEffect, useRef, useState } from "react";

type SignaturePadProps = {
  onChange: (dataUrl: string | null) => void;
};

export default function SignaturePad({
  onChange,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const activePointerRef = useRef<number | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  function prepareCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1A3A5C";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  useEffect(() => {
    prepareCanvas();
  }, []);

  function getPosition(
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function startDrawing(
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    event.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.setPointerCapture(event.pointerId);
    activePointerRef.current = event.pointerId;
    drawingRef.current = true;

    const { x, y } = getPosition(event);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();

    setHasDrawn(true);
  }

  function draw(
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    if (
      !drawingRef.current ||
      activePointerRef.current !== event.pointerId
    ) {
      return;
    }

    event.preventDefault();

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPosition(event);

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function finishDrawing(
    event: React.PointerEvent<HTMLCanvasElement>
  ) {
    if (
      !drawingRef.current ||
      activePointerRef.current !== event.pointerId
    ) {
      return;
    }

    event.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    drawingRef.current = false;
    activePointerRef.current = null;

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    onChange(canvas.toDataURL("image/png"));
  }

  function clearSignature() {
    prepareCanvas();
    drawingRef.current = false;
    activePointerRef.current = null;
    setHasDrawn(false);
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={900}
        height={240}
        className="block w-full h-40 border-2 border-gray-400 rounded-lg bg-white cursor-crosshair touch-none"
        style={{ touchAction: "none" }}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={finishDrawing}
        onPointerCancel={finishDrawing}
      />

      <button
        type="button"
        onClick={clearSignature}
        className="text-sm text-gray-600 hover:text-gray-900 underline"
      >
        Clear signature
      </button>

      {!hasDrawn && (
        <p className="text-xs text-gray-500">
          Sign above using your mouse, finger, or stylus.
        </p>
      )}
    </div>
  );
}
