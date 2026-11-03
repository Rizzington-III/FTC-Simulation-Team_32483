import React, { useState, useRef, useEffect } from 'react';
import './index.css';

// FTC Map Configurations
const MAP_CONFIGS = {
  biobuzz: {
    name: 'Biobuzz FTC Map',
    bgClass: 'bg-emerald-950/40 border-emerald-500/30',
    gridColor: 'rgba(16, 185, 129, 0.15)',
    accentColor: '#10b981',
  },
  decode: {
    name: 'Decode FTC Map',
    bgClass: 'bg-indigo-950/40 border-indigo-500/30',
    gridColor: 'rgba(99, 102, 241, 0.15)',
    accentColor: '#6366f1',
  },
};

export default function PedroPathStudio() {
  const canvasRef = useRef(null);
  const [selectedMap, setSelectedMap] = useState('biobuzz');
  const [robotMaxSpeed, setRobotMaxSpeed] = useState(0.8); // 0 to 1
  const [robotHeading, setRobotHeading] = useState(0); // degrees

  // Array of control points for Bezier curves
  // Structure: [{ x, y, handleIn: {x, y}, handleOut: {x, y}, heading, maxSpeed }]
  const [waypoints, setWaypoints] = useState([
    { x: 100, y: 500, handleIn: { x: 50, y: 500 }, handleOut: { x: 150, y: 500 } },
    { x: 300, y: 200, handleIn: { x: 250, y: 300 }, handleOut: { x: 350, y: 100 } },
    { x: 500, y: 400, handleIn: { x: 450, y: 400 }, handleOut: { x: 550, y: 400 } },
  ]);

  const [dragState, setDragState] = useState(null); // { pointIndex, type: 'main'|'handleIn'|'handleOut' }
  const [generatedCode, setGeneratedCode] = useState('');

  // Draw Field & Bezier Curves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines (144" x 144" FTC field simulation)
    ctx.strokeStyle = MAP_CONFIGS[selectedMap].gridColor;
    ctx.lineWidth = 1;
    const step = width / 6; // 6x6 tile grid
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Bezier Curves
    if (waypoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(waypoints[0].x, waypoints[0].y);

      for (let i = 0; i < waypoints.length - 1; i++) {
        const p1 = waypoints[i];
        const p2 = waypoints[i + 1];

        // Cubic Bezier using handleOut of current point & handleIn of next point
        ctx.bezierCurveTo(
          p1.handleOut.x, p1.handleOut.y,
          p2.handleIn.x, p2.handleIn.y,
          p2.x, p2.y
        );
      }

      ctx.strokeStyle = '#facc15'; // Vibrant yellow path line
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // Draw Control Handles and Waypoints
    waypoints.forEach((pt, idx) => {
      // Handle lines
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.handleIn.x, pt.handleIn.y);
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.handleOut.x, pt.handleOut.y);
      ctx.stroke();

      // Handle In (Circle)
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(pt.handleIn.x, pt.handleIn.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Handle Out (Circle)
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(pt.handleOut.x, pt.handleOut.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Main Waypoint (Circle with outline)
      ctx.fillStyle = idx === 0 ? '#22c55e' : idx === waypoints.length - 1 ? '#ef4444' : '#eab308';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [waypoints, selectedMap]);

  // Drag-and-Drop Handler
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    waypoints.forEach((pt, idx) => {
      const distMain = Math.hypot(pt.x - mouseX, pt.y - mouseY);
      const distIn = Math.hypot(pt.handleIn.x - mouseX, pt.handleIn.y - mouseY);
      const distOut = Math.hypot(pt.handleOut.x - mouseX, pt.handleOut.y - mouseY);

      if (distMain < 12) setDragState({ pointIndex: idx, type: 'main' });
      else if (distIn < 8) setDragState({ pointIndex: idx, type: 'handleIn' });
      else if (distOut < 8) setDragState({ pointIndex: idx, type: 'handleOut' });
    });
  };

  const handleMouseMove = (e) => {
    if (!dragState) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setWaypoints((prev) =>
      prev.map((pt, idx) => {
        if (idx !== dragState.pointIndex) return pt;

        if (dragState.type === 'main') {
          const dx = mouseX - pt.x;
          const dy = mouseY - pt.y;
          return {
            ...pt,
            x: mouseX,
            y: mouseY,
            handleIn: { x: pt.handleIn.x + dx, y: pt.handleIn.y + dy },
            handleOut: { x: pt.handleOut.x + dx, y: pt.handleOut.y + dy },
          };
        } else if (dragState.type === 'handleIn') {
          return { ...pt, handleIn: { x: mouseX, y: mouseY } };
        } else if (dragState.type === 'handleOut') {
          return { ...pt, handleOut: { x: mouseX, y: mouseY } };
        }
        return pt;
      })
    );
  };

  const handleMouseUp = () => setDragState(null);

  // Add Waypoint
  const addWaypoint = () => {
    const last = waypoints[waypoints.length - 1];
    const newPt = {
      x: Math.min(last.x + 100, 550),
      y: last.y,
      handleIn: { x: Math.min(last.x + 50, 500), y: last.y },
      handleOut: { x: Math.min(last.x + 150, 600), y: last.y },
    };
    setWaypoints([...waypoints, newPt]);
  };

  // Convert canvas pixel coordinates (0-600) to FTC Field Inches (-72" to +72")
  const toFTCInches = (px, py) => ({
    x: ((px / 600) * 144 - 72).toFixed(2),
    y: ((py / 600) * 144 - 72).toFixed(2),
  });

  // AI PedroPathing Code Generator
  const generatePedroCode = () => {
    let code = `// Auto-generated PedroPathing Autonomous Code\n`;
    code += `// Map Selected: ${MAP_CONFIGS[selectedMap].name}\n`;
    code += `// Max Speed: ${robotMaxSpeed} | Target Heading: ${robotHeading}°\n\n`;
    code += `public PathChain autoPath;\n\n`;
    code += `public void buildPaths() {\n`;
    code += `    autoPath = follower.pathBuilder()\n`;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];

      const start = toFTCInches(p1.x, p1.y);
      const c1 = toFTCInches(p1.handleOut.x, p1.handleOut.y);
      const c2 = toFTCInches(p2.handleIn.x, p2.handleIn.y);
      const end = toFTCInches(p2.x, p2.y);

      code += `        .addPath(\n`;
      code += `            new BezierCurve(\n`;
      code += `                new Point(${start.x}, ${start.y}, Point.CARTESIAN),\n`;
      code += `                new Point(${c1.x}, ${c1.y}, Point.CARTESIAN),\n`;
      code += `                new Point(${c2.x}, ${c2.y}, Point.CARTESIAN),\n`;
      code += `                new Point(${end.x}, ${end.y}, Point.CARTESIAN)\n`;
      code += `            )\n`;
      code += `        )\n`;
      code += `        .setLinearHeading(Math.toRadians(${robotHeading}))\n`;
      code += `        .setMaxPower(${robotMaxSpeed})\n`;
    }

    code += `        .build();\n}`;
    setGeneratedCode(code);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-950 text-slate-100 min-h-screen">
      {/* Settings & Sidebar */}
      <div className="w-full lg:w-96 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-yellow-400">PedroPath Studio</h2>

        {/* Map Selection */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">FTC Game Field Map</label>
          <select
            value={selectedMap}
            onChange={(e) => setSelectedMap(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200"
          >
            <option value="biobuzz">Biobuzz FTC Map</option>
            <option value="decode">Decode FTC Map</option>
          </select>
        </div>

        {/* Speed & Heading */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Max Robot Speed: {Math.round(robotMaxSpeed * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={robotMaxSpeed}
              onChange={(e) => setRobotMaxSpeed(parseFloat(e.target.value))}
              className="w-full accent-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Robot Heading Angle: {robotHeading}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={robotHeading}
              onChange={(e) => setRobotHeading(parseInt(e.target.value))}
              className="w-full accent-yellow-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={addWaypoint}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-yellow-400 font-semibold py-2 px-4 rounded-lg border border-slate-700 transition"
          >
            + Add Point
          </button>
          <button
            onClick={generatePedroCode}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold py-2 px-4 rounded-lg transition"
          >
            Generate Code
          </button>
        </div>
      </div>

      {/* 2D Canvas Workspace */}
      <div className="flex-1 flex flex-col items-center">
        <div className={`p-4 rounded-2xl border ${MAP_CONFIGS[selectedMap].bgClass}`}>
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="rounded-lg border border-slate-800 cursor-crosshair bg-slate-950"
          />
        </div>
      </div>

      {/* Code Display Area */}
      {generatedCode && (
        <div className="w-full lg:w-96 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">Generated PedroPathing Java</h3>
          <textarea
            readOnly
            value={generatedCode}
            className="w-full flex-1 min-h-[300px] bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-400 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}