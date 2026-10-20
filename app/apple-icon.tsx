import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: '#0D7287',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 90,
            fontWeight: 900,
            color: 'white',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '-0.03em',
          }}
        >
          M.
        </span>
      </div>
    ),
    { ...size }
  );
}
