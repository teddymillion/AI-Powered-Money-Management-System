'use client';

import { useRouter } from 'next/navigation';

export function AIFloatingButton() {
  const router = useRouter();

  return (
    <>
      {/* Pulse ring — outside the button so overflow:hidden doesn't clip it */}
      <span
        className="fixed bottom-6 right-6 z-[9998] w-16 h-16 rounded-full bg-emerald-400/25 animate-ping pointer-events-none"
      />

      <button
        onClick={() => router.push('/assistant')}
        title="ስሙኒ AI Assistant"
        aria-label="ስሙኒ AI Assistant"
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        style={{
          boxShadow: '0 0 0 3px rgba(52,211,153,0.3), 0 0 30px 8px rgba(52,211,153,0.45), 0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/simuniai.png"
          alt="ስሙኒ AI"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </button>

      {/* Label */}
      <p
        className="fixed bottom-1 right-0 z-[9999] w-24 text-center text-[9px] font-bold text-emerald-400 pointer-events-none"
        style={{ textShadow: '0 0 8px rgba(52,211,153,0.9)' }}
      >
        ስሙኒ AI Assistant
      </p>
    </>
  );
}
