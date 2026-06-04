'use client';

import { useEffect, useRef } from 'react';

export default function ScrollMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let gsapModule: typeof import('gsap') | null = null;
    let ScrollTriggerModule: any = null;

    async function initAnimation() {
      try {
        const [gsapImport, stImport] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        gsapModule = gsapImport;
        ScrollTriggerModule = stImport.ScrollTrigger;
        gsapModule.gsap.registerPlugin(ScrollTriggerModule);

        const container = containerRef.current;
        if (!container) return;

        const drillBit = container.querySelector('.drill-bit');
        const particles = container.querySelectorAll('.rock-particle');
        const conveyor = container.querySelector('.conveyor-line');

        if (!drillBit) return;

        const tl = gsapModule.gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
        });

        tl.fromTo(
          drillBit,
          { rotation: 0, scale: 1, opacity: 1 },
          { rotation: 180, scale: 0.3, opacity: 0, duration: 1 }
        );

        particles.forEach((particle, i) => {
          tl.fromTo(
            particle,
            { scale: 0, opacity: 0, x: 0, y: 0 },
            {
              scale: 1,
              opacity: 1,
              x: (i % 2 === 0 ? 1 : -1) * (40 + i * 20),
              y: 30 + i * 15,
              duration: 0.6,
              ease: 'power2.out',
            },
            0.2
          );
        });

        if (conveyor) {
          tl.fromTo(
            conveyor,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.inOut' },
            0.5
          );
        }

        hasAnimated.current = true;
      } catch (e) {
        // GSAP not available — degrade gracefully
      }
    }

    initAnimation();

    return () => {
      if (ScrollTriggerModule) {
        ScrollTriggerModule.getAll().forEach((t: any) => t.kill());
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-32 sm:h-48 overflow-hidden bg-gradient-to-b from-[#0F1923] to-bg-main dark:to-dark-bg flex items-center justify-center"
    >
      {/* Drill Bit SVG */}
      <svg
        className="drill-bit absolute w-12 h-12 sm:w-16 sm:h-16 text-accent-secondary"
        viewBox="0 0 64 64"
        fill="currentColor"
      >
        <path d="M32 0L28 24H36L32 0ZM32 64L36 40H28L32 64ZM0 32L24 36V28L0 32ZM64 32L40 28V36L64 32ZM8 8L26 22L22 26L8 8ZM56 56L38 42L42 38L56 56ZM56 8L42 26L38 22L56 8ZM8 56L22 38L26 42L8 56Z" />
      </svg>

      {/* Rock Particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rock-particle absolute w-3 h-3 sm:w-4 sm:h-4 bg-accent-secondary/60 rounded-sm"
          style={{ top: '50%', left: '50%' }}
        />
      ))}

      {/* Conveyor Line */}
      <div className="conveyor-line absolute bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-secondary/40 to-transparent origin-center" />
    </div>
  );
}