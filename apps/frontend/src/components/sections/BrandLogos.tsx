'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BrandLogo {
  src: string;
  alt: string;
  href?: string;
}

interface BrandLogosProps {
  logos: BrandLogo[];
  speed?: number;
  direction?: 'left' | 'right';
  logoHeight?: number;
  gap?: number;
  className?: string;
}

export function BrandLogos({
  logos,
  speed = 30,
  direction = 'left',
  logoHeight = 60,
  gap = 40,
  className = '',
}: BrandLogosProps) {
  // Duplicate logos for seamless infinite loop
  const duplicatedLogos = [...logos, ...logos];

  const animationDirection = direction === 'left' ? 'scroll-left' : 'scroll-right';

  return (
    <div className={`relative overflow-hidden bg-white py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-10 overflow-hidden">
          <div
            className={`flex items-center gap-10 ${animationDirection}`}
            style={{
              animationDuration: `${speed}s`,
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                style={{ height: `${logoHeight}px`, minWidth: `${logoHeight * 2}px` }}
                className="flex items-center justify-center flex-shrink-0"
              >
                {logo.href ? (
                  <Link
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logoHeight * 2}
                      height={logoHeight}
                      className="object-contain h-full w-auto"
                    />
                  </Link>
                ) : (
                  <div className="opacity-60 grayscale">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logoHeight * 2}
                      height={logoHeight}
                      className="object-contain h-full w-auto"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-10" />

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .scroll-left,
        .scroll-right {
          animation: ${animationDirection} ${speed}s linear infinite;
        }
      `}</style>
    </div>
  );
}

