import { ImageResponse } from 'next/og';

// Social share preview for every page that doesn't define its own (WhatsApp, X, LinkedIn, ...).
export const alt = 'GuardianTag — emergency QR safety tags for bikers';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 35%, #2a2a2a 0%, #000000 65%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 10, color: '#a3a3a3', textTransform: 'uppercase' }}>
          Personal Safety Hardware
        </div>
        <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: 10, marginTop: 18 }}>GUARDIANTAG</div>
        <div style={{ fontSize: 38, color: '#d4d4d4', marginTop: 8, letterSpacing: 6 }}>SCAN | CONNECT | RETURN</div>
        <div style={{ display: 'flex', gap: 24, marginTop: 56 }}>
          <div style={{ display: 'flex', padding: '16px 36px', borderRadius: 999, background: '#ffffff', color: '#000000', fontSize: 32, fontWeight: 800 }}>
            Biker Tag — ₹499
          </div>
          <div style={{ display: 'flex', padding: '16px 36px', borderRadius: 999, border: '2px solid #525252', fontSize: 32 }}>
            No app • Number stays hidden
          </div>
        </div>
      </div>
    ),
    size
  );
}
