import { ImageResponse } from 'next/og';

export const alt = 'Ma Văn Hùng | Data Analyst Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0B0F17 0%, #0D7287 50%, #074553 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundSize: '40px 40px',
            backgroundImage:
              'linear-gradient(to right, rgba(155, 231, 250, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(155, 231, 250, 0.08) 1px, transparent 1px)',
          }}
        />

        {/* Logo Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #0D7287, #9BE7FA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            boxShadow: '0 8px 32px rgba(155, 231, 250, 0.3)',
          }}
        >
          <span
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            M.
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: '#F8FAFC',
            letterSpacing: '-0.03em',
            marginBottom: 12,
          }}
        >
          Ma Văn Hùng
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: '#9BE7FA',
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            marginBottom: 32,
          }}
        >
          Data Analyst
        </div>

        {/* Skills bar */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 40,
          }}
        >
          {['SQL', 'Python', 'Power BI', 'Recharts', 'Redis'].map((skill) => (
            <div
              key={skill}
              style={{
                padding: '8px 20px',
                borderRadius: 9999,
                background: 'rgba(155, 231, 250, 0.12)',
                border: '1px solid rgba(155, 231, 250, 0.25)',
                color: '#C8EEF7',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {skill}
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 16,
            color: 'rgba(248, 250, 252, 0.5)',
            fontWeight: 500,
          }}
        >
          Evidence-Driven Analytics · Interactive Case Studies · Live Visualizations
        </div>
      </div>
    ),
    { ...size }
  );
}
