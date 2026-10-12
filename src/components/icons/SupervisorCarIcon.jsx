import React from "react";

/**
 * SupervisorCarIcon (Ultra-High Definition Vector)
 * Sleek corporate inspection SUV / Crossover:
 * - Thick navy outlines (#003853) with crisp curves
 * - High-contrast white vehicle body with metallic highlights
 * - Tinted sky-blue windows with steering wheel and mirror
 * - Amber/Gold inspection roof beacon / light bar
 * - Modern alloy wheels with center hubcaps
 */
export default function SupervisorCarIcon({ className = "w-9 h-7", style = {}, beaconColor = "#f59e0b" }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
        ...style
      }}
    >
      {/* 1. SPEED LINES */}
      <circle cx="12" cy="106" r="3.5" fill="#003853" />
      <path d="M 20 106 H 38 C 47 106 52 100 53 92" stroke="#003853" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M 98 106 H 116 C 125 106 130 100 131 92" stroke="#003853" strokeWidth="5.5" strokeLinecap="round" />

      {/* 2. ROOF BEACON / LIGHT BAR (Supervisor Inspection) */}
      <rect x="68" y="22" width="24" height="7" rx="3" fill={beaconColor} stroke="#003853" strokeWidth="3.5" />
      <rect x="76" y="20" width="8" height="4" rx="1.5" fill="#ffffff" opacity="0.8" />

      {/* 3. ROOF RAILS */}
      <path d="M 50 30 H 108" stroke="#003853" strokeWidth="4" strokeLinecap="round" />

      {/* 4. SUV BODY & CHASSIS */}
      <path
        d="M 16 72 
           L 24 50 
           Q 28 42 36 38 
           L 62 31 
           Q 70 29 80 29 
           L 108 30 
           Q 118 31 126 39 
           L 142 56 
           Q 148 62 148 70 
           L 148 88 
           Q 148 93 143 93 
           H 136 
           A 17 17 0 0 0 102 93 
           H 64 
           A 17 17 0 0 0 30 93 
           H 20 
           Q 16 93 16 88 
           Z"
        fill="#ffffff"
        stroke="#003853"
        strokeWidth="5.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 5. SIDE ACCENT STRIPE (Executive Navy / Amber) */}
      <path d="M 22 72 H 144" stroke="#0284c7" strokeWidth="3" opacity="0.3" strokeLinecap="round" />

      {/* 6. FRONT & REAR WINDOWS (Tinted Sky Blue) */}
      {/* Front Windshield */}
      <path
        d="M 98 34 
           H 112 
           Q 118 34 122 40 
           L 133 55 
           Q 134 58 130 58 
           H 98 
           Z"
        fill="#38bdf8"
        stroke="#003853"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />

      {/* Rear & Side Windows */}
      <path
        d="M 42 42 
           L 62 35 
           H 92 
           V 58 
           H 36 
           Q 37 47 42 42 
           Z"
        fill="#7dd3fc"
        stroke="#003853"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />

      {/* Window Pillar Separator */}
      <line x1="72" y1="33" x2="72" y2="58" stroke="#003853" strokeWidth="4" />

      {/* Side Mirror */}
      <path d="M 96 55 L 90 52 Q 88 54 90 58 L 96 58 Z" fill="#0284c7" stroke="#003853" strokeWidth="3" />

      {/* Door Handles */}
      <circle cx="56" cy="65" r="3" fill="#003853" />
      <circle cx="86" cy="65" r="3" fill="#003853" />

      {/* 7. WHEELS */}
      {/* Rear Wheel */}
      <g>
        <circle cx="47" cy="93" r="16.5" fill="#003853" />
        <circle cx="47" cy="93" r="9.5" fill="#cbd5e1" stroke="#003853" strokeWidth="3" />
        <circle cx="47" cy="93" r="3.5" fill="#003853" />
      </g>

      {/* Front Wheel */}
      <g>
        <circle cx="119" cy="93" r="16.5" fill="#003853" />
        <circle cx="119" cy="93" r="9.5" fill="#cbd5e1" stroke="#003853" strokeWidth="3" />
        <circle cx="119" cy="93" r="3.5" fill="#003853" />
      </g>
    </svg>
  );
}

/**
 * Pure SVG HTML string generator for Leaflet map markers
 */
export function getSupervisorCarSvgHtml(beaconColor = "#f59e0b", width = 38, height = 26) {
  return `
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: ${width}px; height: ${height}px; display: block; overflow: visible; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
      <!-- Speed Lines -->
      <circle cx="12" cy="106" r="3.5" fill="#003853" />
      <path d="M 20 106 H 38 C 47 106 52 100 53 92" stroke="#003853" stroke-width="5.5" stroke-linecap="round" />
      <path d="M 98 106 H 116 C 125 106 130 100 131 92" stroke="#003853" stroke-width="5.5" stroke-linecap="round" />

      <!-- Roof Beacon (Supervisor Inspection) -->
      <rect x="68" y="22" width="24" height="7" rx="3" fill="${beaconColor}" stroke="#003853" stroke-width="3.5" />
      <rect x="76" y="20" width="8" height="4" rx="1.5" fill="#ffffff" opacity="0.8" />

      <!-- Roof Rails -->
      <path d="M 50 30 H 108" stroke="#003853" stroke-width="4" stroke-linecap="round" />

      <!-- SUV White Body -->
      <path d="M 16 72 L 24 50 Q 28 42 36 38 L 62 31 Q 70 29 80 29 L 108 30 Q 118 31 126 39 L 142 56 Q 148 62 148 70 L 148 88 Q 148 93 143 93 H 136 A 17 17 0 0 0 102 93 H 64 A 17 17 0 0 0 30 93 H 20 Q 16 93 16 88 Z" fill="#ffffff" stroke="#003853" stroke-width="5.5" stroke-linejoin="round" stroke-linecap="round" />
      
      <!-- Side Accent Line -->
      <path d="M 22 72 H 144" stroke="#0284c7" stroke-width="3" opacity="0.35" stroke-linecap="round" />

      <!-- Windows -->
      <path d="M 98 34 H 112 Q 118 34 122 40 L 133 55 Q 134 58 130 58 H 98 Z" fill="#38bdf8" stroke="#003853" stroke-width="4.5" stroke-linejoin="round" />
      <path d="M 42 42 L 62 35 H 92 V 58 H 36 Q 37 47 42 42 Z" fill="#7dd3fc" stroke="#003853" stroke-width="4.5" stroke-linejoin="round" />
      <line x1="72" y1="33" x2="72" y2="58" stroke="#003853" stroke-width="4" />

      <!-- Wheels -->
      <circle cx="47" cy="93" r="16.5" fill="#003853" />
      <circle cx="47" cy="93" r="9.5" fill="#cbd5e1" stroke="#003853" stroke-width="3" />
      <circle cx="47" cy="93" r="3.5" fill="#003853" />

      <circle cx="119" cy="93" r="16.5" fill="#003853" />
      <circle cx="119" cy="93" r="9.5" fill="#cbd5e1" stroke="#003853" stroke-width="3" />
      <circle cx="119" cy="93" r="3.5" fill="#003853" />
    </svg>
  `;
}
