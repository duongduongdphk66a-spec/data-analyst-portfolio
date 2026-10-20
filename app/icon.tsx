import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#0D7287',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 18,
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
