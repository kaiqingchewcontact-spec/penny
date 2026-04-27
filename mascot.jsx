/* global React */
// ═════════════════════════════════════════════════════════════════
// Penny mascot SVGs (cute peach bean with eyes — restrained use)
// ═════════════════════════════════════════════════════════════════

// Photo-based Penny — friendly piggy bank mascot
function Mascot({ size = 96 }) {
  return (
    <div style={{
      width: size, height: size,
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* soft halo */}
      <div style={{
        position: 'absolute', inset: -size * 0.12,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #FFE3D6 0%, #FCE0EE 55%, transparent 75%)',
        zIndex: 0,
      }}></div>
      {/* circular clipped photo */}
      <div style={{
        position: 'relative',
        width: size, height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'linear-gradient(140deg, #FFD8C7 0%, #FFB4A2 60%, #F8B4D9 100%)',
        boxShadow: '0 6px 16px rgba(240,138,110,0.28), inset 0 0 0 2px rgba(255,255,255,0.7)',
        zIndex: 1,
      }}>
        <img
          src="assets/penny-face-cut.png"
          alt="Penny"
          draggable="false"
          width={size}
          height={size}
          style={{
            display: 'block',
            width: size, height: size,
            objectFit: 'cover',
            objectPosition: '50% 35%',
          }}
        />
      </div>
    </div>
  );
}

function MascotMini({ size = 28 }) {
  return (
    <img
      src="assets/penny-face-cut.png"
      alt="Penny"
      draggable="false"
      style={{
        width: size, height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        objectPosition: '50% 35%',
        background: 'linear-gradient(140deg, #FFD8C7 0%, #FFB4A2 60%, #F8B4D9 100%)',
        boxShadow: '0 1px 0 rgba(240, 138, 110, 0.2), inset 0 0 0 1.5px rgba(255,255,255,0.6)',
      }}
    />
  );
}

window.Mascot = Mascot;
window.MascotMini = MascotMini;
