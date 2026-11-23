import { useId } from 'react';
import gearSprites from './hero-gears.png';

// Each square in the atlas is centered on its gear's pivot in the original artwork.
const gears = [
  { x: 347, y: 68, size: 52, tileX: 0, tileY: 0, seconds: 13, reverse: true },
  { x: 422, y: 83, size: 110, tileX: 52, tileY: 0, seconds: 24 },
  { x: 495, y: 63, size: 54, tileX: 162, tileY: 0, seconds: 13, reverse: true },
  { x: 550, y: 106, size: 90, tileX: 216, tileY: 0, seconds: 18 },
  { x: 305, y: 173, size: 186, tileX: 306, tileY: 0, seconds: 32 },
  { x: 482, y: 217, size: 190, tileX: 492, tileY: 0, seconds: 33, reverse: true },
  { x: 610, y: 168, size: 100, tileX: 0, tileY: 190, seconds: 20 },
  { x: 192, y: 230, size: 86, tileX: 100, tileY: 190, seconds: 17, reverse: true },
  { x: 246, y: 296, size: 94, tileX: 186, tileY: 190, seconds: 20 },
  { x: 357, y: 326, size: 152, tileX: 280, tileY: 190, seconds: 26, reverse: true },
  { x: 619, y: 276, size: 128, tileX: 432, tileY: 190, seconds: 24, reverse: true },
  { x: 514, y: 418, size: 232, tileX: 0, tileY: 342, seconds: 38 },
  { x: 647, y: 360, size: 54, tileX: 232, tileY: 342, seconds: 13 },
];

export default function HeroGearArtwork() {
  const id = useId();
  const atlasId = `${id}-gears`;
  const fillId = `${id}-profile-fill`;
  const outlineId = `${id}-profile-outline`;

  return (
    <svg
      viewBox="0 0 822 768"
      preserveAspectRatio="xMidYMax meet"
      className="h-full w-full opacity-45 md:opacity-100"
      focusable="false"
    >
      <defs>
        <image id={atlasId} href={gearSprites} width="768" height="574" />
        <linearGradient id={fillId} x2="60%" y2="100%">
          <stop stopColor="currentColor" className="text-ink-850" />
          <stop offset="1" stopColor="currentColor" className="text-ink-950" />
        </linearGradient>
        <linearGradient id={outlineId} x2="80%" y2="100%" className="text-teal-300">
          <stop stopColor="currentColor" stopOpacity="0.65" />
          <stop offset="0.62" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M 424 22 C 574 22 691 132 691 283 C 691 407 646 472 589 526
           C 542 571 566 647 608 734 H 304 C 298 673 275 635 237 625
           C 204 615 158 622 144 613 C 119 600 127 578 134 560
           C 145 537 120 537 123 524 C 125 517 136 515 124 508
           C 107 497 131 482 131 464 C 134 441 102 438 92 425
           C 81 411 113 384 130 357 C 148 329 160 307 143 294
           C 132 282 138 261 143 242 C 168 121 275 22 424 22 Z"
        fill={`url(#${fillId})`}
        stroke={`url(#${outlineId})`}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      {gears.map(({ x, y, size, tileX, tileY, seconds, reverse }) => (
        <g
          key={x}
          className="motion-safe:animate-spin"
          style={{
            transformOrigin: `${x}px ${y}px`,
            animationDuration: `${seconds}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
        >
          <svg
            x={x - size / 2}
            y={y - size / 2}
            width={size}
            height={size}
            viewBox={`${tileX} ${tileY} ${size} ${size}`}
            overflow="hidden"
          >
            <use href={`#${atlasId}`} />
          </svg>
        </g>
      ))}
    </svg>
  );
}
