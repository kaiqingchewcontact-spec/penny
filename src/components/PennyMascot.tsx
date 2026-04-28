import React from 'react';

export function PennyFace({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: '50%' }}>
      <circle cx="50" cy="50" r="48" fill="#FFD4C8" />
      <circle cx="50" cy="50" r="44" fill="#FFBFAE" />
      <ellipse cx="25" cy="28" rx="12" ry="14" fill="#FFB4A2" />
      <ellipse cx="75" cy="28" rx="12" ry="14" fill="#FFB4A2" />
      <ellipse cx="25" cy="28" rx="8" ry="10" fill="#FFCDBF" />
      <ellipse cx="75" cy="28" rx="8" ry="10" fill="#FFCDBF" />
      <circle cx="37" cy="45" r="4" fill="#5C4A3D" />
      <circle cx="63" cy="45" r="4" fill="#5C4A3D" />
      <circle cx="38" cy="44" r="1.5" fill="white" />
      <circle cx="64" cy="44" r="1.5" fill="white" />
      <ellipse cx="50" cy="60" rx="16" ry="12" fill="#FFCDBF" />
      <circle cx="45" cy="58" r="3" fill="#E8998D" />
      <circle cx="55" cy="58" r="3" fill="#E8998D" />
      <path d="M 43 65 Q 50 71 57 65" stroke="#C07A6E" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="55" r="7" fill="#FFB4A2" opacity="0.5" />
      <circle cx="74" cy="55" r="7" fill="#FFB4A2" opacity="0.5" />
      <polygon points="42,78 50,82 50,76" fill="#C4B5FD" />
      <polygon points="58,78 50,82 50,76" fill="#A78BFA" />
      <circle cx="50" cy="79" r="2.5" fill="#8B73E8" />
    </svg>
  );
}

export function PennyMini({ size = 32 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      overflow: 'hidden', flexShrink: 0,
    }}>
      <PennyFace size={size} />
    </div>
  );
}
