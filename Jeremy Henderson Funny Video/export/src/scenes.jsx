// scenes.jsx — Jeremy's 45th Birthday Video scenes (expanded)
// Each photo gets its own funny exhibit scene.

const PARTY = {
  hotPink: '#FF2D87',
  electricYellow: '#FFE23B',
  cyan: '#29E5FF',
  deepPurple: '#2A0D4A',
  cream: '#FFF5E1',
  black: '#0A0A0A',
  lime: '#B4FF3A',
  orange: '#FF7A2B',
};

const DISPLAY_FONT = '"Bungee", "Impact", system-ui, sans-serif';
const BODY_FONT = '"Space Grotesk", "Helvetica Neue", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const HAND = '"Caveat", "Space Grotesk", cursive';

const rand = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// ── Shared primitives ───────────────────────────────────────────────────────
function Confetti({ count = 80, seed = 1, colors }) {
  const { localTime } = useSprite();
  const pieces = React.useMemo(() => {
    const r = rand(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i, x: r() * 1920, delay: r() * 2,
      speed: 160 + r() * 260, rot: r() * 360,
      rotSpeed: (r() - 0.5) * 360, size: 10 + r() * 18,
      sway: 40 + r() * 80,
      color: colors[Math.floor(r() * colors.length)],
      shape: r() > 0.5 ? 'rect' : 'circle',
    }));
  }, [count, seed]);
  return (
    <>
      {pieces.map((p) => {
        const t = localTime - p.delay;
        if (t < 0) return null;
        const y = -40 + t * p.speed;
        if (y > 1120) return null;
        const x = p.x + Math.sin(t * 2 + p.id) * p.sway;
        const rot = p.rot + t * p.rotSpeed;
        return (
          <div key={p.id} style={{
            position: 'absolute', left: x, top: y,
            width: p.size, height: p.shape === 'rect' ? p.size * 0.4 : p.size,
            background: p.color, borderRadius: p.shape === 'circle' ? '50%' : 2,
            transform: `rotate(${rot}deg)`, willChange: 'transform',
          }} />
        );
      })}
    </>
  );
}

function StripesBG({ colors, speed = 30 }) {
  const time = useTime();
  const offset = (time * speed) % 200;
  const stops = colors.map((c, i) => {
    const pct = (i / colors.length) * 100;
    const next = ((i + 1) / colors.length) * 100;
    return `${c} ${pct}%, ${c} ${next}%`;
  }).join(', ');
  return (
    <div style={{
      position: 'absolute', inset: -40,
      background: `repeating-linear-gradient(45deg, ${stops})`,
      backgroundSize: '200px 200px',
      backgroundPosition: `${offset}px ${offset}px`,
    }}/>
  );
}

function Shake({ intensity = 4, children, freq = 30 }) {
  const time = useTime();
  const x = Math.sin(time * freq) * intensity;
  const y = Math.cos(time * freq * 1.3) * intensity;
  return <div style={{ position: 'absolute', inset: 0, transform: `translate(${x}px, ${y}px)` }}>{children}</div>;
}

function WobbleWord({ text, x, y, size = 200, color = PARTY.electricYellow, stroke = PARTY.black, delay = 0 }) {
  const { localTime } = useSprite();
  const t = Math.max(0, localTime - delay);
  const letters = text.split('');
  const popIn = Math.min(1, t * 2.5);
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: 'translate(-50%, -50%)',
      fontFamily: DISPLAY_FONT, fontSize: size, fontWeight: 900,
      color, WebkitTextStroke: `6px ${stroke}`, textShadow: `8px 8px 0 ${stroke}`,
      letterSpacing: '0.02em', display: 'flex', opacity: popIn, lineHeight: 1,
    }}>
      {letters.map((l, i) => {
        const wobble = Math.sin(t * 6 + i * 0.7) * 10;
        const scale = 1 + Math.sin(t * 8 + i * 0.5) * 0.05;
        const letterPop = Math.min(1, Math.max(0, t * 3 - i * 0.08));
        return (
          <span key={i} style={{
            display: 'inline-block',
            transform: `translateY(${wobble}px) scale(${scale * letterPop})`,
            willChange: 'transform',
          }}>{l === ' ' ? '\u00A0' : l}</span>
        );
      })}
    </div>
  );
}

// Reusable exhibit photo card
function ExhibitPhoto({ src, x, y, w, h, rotate = 0, frame = PARTY.cream, shadow = PARTY.black, objectPosition = 'center', border = PARTY.black, scale = 1 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: w, height: h,
      transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
      background: frame,
      padding: 18,
      boxShadow: `14px 14px 0 ${shadow}`,
      border: `4px solid ${border}`,
    }}>
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', background: PARTY.black }}>
        <img src={src} alt="" style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition, display: 'block',
        }}/>
      </div>
    </div>
  );
}

// Funny arrow pointing at a subject
function FunnyArrow({ x1, y1, x2, y2, color = PARTY.hotPink, label }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return (
    <>
      <div style={{
        position: 'absolute', left: x1, top: y1,
        width: len, height: 10,
        background: color,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 50%',
        boxShadow: `4px 4px 0 ${PARTY.black}`,
      }}/>
      <div style={{
        position: 'absolute', left: x2, top: y2,
        width: 0, height: 0,
        borderLeft: `30px solid ${color}`,
        borderTop: '20px solid transparent',
        borderBottom: '20px solid transparent',
        transform: `translate(-10px, -20px) rotate(${angle}deg)`,
        transformOrigin: '0 50%',
        filter: `drop-shadow(4px 4px 0 ${PARTY.black})`,
      }}/>
      {label && (
        <div style={{
          position: 'absolute',
          left: x1, top: y1 - 60,
          fontFamily: HAND, fontSize: 52, fontWeight: 700,
          color, WebkitTextStroke: `2px ${PARTY.black}`,
          transform: 'rotate(-5deg)',
        }}>{label}</div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 1 — COUNTDOWN INTRO (0–3s)
function SceneIntro() {
  const { localTime } = useSprite();
  const flash = Math.sin(localTime * 20) > 0 ? 1 : 0.92;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PARTY.black }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 4px)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', left: 80, top: 80,
        fontFamily: MONO, fontSize: 28, color: PARTY.lime, opacity: flash,
      }}>▶ INCOMING TRANSMISSION</div>
      <div style={{
        position: 'absolute', left: 80, top: 130,
        fontFamily: MONO, fontSize: 22, color: 'rgba(180,255,58,0.6)',
      }}>SUBJECT: J. HENDERSON &nbsp;|&nbsp; STATUS: +45 YEARS</div>
      {[
        { n: '3', t: 0.2, c: PARTY.hotPink },
        { n: '2', t: 1.0, c: PARTY.cyan },
        { n: '1', t: 1.8, c: PARTY.electricYellow },
      ].map(({ n, t, c }, i) => {
        if (localTime < t || localTime > t + 0.8) return null;
        const p = (localTime - t) / 0.8;
        return (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: `translate(-50%, -50%) scale(${0.3 + p * 2.2})`,
            fontFamily: DISPLAY_FONT, fontSize: 500, color: c,
            WebkitTextStroke: `10px ${PARTY.black}`,
            opacity: 1 - p, lineHeight: 1,
          }}>{n}</div>
        );
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 2 — TITLE BLAST (3–7s)
function SceneTitle() {
  const { localTime } = useSprite();
  return (
    <>
      <StripesBG colors={[PARTY.hotPink, PARTY.electricYellow, PARTY.cyan, PARTY.hotPink, PARTY.electricYellow]} speed={80}/>
      <Shake intensity={3} freq={25}>
        <WobbleWord text="HAPPY" x={960} y={260} size={200} color={PARTY.electricYellow} stroke={PARTY.black} delay={0}/>
        <WobbleWord text="45th" x={960} y={540} size={340} color={PARTY.hotPink} stroke={PARTY.black} delay={0.3}/>
        <WobbleWord text="BIRTHDAY" x={960} y={820} size={180} color={PARTY.cyan} stroke={PARTY.black} delay={0.6}/>
        {localTime > 0.8 && [
          [140, 280], [1780, 280], [140, 820], [1780, 820],
          [280, 540], [1640, 540],
        ].map(([x, y], i) => {
          const wiggle = Math.sin(localTime * 4 + i) * 15;
          return (
            <div key={i} style={{
              position: 'absolute', left: x, top: y,
              transform: `translate(-50%, -50%) rotate(${wiggle}deg)`,
              fontSize: 120, filter: `drop-shadow(6px 6px 0 ${PARTY.black})`,
            }}>⭐</div>
          );
        })}
      </Shake>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 3 — THE ORIGIN STORY (7–12s) — jeremy1.jpg (sepia Electric Oceans)
function SceneOrigin() {
  const { localTime } = useSprite();
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PARTY.deepPurple }}/>
      {/* Radiating rays */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 2400, height: 2400,
        transform: `translate(-50%, -50%) rotate(${localTime * 20}deg)`,
        background: `repeating-conic-gradient(from 0deg, ${PARTY.hotPink} 0deg 12deg, ${PARTY.deepPurple} 12deg 24deg)`,
        opacity: 0.3,
      }}/>
      {/* CRT header */}
      <div style={{
        position: 'absolute', left: 80, top: 60,
        fontFamily: MONO, fontSize: 28, color: PARTY.lime,
        textShadow: `0 0 10px ${PARTY.lime}`,
      }}>
        ◉ ARCHIVE FOOTAGE · CIRCA 2009
      </div>

      {/* Photo — centered, portrait */}
      <ExhibitPhoto src={window.__resources.jeremy1} x={960} y={560} w={540} h={700} rotate={-2} frame={PARTY.electricYellow} shadow={PARTY.black} scale={0.9 + Math.sin(localTime * 2) * 0.02}/>

      {/* Big title */}
      <div style={{
        position: 'absolute', left: '50%', top: 160,
        transform: 'translateX(-50%) rotate(-2deg)',
        fontFamily: DISPLAY_FONT, fontSize: 140,
        color: PARTY.electricYellow,
        WebkitTextStroke: `6px ${PARTY.black}`,
        textShadow: `10px 10px 0 ${PARTY.hotPink}`,
        whiteSpace: 'nowrap',
      }}>THE ORIGIN STORY</div>

      {/* Side gags */}
      {localTime > 0.8 && (
        <>
          <FunnyArrow x1={200} y1={580} x2={640} y2={560} color={PARTY.electricYellow} label="THE SHAKA"/>
          <div style={{
            position: 'absolute', left: 260, top: 720,
            width: 340,
            background: PARTY.cream, color: PARTY.black,
            fontFamily: HAND, fontSize: 42, fontWeight: 700,
            padding: '18px 24px', border: `4px solid ${PARTY.black}`,
            transform: 'rotate(-4deg)',
            boxShadow: `8px 8px 0 ${PARTY.hotPink}`,
          }}>
            "Electric Oceans" era.<br/>Still cooler than you.
          </div>
        </>
      )}
      {localTime > 1.5 && (
        <div style={{
          position: 'absolute', right: 120, top: 500,
          width: 320,
          background: PARTY.hotPink, color: PARTY.cream,
          fontFamily: DISPLAY_FONT, fontSize: 36,
          padding: '18px 24px', border: `4px solid ${PARTY.black}`,
          transform: `rotate(5deg) scale(${Math.min(1, (localTime - 1.5) * 3)})`,
          boxShadow: `8px 8px 0 ${PARTY.black}`,
          lineHeight: 1.1,
        }}>
          EXHIBIT A:<br/>PURE VIBES
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 4 — CERTIFIED COOL GUY CARD (12–17s) — jeremy2.jpg
function SceneCoolCard() {
  const { localTime } = useSprite();
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PARTY.cream }}/>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${PARTY.black} 1px, transparent 1px), linear-gradient(90deg, ${PARTY.black} 1px, transparent 1px)`,
        backgroundSize: '60px 60px', opacity: 0.08,
      }}/>

      <div style={{
        position: 'absolute', left: 80, top: 60,
        fontFamily: DISPLAY_FONT, fontSize: 80, color: PARTY.black,
        transform: `rotate(-1deg)`,
      }}>OFFICIAL LICENSE</div>

      {/* ID CARD */}
      <div style={{
        position: 'absolute', left: '50%', top: '55%',
        transform: `translate(-50%, -50%) rotate(${-2 + Math.sin(localTime * 2) * 1}deg)`,
        width: 1400, height: 680,
        background: PARTY.electricYellow,
        border: `10px solid ${PARTY.black}`,
        boxShadow: `20px 20px 0 ${PARTY.hotPink}`,
        padding: 40,
        display: 'flex',
        gap: 40,
      }}>
        {/* Photo panel */}
        <div style={{
          width: 440, height: '100%',
          background: PARTY.black,
          padding: 14,
          flexShrink: 0,
        }}>
          <img src={window.__resources.jeremy2} alt="" style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top',
          }}/>
        </div>
        {/* Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            fontFamily: DISPLAY_FONT, fontSize: 64, color: PARTY.hotPink,
            WebkitTextStroke: `3px ${PARTY.black}`, lineHeight: 0.95,
          }}>CERTIFIED COOL GUY™</div>
          <div style={{
            fontFamily: MONO, fontSize: 22, color: PARTY.black,
            letterSpacing: '0.04em', marginTop: -4,
          }}>DEPARTMENT OF LOOKING FRESH · DIVISION 45</div>

          {[
            ['NAME',        'JEREMY HENDERSON'],
            ['AGE',         '45 (NEEDS VERIFICATION)'],
            ['SUNGLASSES',  'PERMANENTLY AFFIXED'],
            ['TATTOOS',     'TRIBAL. OBVIOUSLY.'],
            ['TRUCK STATUS','RED & READY'],
            ['COOLNESS LVL','ILLEGAL IN 12 STATES'],
          ].map(([k, v], i) => {
            const show = localTime > 0.4 + i * 0.15;
            if (!show) return null;
            return (
              <div key={i} style={{
                display: 'flex', gap: 20, alignItems: 'baseline',
                fontFamily: MONO, fontSize: 24,
                borderBottom: `2px dashed ${PARTY.black}`,
                paddingBottom: 6,
              }}>
                <div style={{ width: 200, color: 'rgba(0,0,0,0.55)', fontWeight: 600 }}>{k}</div>
                <div style={{ color: PARTY.black, fontWeight: 700, flex: 1 }}>{v}</div>
              </div>
            );
          })}
          {/* Stamp */}
          {localTime > 2.0 && (
            <div style={{
              position: 'absolute', right: 60, bottom: 40,
              fontFamily: DISPLAY_FONT, fontSize: 40,
              color: PARTY.hotPink,
              border: `5px solid ${PARTY.hotPink}`,
              padding: '8px 20px',
              transform: `rotate(-12deg) scale(${Math.min(1.1, (localTime - 2) * 2)})`,
              opacity: 0.85,
              letterSpacing: '0.05em',
            }}>APPROVED · 45</div>
          )}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 5 — THE ENTOURAGE (17–21s) — jeremy3.jpg (group shot)
function SceneEntourage() {
  const { localTime } = useSprite();
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PARTY.black }}/>
      {/* Spotlight */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 1400, height: 1400,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${PARTY.hotPink}88 0%, transparent 60%)`,
      }}/>

      {/* Photo full-bleed center */}
      <div style={{
        position: 'absolute', left: '50%', top: '52%',
        transform: `translate(-50%, -50%) scale(${0.75 + Math.sin(localTime * 2) * 0.02})`,
        width: 1100, height: 820,
        background: PARTY.electricYellow,
        padding: 20,
        border: `8px solid ${PARTY.black}`,
        boxShadow: `18px 18px 0 ${PARTY.cyan}`,
      }}>
        <img src={window.__resources.jeremy3} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }}/>
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute', left: '50%', top: 70,
        transform: 'translateX(-50%) rotate(-2deg)',
        fontFamily: DISPLAY_FONT, fontSize: 130,
        color: PARTY.electricYellow,
        WebkitTextStroke: `5px ${PARTY.black}`,
        textShadow: `10px 10px 0 ${PARTY.hotPink}`,
      }}>THE ENTOURAGE</div>

      {/* Character arrows/labels */}
      {localTime > 0.6 && (
        <div style={{
          position: 'absolute', left: 80, top: 380,
          background: PARTY.cyan, color: PARTY.black,
          fontFamily: HAND, fontSize: 40, fontWeight: 700,
          padding: '10px 20px', border: `4px solid ${PARTY.black}`,
          transform: 'rotate(-6deg)', boxShadow: `6px 6px 0 ${PARTY.black}`,
          maxWidth: 260, lineHeight: 1.1,
        }}>
          wingman #1
        </div>
      )}
      {localTime > 1.0 && (
        <div style={{
          position: 'absolute', right: 80, top: 420,
          background: PARTY.electricYellow, color: PARTY.black,
          fontFamily: HAND, fontSize: 40, fontWeight: 700,
          padding: '10px 20px', border: `4px solid ${PARTY.black}`,
          transform: 'rotate(6deg)', boxShadow: `6px 6px 0 ${PARTY.black}`,
          maxWidth: 260, lineHeight: 1.1,
        }}>
          wingman #2
        </div>
      )}
      {localTime > 1.5 && (
        <div style={{
          position: 'absolute', left: '50%', bottom: 60,
          transform: 'translateX(-50%) rotate(-2deg)',
          background: PARTY.hotPink, color: PARTY.cream,
          fontFamily: DISPLAY_FONT, fontSize: 64,
          padding: '16px 48px', border: `6px solid ${PARTY.black}`,
          boxShadow: `10px 10px 0 ${PARTY.electricYellow}`,
          whiteSpace: 'nowrap',
        }}>
          ⭐ THE BOSS, CENTER ⭐
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 6 — DAD JOKE DETECTED (21–25s) — jeremy4.jpg (selfie w/ kid in carseat)
function SceneDadJoke() {
  const { localTime } = useSprite();
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PARTY.hotPink }}/>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(${PARTY.cream}33 2px, transparent 2px)`,
        backgroundSize: '50px 50px',
      }}/>

      {/* Photo left */}
      <div style={{
        position: 'absolute', left: 720, top: '50%',
        transform: `translate(-50%, -50%) rotate(${-3 + Math.sin(localTime * 2) * 1}deg)`,
        width: 900, height: 720,
        background: PARTY.cream,
        padding: 20,
        border: `6px solid ${PARTY.black}`,
        boxShadow: `18px 18px 0 ${PARTY.black}`,
      }}>
        <img src={window.__resources.jeremy4} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }}/>
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute', right: 60, top: 80,
        width: 720,
        fontFamily: DISPLAY_FONT, fontSize: 110,
        color: PARTY.electricYellow,
        WebkitTextStroke: `5px ${PARTY.black}`,
        textShadow: `8px 8px 0 ${PARTY.black}`,
        lineHeight: 0.95,
        transform: 'rotate(-2deg)',
      }}>
        ⚠ DAD JOKE<br/>DETECTED
      </div>

      {/* Speech bubble from Jeremy */}
      {localTime > 0.6 && (
        <div style={{
          position: 'absolute', left: 200, top: 140,
          width: 460,
          background: PARTY.cream, color: PARTY.black,
          fontFamily: HAND, fontSize: 44, fontWeight: 700,
          padding: '24px 28px',
          border: `5px solid ${PARTY.black}`,
          borderRadius: 32,
          boxShadow: `8px 8px 0 ${PARTY.black}`,
          transform: `rotate(-3deg) scale(${Math.min(1, localTime * 2)})`,
          lineHeight: 1.15,
        }}>
          "Hi Hungry, I'm Dad."
          <div style={{
            position: 'absolute', bottom: -40, left: 80,
            width: 0, height: 0,
            borderTop: `40px solid ${PARTY.black}`,
            borderLeft: '30px solid transparent',
            borderRight: '30px solid transparent',
          }}/>
        </div>
      )}

      {/* Kid reaction */}
      {localTime > 1.4 && (
        <div style={{
          position: 'absolute', right: 110, bottom: 320,
          width: 420,
          background: PARTY.cyan, color: PARTY.black,
          fontFamily: HAND, fontSize: 44, fontWeight: 700,
          padding: '20px 24px',
          border: `5px solid ${PARTY.black}`,
          borderRadius: 32,
          boxShadow: `8px 8px 0 ${PARTY.black}`,
          transform: `rotate(4deg) scale(${Math.min(1, (localTime - 1.4) * 2)})`,
          lineHeight: 1.15,
        }}>
          kid (internally):<br/>"not again..."
        </div>
      )}

      {/* Bottom banner */}
      {localTime > 2.2 && (
        <div style={{
          position: 'absolute', right: 80, bottom: 80,
          background: PARTY.black, color: PARTY.electricYellow,
          fontFamily: DISPLAY_FONT, fontSize: 48,
          padding: '14px 32px',
          transform: `rotate(-3deg) scale(${Math.min(1, (localTime - 2.2) * 3)})`,
        }}>
          DAD-TO-CRINGE RATIO: 100%
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 7 — FIRST DAY BODYGUARD (25–29s) — jeremy5.jpg (with mohawk kid)
function SceneBodyguard() {
  const { localTime } = useSprite();
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PARTY.lime }}/>
      {/* Hazard diagonal */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(45deg, transparent 0 120px, rgba(0,0,0,0.08) 120px 140px)`,
      }}/>

      {/* Photo right-centered */}
      <div style={{
        position: 'absolute', right: 120, top: '50%',
        transform: `translate(0, -50%) rotate(${3 + Math.sin(localTime * 2) * 1}deg)`,
        width: 720, height: 820,
        background: PARTY.cream, padding: 20,
        border: `6px solid ${PARTY.black}`,
        boxShadow: `-16px 16px 0 ${PARTY.black}`,
      }}>
        <img src={window.__resources.jeremy5} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }}/>
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute', left: 80, top: 100,
        fontFamily: DISPLAY_FONT, fontSize: 140,
        color: PARTY.black, lineHeight: 0.9,
      }}>
        FIRST DAY<br/>
        <span style={{ color: PARTY.hotPink, WebkitTextStroke: `3px ${PARTY.black}` }}>OF SCHOOL</span>
      </div>

      {/* Mission brief */}
      {localTime > 0.5 && (
        <div style={{
          position: 'absolute', left: 80, top: 440,
          width: 640,
          background: PARTY.black, color: PARTY.electricYellow,
          fontFamily: MONO, fontSize: 22,
          padding: '24px 28px',
          boxShadow: `10px 10px 0 ${PARTY.hotPink}`,
          letterSpacing: '0.04em',
          transform: `translateX(${(1 - Math.min(1, localTime * 3)) * -400}px)`,
          opacity: Math.min(1, localTime * 3),
          lineHeight: 1.5,
        }}>
          ▸ MISSION: ESCORT PROTOCOL<br/>
          ▸ ASSET: ONE (1) SMALL LEGEND<br/>
          ▸ HAIRSTYLE: MOHAWK (INTIMIDATING)<br/>
          ▸ THREAT ASSESSMENT: 1st GRADERS<br/>
          ▸ DAD STATUS: FULLY DEPLOYED
        </div>
      )}

      {/* Banner */}
      {localTime > 1.8 && (
        <div style={{
          position: 'absolute', left: 80, bottom: 80,
          background: PARTY.hotPink, color: PARTY.cream,
          fontFamily: DISPLAY_FONT, fontSize: 64,
          padding: '16px 40px',
          border: `6px solid ${PARTY.black}`,
          boxShadow: `10px 10px 0 ${PARTY.black}`,
          transform: `rotate(-3deg) scale(${Math.min(1, (localTime - 1.8) * 2.5)})`,
        }}>
          PROTECTION DETAIL: ELITE
        </div>
      )}

      {/* Kid arrow */}
      {localTime > 2.4 && (
        <FunnyArrow x1={860} y1={240} x2={1100} y2={340} color={PARTY.hotPink} label="TINY BOSS"/>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 8 — DAD SIMULATOR ULTRA (29–33s) — jeremy6.jpg (wagon + groceries + ZOMBIE shirt)
function SceneDadSim() {
  const { localTime } = useSprite();

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PARTY.deepPurple }}/>
      {/* Video game HUD vibes */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${PARTY.cyan}18 1px, transparent 1px)`,
        backgroundSize: '100% 40px',
      }}/>

      {/* Photo — portrait, right */}
      <div style={{
        position: 'absolute', right: 120, top: '50%',
        transform: `translate(0, -50%)`,
        width: 620, height: 860,
        background: PARTY.electricYellow,
        padding: 18,
        border: `6px solid ${PARTY.black}`,
        boxShadow: `-14px 14px 0 ${PARTY.hotPink}`,
      }}>
        <img src={window.__resources.jeremy6} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }}/>
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute', left: 80, top: 80,
        fontFamily: DISPLAY_FONT, fontSize: 110,
        color: PARTY.electricYellow,
        WebkitTextStroke: `5px ${PARTY.black}`,
        textShadow: `8px 8px 0 ${PARTY.hotPink}`,
        lineHeight: 0.9,
      }}>
        DAD SIMULATOR:<br/>ULTRA MODE
      </div>

      {/* HUD stats */}
      <div style={{
        position: 'absolute', left: 80, top: 360,
        width: 640,
        fontFamily: MONO, fontSize: 26,
        color: PARTY.cream,
      }}>
        {[
          { label: 'HP (HAUL POINTS)',    bar: 0.95, color: PARTY.lime, val: '95/100' },
          { label: 'STAMINA',             bar: 0.65, color: PARTY.electricYellow, val: '65/100' },
          { label: 'SUNGLASSES CHARGE',   bar: 1.0,  color: PARTY.cyan, val: 'MAX' },
          { label: 'KID SATISFACTION',    bar: 0.88, color: PARTY.hotPink, val: '88/100' },
          { label: 'GROCERY LOAD',        bar: 1.0,  color: PARTY.orange, val: 'BOTH HANDS' },
        ].map((s, i) => {
          const show = localTime > 0.3 + i * 0.25;
          if (!show) return null;
          const fill = Math.min(s.bar, Math.max(0, (localTime - 0.3 - i * 0.25) * 1.8));
          return (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>{s.label}</span>
                <span style={{ color: s.color }}>{s.val}</span>
              </div>
              <div style={{
                width: '100%', height: 24,
                background: 'rgba(255,255,255,0.15)',
                border: `3px solid ${PARTY.black}`,
              }}>
                <div style={{
                  width: `${fill * 100}%`, height: '100%',
                  background: s.color,
                  transition: 'width 0.1s',
                }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievement popup */}
      {localTime > 2.5 && (
        <div style={{
          position: 'absolute', left: 80, bottom: 80,
          width: 640,
          background: PARTY.black,
          border: `4px solid ${PARTY.electricYellow}`,
          padding: '20px 24px',
          transform: `translateX(${(1 - Math.min(1, (localTime - 2.5) * 3)) * -400}px)`,
          opacity: Math.min(1, (localTime - 2.5) * 3),
          boxShadow: `0 0 40px ${PARTY.electricYellow}55`,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 18, color: PARTY.electricYellow, letterSpacing: '0.15em' }}>
            🏆 ACHIEVEMENT UNLOCKED
          </div>
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: 36, color: PARTY.cream, marginTop: 6 }}>
            "BOTH HANDS FULL, STILL COOL"
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 9 — SHOWOFF LEVEL: MAXIMUM (33–37s) — jeremy7.jpg (stability ball)
function SceneShowoff() {
  const { localTime } = useSprite();
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PARTY.black }}/>
      {/* Spot beams */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 2200, height: 2200,
        transform: `translate(-50%, -50%) rotate(${localTime * 15}deg)`,
        background: `repeating-conic-gradient(from 0deg, ${PARTY.electricYellow}22 0deg 20deg, transparent 20deg 40deg)`,
      }}/>

      {/* Photo center */}
      <div style={{
        position: 'absolute', left: '50%', top: '52%',
        transform: `translate(-50%, -50%) scale(${0.95 + Math.sin(localTime * 3) * 0.02})`,
        width: 500, height: 820,
        background: PARTY.hotPink,
        padding: 18,
        border: `6px solid ${PARTY.black}`,
        boxShadow: `16px 16px 0 ${PARTY.electricYellow}`,
      }}>
        <img src={window.__resources.jeremy7} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }}/>
      </div>

      {/* Title top */}
      <div style={{
        position: 'absolute', left: '50%', top: 60,
        transform: 'translateX(-50%) rotate(-2deg)',
        fontFamily: DISPLAY_FONT, fontSize: 100,
        color: PARTY.electricYellow,
        WebkitTextStroke: `4px ${PARTY.black}`,
        textShadow: `8px 8px 0 ${PARTY.hotPink}`,
        whiteSpace: 'nowrap',
      }}>SHOWOFF LEVEL: MAXIMUM</div>

      {/* Left text */}
      {localTime > 0.4 && (
        <div style={{
          position: 'absolute', left: 80, top: 320,
          width: 440,
          fontFamily: HAND, fontSize: 48, fontWeight: 700,
          color: PARTY.electricYellow,
          transform: `rotate(-4deg) translateX(${(1 - Math.min(1, localTime * 2)) * -200}px)`,
          opacity: Math.min(1, localTime * 2),
          lineHeight: 1.1,
          textShadow: `4px 4px 0 ${PARTY.black}`,
        }}>
          Literally just<br/>balancing on a ball...<br/>
          <span style={{ color: PARTY.hotPink }}>in front of his kid.</span>
        </div>
      )}

      {/* Right text */}
      {localTime > 1.2 && (
        <div style={{
          position: 'absolute', right: 80, top: 360,
          width: 420,
          fontFamily: HAND, fontSize: 46, fontWeight: 700,
          color: PARTY.cyan,
          transform: `rotate(3deg) translateX(${(1 - Math.min(1, (localTime - 1.2) * 2)) * 200}px)`,
          opacity: Math.min(1, (localTime - 1.2) * 2),
          lineHeight: 1.1,
          textShadow: `4px 4px 0 ${PARTY.black}`,
        }}>
          Kid's face says:<br/>
          <span style={{ color: PARTY.electricYellow }}>"dad, please, stop."</span>
        </div>
      )}

      {/* Bottom banner */}
      {localTime > 2.2 && (
        <div style={{
          position: 'absolute', left: '50%', bottom: 60,
          transform: `translateX(-50%) rotate(-2deg) scale(${Math.min(1, (localTime - 2.2) * 2.5)})`,
          background: PARTY.electricYellow, color: PARTY.black,
          fontFamily: DISPLAY_FONT, fontSize: 56,
          padding: '16px 48px',
          border: `6px solid ${PARTY.black}`,
          boxShadow: `10px 10px 0 ${PARTY.hotPink}`,
          whiteSpace: 'nowrap',
        }}>
          STILL GOT IT @ 45. ANNOYINGLY.
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 10 — WARNING LABEL (37–41s)
function SceneWarning() {
  const { localTime } = useSprite();
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PARTY.black }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: 100,
        background: `repeating-linear-gradient(45deg, ${PARTY.electricYellow} 0 40px, ${PARTY.black} 40px 80px)`,
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 100,
        background: `repeating-linear-gradient(-45deg, ${PARTY.electricYellow} 0 40px, ${PARTY.black} 40px 80px)`,
      }}/>

      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%, -50%) scale(${0.88 + Math.sin(localTime * 3) * 0.02})`,
        width: 540, height: 720,
        background: PARTY.electricYellow, padding: 14,
      }}>
        <img src={window.__resources.jeremy3} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          filter: 'contrast(1.1) saturate(1.2)',
        }}/>
      </div>

      <div style={{
        position: 'absolute', left: 80, top: '50%',
        transform: `translateY(-50%) rotate(${Math.sin(localTime * 4) * 4}deg)`,
        width: 500,
        background: PARTY.electricYellow,
        border: `8px solid ${PARTY.black}`,
        padding: 32, boxShadow: `12px 12px 0 ${PARTY.hotPink}`,
      }}>
        <div style={{ fontFamily: DISPLAY_FONT, fontSize: 70, color: PARTY.black, lineHeight: 0.95 }}>⚠ CAUTION</div>
        <div style={{ fontFamily: DISPLAY_FONT, fontSize: 44, color: PARTY.black, marginTop: 16 }}>SUBJECT IS</div>
        <div style={{
          fontFamily: DISPLAY_FONT, fontSize: 88, color: PARTY.hotPink,
          WebkitTextStroke: `3px ${PARTY.black}`, marginTop: 8, lineHeight: 1,
        }}>45 &amp; FABULOUS</div>
      </div>

      <div style={{
        position: 'absolute', right: 80, top: '50%',
        transform: `translateY(-50%) rotate(${-Math.sin(localTime * 4) * 4}deg)`,
        width: 480,
        background: PARTY.cyan, border: `8px solid ${PARTY.black}`,
        padding: 28, boxShadow: `-12px 12px 0 ${PARTY.electricYellow}`,
      }}>
        <div style={{
          fontFamily: DISPLAY_FONT, fontSize: 36, color: PARTY.black,
          lineHeight: 1, marginBottom: 16,
        }}>SIDE EFFECTS MAY INCLUDE:</div>
        <ul style={{
          fontFamily: BODY_FONT, fontSize: 26, color: PARTY.black,
          fontWeight: 700, lineHeight: 1.4, paddingLeft: 24, margin: 0,
        }}>
          <li>Stories starting with "back in my day"</li>
          <li>Groaning when standing up</li>
          <li>Uncontrollable levels of cool</li>
          <li>Still absolutely crushing it</li>
        </ul>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 11 — FINALE (41–47s)
function SceneFinale() {
  const { localTime } = useSprite();
  const candleBlown = localTime > 2.2;
  const flameFlicker = 1 + Math.sin(localTime * 30) * 0.15;
  const tw = (typeof window !== 'undefined' && window.JEREMY_TWEAKS) || {};
  const NAME = (tw.name || 'JEREMY').toString().toUpperCase();
  const AGE = (tw.age != null ? tw.age : 45).toString();
  const showWish = tw.showWish !== false;

  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, ${PARTY.hotPink} 0%, ${PARTY.deepPurple} 70%, ${PARTY.black} 100%)`,
      }}/>
      {candleBlown && (
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 1800 * Math.min(1, (localTime - 2.2) * 2),
          height: 1800 * Math.min(1, (localTime - 2.2) * 2),
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${PARTY.electricYellow} 0%, transparent 70%)`,
          opacity: Math.max(0, 0.8 - (localTime - 2.2) * 0.3),
        }}/>
      )}

      {/* ── MAKE A WISH! (0.5s → fades 2.5-3.0s; out of the way before "45" and finale text appear) ── */}
      {showWish && localTime > 0.4 && localTime < 3.0 && (() => {
        const inT = Math.min(1, (localTime - 0.4) / 0.4);
        const outT = Math.max(0, Math.min(1, (localTime - 2.5) / 0.5));
        const ease = 1 - Math.pow(1 - inT, 3);
        const op = 1 - outT;
        const scale = ease * (1 - outT * 0.3);
        return (
          <div style={{
            position: 'absolute', left: '50%', top: 110,
            transform: `translate(-50%, 0) scale(${scale})`,
            fontFamily: DISPLAY_FONT, fontSize: 110,
            color: PARTY.electricYellow,
            WebkitTextStroke: `5px ${PARTY.black}`,
            textShadow: `8px 8px 0 ${PARTY.black}`,
            whiteSpace: 'nowrap',
            opacity: op,
            lineHeight: 1,
          }}>MAKE A WISH!</div>
        );
      })()}

      {/* ── CAKE (lower-middle, under the "45") ── */}
      <div style={{
        position: 'absolute', left: '50%', top: 620,
        transform: 'translateX(-50%)', width: 720,
      }}>
        {/* Candles */}
        <div style={{
          position: 'absolute', left: '50%', top: -180,
          transform: 'translateX(-50%)', display: 'flex', gap: 34,
        }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: 'relative' }}>
              {!candleBlown && (
                <div style={{
                  position: 'absolute', left: '50%', top: -60,
                  transform: `translateX(-50%) scale(${flameFlicker + i * 0.02})`,
                  width: 30, height: 52,
                  background: `radial-gradient(ellipse, ${PARTY.electricYellow} 30%, ${PARTY.orange} 70%, transparent)`,
                  borderRadius: '50% 50% 40% 40%', filter: 'blur(2px)',
                  boxShadow: `0 0 50px ${PARTY.orange}`,
                }}/>
              )}
              {candleBlown && localTime < 4 && (
                <div style={{
                  position: 'absolute', left: '50%', top: -60 - (localTime - 2.2) * 60,
                  transform: `translateX(-50%)`,
                  width: 34, height: 34,
                  background: 'rgba(200,200,200,0.4)',
                  borderRadius: '50%', filter: 'blur(8px)',
                  opacity: Math.max(0, 1 - (localTime - 2.2) * 0.5),
                }}/>
              )}
              <div style={{
                width: 18, height: 60,
                background: [PARTY.hotPink, PARTY.cyan, PARTY.electricYellow, PARTY.lime, PARTY.hotPink][i],
                border: `3px solid ${PARTY.black}`,
              }}/>
            </div>
          ))}
        </div>

        {/* Top tier */}
        <div style={{
          width: 720, height: 130, background: PARTY.hotPink,
          border: `6px solid ${PARTY.black}`,
          borderRadius: '0 0 12px 12px',
          position: 'relative',
        }}>
          {[60, 170, 280, 400, 520, 640].map((x, i) => (
            <div key={i} style={{
              position: 'absolute', left: x, top: -20,
              width: 56, height: 36, background: PARTY.cream,
              borderRadius: '0 0 28px 28px',
              border: `4px solid ${PARTY.black}`, borderTop: 'none',
            }}/>
          ))}
        </div>

        {/* Bottom tier */}
        <div style={{
          width: 540, margin: '0 auto', height: 120, background: PARTY.cyan,
          border: `6px solid ${PARTY.black}`, borderTop: 'none',
          position: 'relative',
        }}>
          {Array.from({ length: 18 }).map((_, i) => {
            const r = rand(i + 1);
            const c1 = r(); const c2 = r(); const c3 = r();
            return (
              <div key={i} style={{
                position: 'absolute',
                left: 20 + c1 * 500, top: 16 + c2 * 84,
                width: 18, height: 6,
                background: [PARTY.hotPink, PARTY.electricYellow, PARTY.lime, PARTY.orange][i % 4],
                transform: `rotate(${c3 * 360}deg)`, borderRadius: 2,
              }}/>
            );
          })}
        </div>
      </div>

      {/* ── The giant "45" — above cake, clear of wish text (appears after wish starts fading) ── */}
      {localTime > 1.6 && (() => {
        const t = Math.min(1, (localTime - 1.6) / 0.5);
        const ease = 1 - Math.pow(1 - t, 3);
        return (
          <div style={{
            position: 'absolute', left: '50%', top: 260,
            transform: `translate(-50%, 0) scale(${ease})`,
            fontFamily: DISPLAY_FONT, fontSize: 200,
            color: PARTY.electricYellow,
            WebkitTextStroke: `7px ${PARTY.black}`,
            textShadow: candleBlown ? `10px 10px 0 ${PARTY.hotPink}` : `0 0 60px ${PARTY.orange}`,
            lineHeight: 1,
            opacity: ease,
          }}>{AGE}</div>
        );
      })()}

      {/* ── Final "HAPPY BIRTHDAY JEREMY!" — single block, appears after candle blow ── */}
      {localTime > 3.0 && (() => {
        const t = Math.min(1, (localTime - 3.0) / 0.5);
        const ease = 1 - Math.pow(1 - t, 3);
        return (
          <div style={{
            position: 'absolute', left: '50%', bottom: 40,
            transform: `translateX(-50%) scale(${ease})`,
            textAlign: 'center',
            opacity: ease,
            width: '100%',
          }}>
            <div style={{
              fontFamily: DISPLAY_FONT, fontSize: 76,
              color: PARTY.cream,
              WebkitTextStroke: `4px ${PARTY.black}`,
              textShadow: `6px 6px 0 ${PARTY.hotPink}`,
              lineHeight: 1,
              marginBottom: 18,
              letterSpacing: '0.02em',
            }}>HAPPY BIRTHDAY</div>
            <div style={{
              fontFamily: DISPLAY_FONT, fontSize: 130,
              color: PARTY.electricYellow,
              WebkitTextStroke: `5px ${PARTY.black}`,
              textShadow: `10px 10px 0 ${PARTY.hotPink}`,
              lineHeight: 1,
            }}>{NAME}! 🎉</div>
          </div>
        );
      })()}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPOSITION — expanded 47s
function BirthdayVideo() {
  const tw = (typeof window !== 'undefined' && window.JEREMY_TWEAKS) || {};
  const confettiMult = typeof tw.confettiDensity === 'number' ? tw.confettiDensity : 1;
  return (
    <>
      <Sprite start={0}  end={3}><SceneIntro/></Sprite>
      <Sprite start={3}  end={7}><SceneTitle/></Sprite>
      <Sprite start={7}  end={12}><SceneOrigin/></Sprite>
      <Sprite start={12} end={17}><SceneCoolCard/></Sprite>
      <Sprite start={17} end={21}><SceneEntourage/></Sprite>
      <Sprite start={21} end={25}><SceneDadJoke/></Sprite>
      <Sprite start={25} end={29}><SceneBodyguard/></Sprite>
      <Sprite start={29} end={33}><SceneDadSim/></Sprite>
      <Sprite start={33} end={37}><SceneShowoff/></Sprite>
      <Sprite start={37} end={41}><SceneWarning/></Sprite>
      <Sprite start={41} end={47}><SceneFinale/></Sprite>

      <Sprite start={3} end={7}>
        <Confetti count={Math.round(70 * confettiMult)} seed={1} colors={[PARTY.hotPink, PARTY.electricYellow, PARTY.cyan, PARTY.lime, PARTY.orange]}/>
      </Sprite>
      <Sprite start={43} end={47}>
        <Confetti count={Math.round(120 * confettiMult)} seed={7} colors={[PARTY.hotPink, PARTY.electricYellow, PARTY.cyan, PARTY.lime, PARTY.orange, PARTY.cream]}/>
      </Sprite>
    </>
  );
}

Object.assign(window, { BirthdayVideo, PARTY });
  return (
    <>
      <Sprite start={0}  end={3}><SceneIntro/></Sprite>
      <Sprite start={3}  end={7}><SceneTitle/></Sprite>
      <Sprite start={7}  end={12}><SceneOrigin/></Sprite>
      <Sprite start={12} end={17}><SceneCoolCard/></Sprite>
      <Sprite start={17} end={21}><SceneEntourage/></Sprite>
      <Sprite start={21} end={25}><SceneDadJoke/></Sprite>
      <Sprite start={25} end={29}><SceneBodyguard/></Sprite>
      <Sprite start={29} end={33}><SceneDadSim/></Sprite>
      <Sprite start={33} end={37}><SceneShowoff/></Sprite>
      <Sprite start={37} end={41}><SceneWarning/></Sprite>
      <Sprite start={41} end={47}><SceneFinale/></Sprite>

      <Sprite start={3} end={7}>
        <Confetti count={70} seed={1} colors={[PARTY.hotPink, PARTY.electricYellow, PARTY.cyan, PARTY.lime, PARTY.orange]}/>
      </Sprite>
      <Sprite start={43} end={47}>
        <Confetti count={120} seed={7} colors={[PARTY.hotPink, PARTY.electricYellow, PARTY.cyan, PARTY.lime, PARTY.orange, PARTY.cream]}/>
      </Sprite>
    </>
  );
}

Object.assign(window, { BirthdayVideo, PARTY });
