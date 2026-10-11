import React from "react";

/**
 * DeliveryVanIcon (Ultra-High Definition Vector)
 * Precision-crafted matching user reference image:
 * - Thick, crisp deep navy outlines (#003853) with rounded joins
 * - Vibrant lime-green cargo box with corner shadow and top highlight
 * - Pure white cabin and chassis with sharp contrast
 * - Sky blue windshield with steering wheel silhouette
 * - Door handle circle
 * - Two distinct wheels with light blue-gray hubcaps and center rivets
 * - Speed motion trail lines at the base
 */
export default function DeliveryVanIcon({ className = "w-9 h-7", style = {} }) {
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
      {/* 1. SPEED MOTION LINES (Bottom) */}
      <circle cx="12" cy="106" r="3.5" fill="#003853" />
      <path
        d="M 20 106 H 38 C 47 106 54 100 55 92"
        stroke="#003853"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M 98 106 H 116 C 125 106 132 100 133 92"
        stroke="#003853"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* 2. WHITE CABIN & CHASSIS (Single high-contrast white path) */}
      <path
        d="M 14 68 
           H 92 
           V 30 
           Q 92 23 99 23 
           H 120 
           Q 127 23 131 31 
           L 145 56 
           Q 149 63 149 71 
           V 89 
           Q 149 94 144 94 
           H 136 
           A 17 17 0 0 0 102 94 
           H 64 
           A 17 17 0 0 0 30 94 
           H 19 
           Q 14 94 14 89 
           Z"
        fill="#ffffff"
        stroke="#003853"
        strokeWidth="5.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 3. GREEN CARGO BOX */}
      {/* Base rounded box */}
      <rect
        x="14"
        y="10"
        width="78"
        height="58"
        rx="12"
        fill="#8bd437"
        stroke="#003853"
        strokeWidth="5.5"
        strokeLinejoin="round"
      />

      {/* Cargo Box Bottom-Left Curved Shadow */}
      <path
        d="M 17 48 
           C 17 60 26 65 38 65 
           H 89 
           V 65 
           H 36 
           C 25 65 17 58 17 48 
           Z"
        fill="#6da923"
        opacity="0.85"
      />

      {/* Cargo Box Top-Right Highlight */}
      <path
        d="M 82 15 Q 89 15 89 22 V 62"
        stroke="#a3e635"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* 4. CABIN WINDSHIELD (Sky Blue Glass) */}
      <path
        d="M 98 31 
           H 119 
           Q 123 31 126 37 
           L 133 52 
           Q 134 55 130 55 
           H 98 
           Z"
        fill="#5da4e8"
        stroke="#003853"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />

      {/* Steering wheel silhouette visible through glass */}
      <ellipse
        cx="122"
        cy="48"
        rx="4"
        ry="6.5"
        fill="#003853"
        transform="rotate(-22 122 48)"
      />

      {/* Door Handle */}
      <circle cx="105" cy="64" r="3.5" fill="#003853" />

      {/* Cabin vertical door seam line */}
      <path
        d="M 92 56 V 94"
        stroke="#003853"
        strokeWidth="5.5"
      />

      {/* 5. WHEELS (Thick dark blue tires with light blue-gray hubcaps) */}
      {/* Rear Wheel */}
      <g>
        <circle cx="47" cy="93" r="16.5" fill="#003853" />
        <circle cx="47" cy="93" r="9.5" fill="#9dbfdc" stroke="#003853" strokeWidth="3" />
        <circle cx="47" cy="93" r="3.5" fill="#003853" />
      </g>

      {/* Front Wheel */}
      <g>
        <circle cx="119" cy="93" r="16.5" fill="#003853" />
        <circle cx="119" cy="93" r="9.5" fill="#9dbfdc" stroke="#003853" strokeWidth="3" />
        <circle cx="119" cy="93" r="3.5" fill="#003853" />
      </g>
    </svg>
  );
}

/**
 * High-Definition Pure SVG string for Leaflet Map Markers
 */
export const DELIVERY_VAN_SVG_HTML = `
  <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; display: block; overflow: visible; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));">
    <!-- Speed Motion Lines -->
    <circle cx="12" cy="106" r="3.5" fill="#003853" />
    <path d="M 20 106 H 38 C 47 106 54 100 55 92" stroke="#003853" stroke-width="5.5" stroke-linecap="round" />
    <path d="M 98 106 H 116 C 125 106 132 100 133 92" stroke="#003853" stroke-width="5.5" stroke-linecap="round" />

    <!-- White Cabin & Body with Wheel Arches -->
    <path d="M 14 68 H 92 V 30 Q 92 23 99 23 H 120 Q 127 23 131 31 L 145 56 Q 149 63 149 71 V 89 Q 149 94 144 94 H 136 A 17 17 0 0 0 102 94 H 64 A 17 17 0 0 0 30 94 H 19 Q 14 94 14 89 Z" fill="#ffffff" stroke="#003853" stroke-width="5.5" stroke-linejoin="round" stroke-linecap="round" />

    <!-- Green Cargo Box -->
    <rect x="14" y="10" width="78" height="58" rx="12" fill="#8bd437" stroke="#003853" stroke-width="5.5" stroke-linejoin="round" />
    
    <!-- Cargo Box Bottom-Left Curved Shadow & Top Highlight -->
    <path d="M 17 48 C 17 60 26 65 38 65 H 89 V 65 H 36 C 25 65 17 58 17 48 Z" fill="#6da923" opacity="0.85" />
    <path d="M 82 15 Q 89 15 89 22 V 62" stroke="#a3e635" stroke-width="3.5" stroke-linecap="round" />

    <!-- Sky Blue Windshield & Window -->
    <path d="M 98 31 H 119 Q 123 31 126 37 L 133 52 Q 134 55 130 55 H 98 Z" fill="#5da4e8" stroke="#003853" stroke-width="4.5" stroke-linejoin="round" />
    <ellipse cx="122" cy="48" rx="4" ry="6.5" fill="#003853" transform="rotate(-22 122 48)" />

    <!-- Door Handle & Vertical Seam -->
    <circle cx="105" cy="64" r="3.5" fill="#003853" />
    <path d="M 92 56 V 94" stroke="#003853" stroke-width="5.5" />

    <!-- High-Definition Wheels with Hubcaps -->
    <circle cx="47" cy="93" r="16.5" fill="#003853" />
    <circle cx="47" cy="93" r="9.5" fill="#9dbfdc" stroke="#003853" stroke-width="3" />
    <circle cx="47" cy="93" r="3.5" fill="#003853" />

    <circle cx="119" cy="93" r="16.5" fill="#003853" />
    <circle cx="119" cy="93" r="9.5" fill="#9dbfdc" stroke="#003853" stroke-width="3" />
    <circle cx="119" cy="93" r="3.5" fill="#003853" />
  </svg>
`;
