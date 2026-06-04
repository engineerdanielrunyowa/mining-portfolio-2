'use client';

import { useState } from 'react';
import { Database, TestTube, Loader2 } from 'lucide-react';
import { updateDemoMode } from '@/lib/adminApi';

interface DemoModeToggleProps {
  initialValue: boolean;
  onToggle: (value: boolean) => void;
}

export default function DemoModeToggle({ initialValue, onToggle }: DemoModeToggleProps) {
  const [enabled, setEnabled] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newValue = !enabled;
    try {
      await updateDemoMode(newValue);
      setEnabled(newValue);
      onToggle(newValue);
    } catch (err) {
      console.error('Failed to toggle demo mode:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {enabled ? (
            <TestTube className="w-5 h-5 text-yellow-400" />
          ) : (
            <Database className="w-5 h-5 text-green-400" />
          )}
          <div>
            <h3 className="text-sm font-semibold text-white">Demo Mode</h3>
            <p className="text-xs text-white/40 mt-0.5">
              Currently showing:{' '}
              <span className={enabled ? 'text-yellow-400' : 'text-green-400'}>
                {enabled ? 'Mock Data' : 'Live Database'}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
            enabled ? 'bg-yellow-500/30' : 'bg-green-500/30'
          }`}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            </div>
          ) : (
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 ${
                enabled
                  ? 'left-0.5 bg-yellow-400'
                  : 'left-[calc(100%-26px)] bg-green-400'
              }`}
            />
          )}
        </button>
      </div>
    </div>
  );
}