'use client';

import { useEffect, useState } from 'react';
import { Hexagon } from 'lucide-react';
import type { Specialisation } from '@/lib/types';
import { getSpecialisations } from '@/lib/api';
import { mockSpecialisations } from '@/lib/mockData';
import { useInView } from '@/hooks/useInView';

interface SpecialisationsProps {
  demoMode: boolean;
}

export default function Specialisations({ demoMode }: SpecialisationsProps) {
  const [specs, setSpecs] = useState<Specialisation[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useInView();

  useEffect(() => {
    async function load() {
      if (demoMode) {
        setSpecs(mockSpecialisations);
        setLoading(false);
        return;
      }
      try {
        const res = await getSpecialisations();
        setSpecs(res.data);
      } catch (err) {
        console.error('Failed to load specialisations:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [demoMode]);

  if (loading || specs.length === 0) return null;

  return (
    <section
      id="specialisations"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary/50 dark:bg-dark-bg-secondary/30"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-accent-primary dark:text-accent-secondary mb-3 text-center">
            Core Specialisations
          </h2>
          <p className="text-text-main/60 dark:text-dark-text/50 text-sm sm:text-base text-center mb-10 max-w-2xl mx-auto">
            Areas of technical expertise honed across multiple mining operations and commodity types.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {specs.map((spec, index) => (
            <div
              key={spec.id}
              className={`bg-white dark:bg-dark-bg-secondary rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-bg-secondary/50 dark:border-dark-bg/50 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-100 translate-y-0'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '${index * 100}ms',
              }}
            >
              <div className="w-12 h-12 rounded-lg bg-accent-secondary/10 flex items-center justify-center mb-4">
                {spec.icon_url ? (
                  <img
                    src={spec.icon_url}
                    alt=""
                    className="w-6 h-6"
                    loading="lazy"
                  />
                ) : (
                  <Hexagon className="w-6 h-6 text-accent-secondary" />
                )}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-accent-primary dark:text-white mb-2">
                {spec.title}
              </h3>
              <p className="text-sm text-text-main/60 dark:text-dark-text/50 leading-relaxed">
                {spec.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
